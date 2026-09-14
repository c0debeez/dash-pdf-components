import threading
import time

import pytest
from dash import Dash
from werkzeug.serving import make_server

import dash_pdf_components as dpc


def _minimal_pdf() -> bytes:
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Length 48 >>\nstream\nBT /F1 18 Tf 20 100 Td (Local worker) Tj ET\nendstream",
    ]
    document = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, body in enumerate(objects, start=1):
        offsets.append(len(document))
        document.extend(f"{index} 0 obj\n".encode())
        document.extend(body)
        document.extend(b"\nendobj\n")
    xref = len(document)
    document.extend(f"xref\n0 {len(objects) + 1}\n".encode())
    document.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        document.extend(f"{offset:010d} 00000 n \n".encode())
    document.extend(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode())
    return bytes(document)


def _internal_link_pdf() -> bytes:
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>",
        (
            b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] "
            b"/Resources << /Font << /F1 4 0 R >> >> /Annots [5 0 R] /Contents 7 0 R >>"
        ),
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Type /Annot /Subtype /Link /Rect [15 75 185 125] /Border [0 0 1] /Dest [6 0 R /Fit] >>",
        (b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 8 0 R >>"),
        b"<< /Length 49 >>\nstream\nBT /F1 16 Tf 20 100 Td (Continue to page 2) Tj ET\nendstream",
        b"<< /Length 39 >>\nstream\nBT /F1 18 Tf 20 100 Td (Page two) Tj ET\nendstream",
    ]
    document = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, body in enumerate(objects, start=1):
        offsets.append(len(document))
        document.extend(f"{index} 0 obj\n".encode())
        document.extend(body)
        document.extend(b"\nendobj\n")
    xref = len(document)
    document.extend(f"xref\n0 {len(objects) + 1}\n".encode())
    document.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        document.extend(f"{offset:010d} 00000 n \n".encode())
    document.extend(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode())
    return bytes(document)


@pytest.mark.browser
@pytest.mark.parametrize("selection", [None, "all", [1]])
def test_existing_pdf_navigation_and_lazy_loading(browser, selection):
    app = Dash(__name__)
    app.layout = dpc.PDF(
        id="viewer", file={"data": list(_internal_link_pdf())}, pages=selection, fit="width", style={"width": 320, "height": 220}
    )
    server = make_server("127.0.0.1", 0, app.server, threaded=True)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    def script(code):
        return browser("execute/sync", {"script": code, "args": []})

    def wait(code, timeout=20):
        end = time.monotonic() + timeout
        while time.monotonic() < end:
            if script(code):
                return
            time.sleep(0.1)
        raise AssertionError(code)

    try:
        browser("url", {"url": f"http://127.0.0.1:{server.server_port}"})
        wait("return !!document.querySelector('#viewer [data-page-number=\"1\"] .annotationLayer a')")
        if selection == "all":
            wait("return !!document.querySelector('#viewer [data-page-number=\"2\"] canvas')")
        wait("return document.querySelector('#viewer canvas').getBoundingClientRect().width > 300")
        script("document.querySelector('#viewer .annotationLayer a').click()")
        wait("return window.dash_component_api.getLayout('viewer').props.itemClickData?.pageNumber === 2")
        if selection == [1]:
            assert not script("return !!document.querySelector('#viewer [data-page-number=\"2\"]')")
        elif selection == "all":
            wait("return document.querySelector('#viewer > div').scrollTop > 100")
            script("window.dash_clientside.set_props('viewer', {pageNumber:1})")
            wait("return document.querySelector('#viewer > div').scrollTop < 5")
        else:
            wait("return !!document.querySelector('#viewer [data-page-number=\"2\"] canvas')")
        requests = script("return performance.getEntriesByType('resource').map(e=>e.name)")
        assert any("async-pdf-viewer.js" in url for url in requests)
        assert not any("async-pdf-generator.js" in url for url in requests)
        logs = browser("log", {"type": "browser"})
        assert not [entry for entry in logs if entry["level"] == "SEVERE"], logs
    finally:
        server.shutdown()
        thread.join(timeout=10)
