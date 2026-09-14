"""Run with uv run python usage.py after pnpm run build."""

from pathlib import Path

from dash import Dash, Input, Output, dcc, html

import dash_pdf_components as dpr
from examples.gallery import MANIFEST, get_example

app = Dash(__name__, assets_folder=str(Path(__file__).resolve().parents[1] / "assets"))


DEFAULT_EXAMPLE = "playground-svg"
initial_document, initial_config = get_example(DEFAULT_EXAMPLE)

app.layout = html.Div(
    [
        html.H2("React-PDF official examples"),
        html.P("75 examples from the official repository and Playground, generated using Dash PDF components."),
        dcc.Dropdown(
            id="example",
            options=[{"label": f"{item['group']} · {item['name']}", "value": item["id"]} for item in MANIFEST],
            value=DEFAULT_EXAMPLE,
            clearable=False,
        ),
        html.Div(id="example-details", style={"margin": "12px 0"}),
        dpr.PDF(
            id="preview",
            document=initial_document,
            fileName="page-wrap.pdf",
            style={"height": "75vh"},
            fit="page",
            showDownload=False,
            **initial_config,
        ),
        html.Div(id="status"),
        html.Details(
            [
                html.Summary("Additional output examples"),
                html.P("Generate a separate download or send the PDF to Python as Base64."),
                html.Button("Generate download", id="generate-download", n_clicks=0),
                dpr.PDF(
                    mode="download",
                    id="download",
                    document=initial_document,
                    downloadLabel="Download PDF",
                    fileName="page-wrap.pdf",
                    autoGenerate=False,
                    **initial_config,
                ),
                html.Button("Generate Base64", id="generate-base64", n_clicks=0),
                dpr.PDF(
                    mode="blob",
                    id="provider",
                    document=initial_document,
                    autoGenerate=False,
                    returnBase64=True,
                    **initial_config,
                ),
                html.Div(id="base64-status"),
            ],
            style={"marginTop": 20},
        ),
    ],
    style={"maxWidth": 1100, "margin": "32px auto", "padding": "0 20px"},
)


@app.callback(
    [Output("preview", "document"), Output("download", "document"), Output("provider", "document")]
    + [
        Output(output, field)
        for output in ["preview", "download", "provider"]
        for field in ["fonts", "emojiSource", "hyphenationCallback"]
    ]
    + [Output(output, "fileName") for output in ["preview", "download", "provider"]]
    + [Output("example-details", "children")],
    Input("example", "value"),
)
def update_document(identifier):
    document, config = get_example(identifier)
    metadata = next(item for item in MANIFEST if item["id"] == identifier)
    details = html.A("View official source", href=metadata["source"], target="_blank")
    if metadata["description"]:
        details = [details, html.Span(" · " + metadata["description"])]
    return (
        [document, document, document]
        + [config[field] for _ in range(3) for field in ["fonts", "emojiSource", "hyphenationCallback"]]
        + [identifier + ".pdf"] * 3
        + [details]
    )


@app.callback(Output("download", "n_generate"), Input("generate-download", "n_clicks"), prevent_initial_call=True)
def generate_download(clicks):
    return clicks


@app.callback(Output("provider", "n_generate"), Input("generate-base64", "n_clicks"), prevent_initial_call=True)
def generate_base64(clicks):
    return clicks


@app.callback(Output("base64-status", "children"), Input("provider", "data"))
def receive_pdf(data):
    import base64

    return f"Python received {len(base64.b64decode(data)):,} PDF bytes" if data else ""


@app.callback(
    Output("status", "children"), Input("preview", "generating"), Input("preview", "errorData"), Input("preview", "size")
)
def generation_status(loading, error, size):
    if error:
        return f"Generation failed: {error}"
    return "Generating…" if loading else f"PDF ready: {size or 0:,} bytes"


if __name__ == "__main__":
    app.run(debug=True)
