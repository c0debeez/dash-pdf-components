import pytest
from dash import Dash, Input, Output, ctx, html

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
def test_pdf_renders_with_packaged_worker(dash_duo):
    app = Dash(__name__)
    app.layout = dpc.Document(
        dpc.Page(id="page", pageNumber=1),
        id="document",
        file={"data": list(_minimal_pdf())},
    )

    dash_duo.start_server(app)
    dash_duo.wait_for_element("#page canvas", timeout=30)
    assert dash_duo.find_elements("[data-pdf-action]") == []
    assert dash_duo.get_logs() == []


@pytest.mark.browser
def test_internal_link_navigates_single_page_document(dash_duo):
    app = Dash(__name__)
    app.layout = dpc.Document(
        dpc.Page(id="page", pageNumber=1),
        id="document",
        file={"data": list(_internal_link_pdf())},
    )

    dash_duo.start_server(app)
    dash_duo.wait_for_element('#page [data-page-number="1"] .annotationLayer a', timeout=30).click()
    dash_duo.wait_for_element('#page [data-page-number="2"]', timeout=30)
    assert dash_duo.get_logs() == []


@pytest.mark.browser
def test_pdf_viewer_internal_link_updates_rendered_page(dash_duo):
    app = Dash(__name__)
    app.layout = dpc.PDF(
        id="viewer",
        file={"data": list(_internal_link_pdf())},
        pageNumber=1,
    )

    dash_duo.start_server(app)
    dash_duo.wait_for_element('#viewer [data-page-number="1"] .annotationLayer a', timeout=30).click()
    dash_duo.wait_for_element('#viewer [data-page-number="2"]', timeout=30)
    assert dash_duo.get_logs() == []


@pytest.mark.browser
def test_thumbnail_repeated_clicks_emit_distinct_events(dash_duo):
    app = Dash(__name__)
    app.layout = html.Div(
        [
            dpc.Document(
                [
                    dpc.Thumbnail(id="thumbnail-1", pageNumber=1),
                    dpc.Thumbnail(id="thumbnail-2", pageNumber=2),
                ],
                file={"data": list(_internal_link_pdf())},
            ),
            html.Div(id="selected-page"),
        ]
    )

    @app.callback(
        Output("selected-page", "children"),
        Input("thumbnail-1", "itemClickData"),
        Input("thumbnail-2", "itemClickData"),
        prevent_initial_call=True,
    )
    def show_selected_page(first, second):
        item = first if ctx.triggered_id == "thumbnail-1" else second
        return str(item["pageNumber"])

    dash_duo.start_server(app)
    first = dash_duo.wait_for_element("#thumbnail-1 canvas", timeout=30)
    second = dash_duo.wait_for_element("#thumbnail-2 canvas", timeout=30)
    first.click()
    dash_duo.wait_for_text_to_equal("#selected-page", "1", timeout=5)
    second.click()
    dash_duo.wait_for_text_to_equal("#selected-page", "2", timeout=5)
    first.click()
    dash_duo.wait_for_text_to_equal("#selected-page", "1", timeout=5)
    assert dash_duo.get_logs() == []
