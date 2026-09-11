import base64

from dash import Dash, Input, Output, State, ctx, dcc, html

import dash_pdf_components as dpc

PDFJS_CDN = "https://registry.npmmirror.com/pdfjs-dist/5.4.296/files/"


def create_demo_pdf() -> str:
    """Return a self-contained two-page PDF as a data URI."""
    streams = [
        b"BT /F1 24 Tf 72 740 Td (dash-pdf-components) Tj 0 -40 Td /F1 14 Tf (Page 1 rendered by React-PDF.) Tj ET",
        b"BT /F1 24 Tf 72 740 Td (Rendering only) Tj 0 -40 Td /F1 14 Tf (Controls belong to the Dash app.) Tj ET",
    ]
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 6 0 R >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 7 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        *(f"<< /Length {len(stream)} >>\nstream\n".encode() + stream + b"\nendstream" for stream in streams),
    ]
    document = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, body in enumerate(objects, start=1):
        offsets.append(len(document))
        document.extend(f"{index} 0 obj\n".encode())
        document.extend(body)
        document.extend(b"\nendobj\n")
    xref_offset = len(document)
    document.extend(f"xref\n0 {len(objects) + 1}\n".encode())
    document.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        document.extend(f"{offset:010d} 00000 n \n".encode())
    document.extend(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode())
    return "data:application/pdf;base64," + base64.b64encode(document).decode()


app = Dash(__name__)
app.layout = html.Main(
    [
        html.H2("dash-pdf-components"),
        html.Div(
            [
                html.Button("Previous", id="previous-page"),
                html.Button("Next", id="next-page"),
                html.Button("Zoom out", id="zoom-out"),
                html.Button("Zoom in", id="zoom-in"),
                html.Button("Rotate", id="rotate-page"),
                html.Span(id="page-status"),
            ],
            style={"display": "flex", "gap": 8, "alignItems": "center", "marginBottom": 16},
        ),
        dcc.RadioItems(
            id="asset-source",
            options=[
                {"label": "Package assets (default)", "value": "local"},
                {"label": "npmmirror CDN", "value": "cdn"},
            ],
            value="local",
            inline=True,
        ),
        dcc.Upload(id="pdf-upload", children=html.Button("Choose a PDF"), accept="application/pdf", multiple=False),
        dpc.PDF(
            id="pdf-viewer",
            file=create_demo_pdf(),
            pageNumber=1,
            scale=1,
            rotate=0,
            renderForms=True,
            error=html.Div("Unable to load PDF."),
            style={"marginTop": 16},
        ),
    ],
    style={"maxWidth": 960, "margin": "32px auto", "padding": "0 16px"},
)


@app.callback(
    Output("pdf-viewer", "file"),
    Output("pdf-viewer", "assetBaseUrl"),
    Input("pdf-upload", "contents"),
    Input("asset-source", "value"),
)
def update_document(contents: str | None, asset_source: str):
    return contents or create_demo_pdf(), PDFJS_CDN if asset_source == "cdn" else None


@app.callback(
    Output("pdf-viewer", "pageNumber"),
    Output("pdf-viewer", "scale"),
    Output("pdf-viewer", "rotate"),
    Input("previous-page", "n_clicks"),
    Input("next-page", "n_clicks"),
    Input("zoom-out", "n_clicks"),
    Input("zoom-in", "n_clicks"),
    Input("rotate-page", "n_clicks"),
    State("pdf-viewer", "pageNumber"),
    State("pdf-viewer", "scale"),
    State("pdf-viewer", "rotate"),
    State("pdf-viewer", "numPages"),
    prevent_initial_call=True,
)
def control_page(_, __, ___, ____, _____, page, scale, rotate, num_pages):
    page, scale, rotate = page or 1, scale or 1, rotate or 0
    if ctx.triggered_id == "previous-page":
        page = max(1, page - 1)
    elif ctx.triggered_id == "next-page":
        page = min(num_pages or page, page + 1)
    elif ctx.triggered_id == "zoom-out":
        scale = max(0.25, round(scale - 0.25, 2))
    elif ctx.triggered_id == "zoom-in":
        scale = min(4, round(scale + 0.25, 2))
    elif ctx.triggered_id == "rotate-page":
        rotate = (rotate + 90) % 360
    return page, scale, rotate


@app.callback(
    Output("page-status", "children"),
    Input("pdf-viewer", "pageNumber"),
    Input("pdf-viewer", "numPages"),
)
def show_page(page, num_pages):
    return f"Page {page or 1} / {num_pages or '-'}"


if __name__ == "__main__":
    app.run(debug=True)
