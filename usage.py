"""Generate/read PDFs; PDF_DEMO=basic is display-only, PDF_DEMO=gallery runs all 75 examples."""

import base64
import os
from pathlib import Path

from dash import Dash, Input, Output, State, ctx, dcc, get_asset_url, html, no_update

import dash_pdf_components as dpc


def report_document(title, text):
    return dpc.Document(
        dpc.Page(
            [
                dpc.Text(title, style={"fontSize": 20, "marginBottom": 16}),
                dpc.Text(text, style={"fontSize": 12, "lineHeight": 1.5}),
                dpc.Text(
                    renderTemplate="{pageNumber} / {totalPages}",
                    fixed=True,
                    style={"position": "absolute", "bottom": 20, "right": 36, "fontSize": 10},
                ),
            ],
            size="A4",
            style={"padding": 36},
        ),
        title=title,
    )


def create_app(demo="default"):
    if demo == "gallery":
        from examples.usage import app

        return app

    app = Dash(__name__, assets_folder=str(Path(__file__).resolve().parent / "assets"))
    viewer = dpc.PDF(
        id="pdf",
        file=get_asset_url("documents/quixote.pdf"),
        pages="all",
        fit="width",
        style={"height": "75vh"},
    )

    if demo == "basic":
        app.layout = viewer
    else:
        app.layout = html.Div(
            [
                html.H1("Dash PDF"),
                html.H2("Generate PDF"),
                html.P("Edit the document, choose an output mode, then generate. No UI library is required."),
                dcc.Input(id="report-title", value="Dash PDF report", placeholder="Document title", debounce=True),
                dcc.Textarea(
                    id="report-text",
                    value="This PDF is generated in the browser from Document, Page and Text components.",
                    style={"width": "100%", "minHeight": "100px", "marginTop": "12px"},
                ),
                dcc.RadioItems(
                    id="output-mode",
                    options=[
                        {"label": label, "value": mode}
                        for label, mode in (("Preview", "viewer"), ("Download", "download"), ("Base64 to Python", "blob"))
                    ],
                    value="viewer",
                    inline=True,
                ),
                html.Button("Generate PDF", id="generate-report", n_clicks=0),
                dpc.PDF(
                    id="generated",
                    document=report_document("Dash PDF report", "Click Generate PDF to create the document."),
                    autoGenerate=False,
                    showDownload=True,
                    fileName="report.pdf",
                    style={"height": "55vh"},
                ),
                html.Div(id="generation-status", role="status"),
                html.H2("Read an existing PDF"),
                html.Div(
                    [
                        dcc.Upload(html.Button("Upload PDF"), id="upload", accept="application/pdf", multiple=False),
                        html.Button("Previous", id="previous"),
                        html.Button("Next", id="next"),
                        html.Span(id="status"),
                        dcc.Dropdown(
                            id="scale",
                            options=[{"label": f"{value:.0%}", "value": value} for value in (0.5, 0.75, 1, 1.25, 1.5, 2)],
                            value=1,
                            clearable=False,
                            style={"width": "110px"},
                        ),
                        html.Button("Rotate", id="rotate"),
                        dcc.RadioItems(
                            id="mode",
                            options=[{"label": "Single page", "value": "single"}, {"label": "All pages", "value": "all"}],
                            value="all",
                            inline=True,
                        ),
                        dcc.Input(id="password", type="password", placeholder="PDF password", debounce=True),
                    ],
                    style={"display": "flex", "gap": "12px", "alignItems": "center", "flexWrap": "wrap"},
                ),
                viewer,
                html.Div(id="error"),
            ],
            style={"maxWidth": "960px", "margin": "auto"},
        )

        @app.callback(
            Output("generated", "document"),
            Output("generated", "n_generate"),
            Input("generate-report", "n_clicks"),
            State("report-title", "value"),
            State("report-text", "value"),
            prevent_initial_call=True,
        )
        def generate_report(clicks, title, text):
            return report_document(title or "Report", text or ""), clicks

        @app.callback(
            Output("generated", "mode"),
            Output("generated", "returnBase64"),
            Output("generated", "style"),
            Input("output-mode", "value"),
        )
        def output_mode(mode):
            return mode, mode == "blob", {"height": "55vh"} if mode == "viewer" else {}

        @app.callback(
            Output("generation-status", "children"),
            Input("generated", "generating"),
            Input("generated", "errorData"),
            Input("generated", "size"),
            Input("generated", "data"),
        )
        def generation_status(generating, error, size, data):
            if error:
                return error["message"]
            if generating:
                return "Generating PDF…"
            if data:
                return f"Python received {len(base64.b64decode(data)):,} PDF bytes."
            return f"PDF generated: {size:,} bytes." if size else "Ready to generate."

        @app.callback(
            Output("pdf", "pageNumber"),
            Input("previous", "n_clicks"),
            Input("next", "n_clicks"),
            State("pdf", "pageNumber"),
            State("pdf", "numPages"),
            prevent_initial_call=True,
        )
        def navigate(_previous, _next, page, count):
            if not count:
                return no_update
            step = -1 if ctx.triggered_id == "previous" else 1
            return max(1, min((page or 1) + step, count))

        @app.callback(Output("pdf", "file"), Input("upload", "contents"), prevent_initial_call=True)
        def upload(contents):
            return contents or no_update

        @app.callback(Output("pdf", "scale"), Input("scale", "value"))
        def zoom(value):
            return value

        @app.callback(Output("pdf", "rotate"), Input("rotate", "n_clicks"), prevent_initial_call=True)
        def rotate(clicks):
            return ((clicks or 0) * 90) % 360

        @app.callback(Output("pdf", "pages"), Input("mode", "value"))
        def reading_mode(mode):
            return "all" if mode == "all" else None

        @app.callback(Output("pdf", "password"), Input("password", "value"), prevent_initial_call=True)
        def password(value):
            return value or ""

        @app.callback(
            Output("status", "children"),
            Output("error", "children"),
            Input("pdf", "pageNumber"),
            Input("pdf", "numPages"),
            Input("pdf", "errorData"),
            Input("pdf", "passwordData"),
        )
        def status(page, count, error, challenge):
            message = (error or {}).get("message", "")
            if challenge:
                message = "Enter the PDF password." if challenge["reason"] == "need-password" else "Incorrect PDF password."
            return f"{page or 1} / {count or '—'}", message

    return app


app = create_app(os.environ.get("PDF_DEMO", "default"))

if __name__ == "__main__":
    app.run(debug=True)
