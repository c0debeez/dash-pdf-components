"""PDF reader demo. Prefer Ant Design when installed; set PDF_UI to override."""

import base64
import os
from importlib.util import find_spec
from pathlib import Path
from uuid import uuid4

from dash import ALL, ClientsideFunction, Dash, Input, Output, State, ctx, dcc, html, no_update

import dash_pdf_components as dpc


def select_ui():
    requested = os.environ.get("PDF_UI", "auto").lower()
    if requested not in {"auto", "antd", "mantine"}:
        raise RuntimeError("PDF_UI must be auto, antd, or mantine.")
    libraries = {"antd": "dash_antd_components", "mantine": "dash_mantine_components"}
    for ui, library in libraries.items():
        if requested in {"auto", ui} and find_spec(library) is not None:
            return ui
    raise RuntimeError(
        "Install a demo UI library: pip install dash-ant-design "
        "or pip install dash-mantine-components dash-iconify. "
        "If PDF_UI is set, install the selected library."
    )


UI = select_ui()

ASSETS = Path(__file__).resolve().parent / "assets"
PDF_URL = "/assets/documents/demo.pdf"
ENCRYPTED_PDF_URL = "/assets/documents/demo-encrypted.pdf"
PAGE_COUNT = 3
PAGE_WIDTH = 600
ZOOM_PRESETS = (0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4)
ZOOM_OPTIONS = [{"label": f"{int(value * 100)}%", "value": str(value)} for value in ZOOM_PRESETS]
ZOOM_OPTIONS.append({"label": "Fit width", "value": "fit"})


def stores():
    return [
        dcc.Store(id="pdf-current-page", data=1),
        dcc.Store(id="pdf-viewport-width", data=PAGE_WIDTH),
        dcc.Download(id="pdf-download"),
    ]


def document(error):
    return dpc.Document(
        html.Div(
            [
                html.Aside(
                    [
                        html.H4("Contents"),
                        dpc.Outline(id="pdf-outline"),
                        html.Div(id="pdf-outline-empty"),
                        html.H4("Thumbnails"),
                        html.Div(id="pdf-thumbnails"),
                    ],
                    className="pdf-sidebar",
                ),
                html.Div(id="pdf-pages", className="pdf-pages"),
            ],
            className="pdf-reader",
        ),
        id="pdf-document",
        file=PDF_URL,
        loading="",
        error=error,
        style={"minHeight": 480, "width": "100%"},
    )


def render_pages(page, num_pages, mode, scale, rotation_clicks, viewport_width):
    if not num_pages:
        return []
    changed = set(ctx.triggered_prop_ids)
    navigation_only = changed <= {"pdf-current-page.data", "pdf-viewport-width.data"}
    if navigation_only and mode == "continuous" and (scale != "fit" or "pdf-viewport-width.data" not in changed):
        return no_update
    if changed == {"pdf-viewport-width.data"} and scale != "fit":
        return no_update
    numbers = range(1, num_pages + 1) if mode == "continuous" else [max(1, min(int(page or 1), num_pages))]
    return [
        dpc.Page(
            id={"type": "pdf-page", "index": number},
            pageNumber=number,
            width=max(1, viewport_width or PAGE_WIDTH) if scale == "fit" else PAGE_WIDTH,
            scale=1 if scale == "fit" else float(scale or 1),
            rotate=((rotation_clicks or 0) * 90) % 360,
            renderForms=True,
            loading="",
            error=html.Div("Unable to load page", role="alert"),
            className="pdf-page",
        )
        for number in numbers
    ]


def render_thumbnails(num_pages):
    return [
        html.Div(
            [
                dpc.Thumbnail(id={"type": "pdf-thumbnail", "index": number}, pageNumber=number, width=130, loading=""),
                html.Div(f"Page {number}"),
            ],
            className="pdf-thumbnail",
            **{"data-thumbnail-page": str(number)},
        )
        for number in range(1, (num_pages or 0) + 1)
    ]


def calculate_progress(progress, num_pages, error):
    if error:
        return 0, "exception"
    if num_pages:
        return 100, "success"
    progress = progress or {}
    total = progress.get("total", 0)
    percent = min(100, max(0, round(progress.get("loaded", 0) / total * 100))) if total else 0
    return percent, "active"


def update_document(contents, _reset_clicks, _encrypted_clicks, _unlock_clicks, password):
    if ctx.triggered_id == "pdf-unlock":
        return no_update, password or "", ""
    if ctx.triggered_id == "pdf-encrypted":
        return ENCRYPTED_PDF_URL, "", ""
    return (contents if ctx.triggered_id == "pdf-upload" and contents else PDF_URL), "", ""


def download_pdf(_n_clicks, file, filename):
    if file and file.startswith("data:"):
        return dcc.send_bytes(
            base64.b64decode(file.split(",", 1)[1]), Path(filename or "document.pdf").name, type="application/pdf"
        )
    name = "demo-encrypted.pdf" if file == ENCRYPTED_PDF_URL else "demo.pdf"
    return dcc.send_file(str(ASSETS / "documents" / name), type="application/pdf")


def register_callbacks(app, loading_output):
    app.clientside_callback(
        ClientsideFunction(namespace="pdfViewer", function_name="navigate"),
        Output("pdf-current-page", "data"),
        Output("pdf-page-number", "value"),
        Input("pdf-previous", "n_clicks"),
        Input("pdf-next", "n_clicks"),
        Input("pdf-page-number", "value"),
        Input("pdf-document", "itemClickData"),
        Input("pdf-outline", "itemClickData"),
        Input({"type": "pdf-thumbnail", "index": ALL}, "itemClickData"),
        Input("pdf-document", "numPages"),
        Input("pdf-document", "file"),
        State("pdf-current-page", "data"),
        prevent_initial_call=True,
    )
    app.clientside_callback(
        ClientsideFunction(namespace="pdfViewer", function_name="zoom"),
        Output("pdf-scale", "value"),
        Input("pdf-zoom-out", "n_clicks"),
        Input("pdf-zoom-in", "n_clicks"),
        Input("pdf-fit-width", "n_clicks"),
        State("pdf-scale", "value"),
        State("pdf-viewport-width", "data"),
        prevent_initial_call=True,
    )
    app.clientside_callback(
        ClientsideFunction(namespace="pdfViewer", function_name="measure"),
        Output("pdf-viewport-width", "data"),
        Input("pdf-document", "numPages"),
        Input("pdf-reading-mode", "value"),
    )
    app.clientside_callback(
        ClientsideFunction(namespace="pdfViewer", function_name="scroll"),
        Output("pdf-pages", "title"),
        Input("pdf-current-page", "data"),
        Input("pdf-reading-mode", "value"),
        Input("pdf-pages", "children"),
        Input("pdf-document", "itemClickData"),
        Input("pdf-outline", "itemClickData"),
        Input({"type": "pdf-thumbnail", "index": ALL}, "itemClickData"),
        Input({"type": "pdf-page", "index": ALL}, "renderData"),
        Input("pdf-thumbnails", "children"),
    )
    app.clientside_callback(
        ClientsideFunction(namespace="pdfViewer", function_name="status"),
        Output("pdf-page-count", "children"),
        Output("pdf-page-number", "max"),
        loading_output,
        Output("pdf-previous", "disabled"),
        Output("pdf-next", "disabled"),
        Output("pdf-download-button", "disabled"),
        Input("pdf-document", "numPages"),
        Input("pdf-document", "errorData"),
        Input("pdf-document", "passwordData"),
        Input("pdf-current-page", "data"),
    )
    app.callback(
        Output("pdf-pages", "children"),
        Input("pdf-current-page", "data"),
        Input("pdf-document", "numPages"),
        Input("pdf-reading-mode", "value"),
        Input("pdf-scale", "value"),
        Input("pdf-rotate", "n_clicks"),
        Input("pdf-viewport-width", "data"),
    )(render_pages)
    app.callback(Output("pdf-thumbnails", "children"), Input("pdf-document", "numPages"))(render_thumbnails)
    app.callback(
        Output("pdf-outline-empty", "children"),
        Input("pdf-outline", "outlineData"),
        Input("pdf-document", "numPages"),
    )(lambda outline, count: "This document has no outline" if count and not outline else "")
    app.callback(
        Output("pdf-document", "file"),
        Output("pdf-document", "password"),
        Output("pdf-password-input", "value"),
        Input("pdf-upload", "contents"),
        Input("pdf-reset", "n_clicks"),
        Input("pdf-encrypted", "n_clicks"),
        Input("pdf-unlock", "n_clicks"),
        State("pdf-password-input", "value"),
        prevent_initial_call=True,
        running=[(Output("pdf-unlock", "disabled"), True, False)],
    )(update_document)
    app.callback(
        Output("pdf-download", "data"),
        Input("pdf-download-button", "n_clicks"),
        State("pdf-document", "file"),
        State("pdf-upload", "filename"),
        prevent_initial_call=True,
    )(download_pdf)


if UI == "antd":
    import dash_antd_components as dac

    def icon_button(id, icon, label):
        return dac.Tooltip(
            dac.Button(id=id, icon=dac.Icon(icon=icon, ariaLabel=label), shape="circle"),
            title=label,
        )

    app = Dash(__name__, assets_folder=str(ASSETS))
    app.layout = dac.ConfigProvider(
        dac.Flex(
            [
                *stores(),
                html.Div(id="pdf-message"),
                dac.Space(
                    [
                        dcc.Upload(
                            dac.Button("Upload PDF"),
                            id="pdf-upload",
                            accept="application/pdf,.pdf",
                            max_size=20 * 1024 * 1024,
                        ),
                        dac.Button("Reset demo", id="pdf-reset"),
                        dac.Button("Encrypted demo (password: dash-pdf)", id="pdf-encrypted"),
                        dac.RadioGroup(
                            id="pdf-reading-mode",
                            options=[
                                {"label": "Single page", "value": "single"},
                                {"label": "Continuous", "value": "continuous"},
                            ],
                            value="single",
                        ),
                    ],
                    wrap=True,
                ),
                dac.Space(
                    [
                        icon_button("pdf-previous", "left-outlined", "Previous page"),
                        dac.InputNumber(
                            id="pdf-page-number", value=1, min=1, max=PAGE_COUNT, precision=0, style={"width": 88}
                        ),
                        dac.Text(id="pdf-page-count", type="secondary"),
                        icon_button("pdf-next", "right-outlined", "Next page"),
                        icon_button("pdf-zoom-out", "zoom-out-outlined", "Zoom out"),
                        dac.Select(id="pdf-scale", value="1", options=ZOOM_OPTIONS, style={"width": 120}),
                        icon_button("pdf-zoom-in", "zoom-in-outlined", "Zoom in"),
                        icon_button("pdf-fit-width", "column-width-outlined", "Fit width"),
                        icon_button("pdf-rotate", "rotate-right-outlined", "Rotate"),
                        icon_button("pdf-download-button", "download-outlined", "Download"),
                    ],
                    wrap=True,
                    align="center",
                ),
                dac.Progress(id="pdf-progress", percent=0, size="small"),
                dac.Space(
                    [
                        dac.Text("This PDF requires a password."),
                        dac.Input(
                            id="pdf-password-input", type="password", placeholder="PDF password", style={"width": 220}
                        ),
                        dac.Button("Unlock", id="pdf-unlock", type="primary"),
                    ],
                    id="pdf-password-prompt",
                    wrap=True,
                    style={"display": "none"},
                ),
                dac.Spin(
                    document(dac.Alert(title="Unable to load PDF", type="error", showIcon=True)),
                    id="pdf-loading",
                    spinning=True,
                    style={"width": "100%"},
                ),
            ],
            vertical=True,
            gap="middle",
            style={"maxWidth": 960, "margin": "32px auto", "padding": "0 16px"},
        ),
        locale="en_US",
    )
    register_callbacks(app, Output("pdf-loading", "spinning"))

    @app.callback(
        Output("pdf-password-prompt", "style"), Output("pdf-message", "children"), Input("pdf-document", "passwordData")
    )
    def show_password_prompt(challenge):
        if not challenge:
            return {"display": "none"}, None
        message = (
            dac.Message("Incorrect password. Try again.", type="error", key=str(uuid4()))
            if challenge.get("reason") == "incorrect-password"
            else None
        )
        return {}, message

    @app.callback(
        Output("pdf-progress", "percent"),
        Output("pdf-progress", "status"),
        Input("pdf-document", "loadProgress"),
        Input("pdf-document", "numPages"),
        Input("pdf-document", "errorData"),
    )
    def show_progress(progress, num_pages, error):
        return calculate_progress(progress, num_pages, error)


else:
    import dash_mantine_components as dmc
    from dash_iconify import DashIconify

    def icon_button(id, icon, label):
        return dmc.Tooltip(
            dmc.ActionIcon(
                DashIconify(icon=f"tabler:{icon}", width=20),
                id=id,
                variant="default",
                size="input-sm",
                **{"aria-label": label},
            ),
            label=label,
        )

    app = Dash(__name__, assets_folder=str(ASSETS))
    app.layout = dmc.MantineProvider(
        dmc.Container(
            dmc.Stack(
                [
                    *stores(),
                    dmc.NotificationContainer(id="pdf-message", position="top-center"),
                    dmc.Group(
                        [
                            dcc.Upload(
                                dmc.Button("Upload PDF", variant="default"),
                                id="pdf-upload",
                                accept="application/pdf,.pdf",
                                max_size=20 * 1024 * 1024,
                            ),
                            dmc.Button("Reset demo", id="pdf-reset", variant="default"),
                            dmc.Button("Encrypted demo (password: dash-pdf)", id="pdf-encrypted", variant="default"),
                            dmc.SegmentedControl(
                                id="pdf-reading-mode",
                                value="single",
                                data=[
                                    {"label": "Single page", "value": "single"},
                                    {"label": "Continuous", "value": "continuous"},
                                ],
                            ),
                        ],
                        gap="sm",
                        wrap="wrap",
                    ),
                    dmc.Group(
                        [
                            icon_button("pdf-previous", "chevron-left", "Previous page"),
                            dmc.NumberInput(
                                id="pdf-page-number", value=1, min=1, max=PAGE_COUNT, allowDecimal=False, w=88
                            ),
                            dmc.Text(id="pdf-page-count", c="dimmed", size="sm"),
                            icon_button("pdf-next", "chevron-right", "Next page"),
                            icon_button("pdf-zoom-out", "zoom-out", "Zoom out"),
                            dmc.Select(id="pdf-scale", value="1", data=ZOOM_OPTIONS, allowDeselect=False, w=120),
                            icon_button("pdf-zoom-in", "zoom-in", "Zoom in"),
                            icon_button("pdf-fit-width", "arrows-horizontal", "Fit width"),
                            icon_button("pdf-rotate", "rotate-clockwise", "Rotate"),
                            icon_button("pdf-download-button", "download", "Download"),
                        ],
                        gap="xs",
                        wrap="wrap",
                    ),
                    dmc.Group(
                        [
                            dmc.Progress(
                                id="pdf-progress", value=0, style={"flex": 1}, **{"aria-label": "PDF loading progress"}
                            ),
                            dmc.Text(id="pdf-progress-label", size="sm", w=40),
                        ],
                        gap="sm",
                    ),
                    dmc.Group(
                        [
                            dmc.Text("This PDF requires a password.", size="sm"),
                            dmc.PasswordInput(id="pdf-password-input", placeholder="PDF password", w=220),
                            dmc.Button("Unlock", id="pdf-unlock"),
                        ],
                        id="pdf-password-prompt",
                        wrap="wrap",
                        style={"display": "none"},
                    ),
                    dmc.Box(
                        [
                            document(dmc.Alert("Unable to load PDF", color="red", title="PDF error")),
                            dmc.LoadingOverlay(id="pdf-loading", visible=True, loaderProps={"type": "oval"}, zIndex=10),
                        ],
                        pos="relative",
                    ),
                ],
                gap="md",
            ),
            size=960,
            my=32,
        ),
        defaultColorScheme="light",
    )
    register_callbacks(app, Output("pdf-loading", "visible"))

    @app.callback(
        Output("pdf-password-prompt", "style"),
        Output("pdf-message", "sendNotifications"),
        Input("pdf-document", "passwordData"),
    )
    def show_password_prompt(challenge):
        if not challenge:
            return {"display": "none"}, []
        notifications = (
            [{"action": "show", "id": str(uuid4()), "message": "Incorrect password. Try again.", "color": "red"}]
            if challenge.get("reason") == "incorrect-password"
            else []
        )
        return {}, notifications

    @app.callback(
        Output("pdf-progress", "value"),
        Output("pdf-progress", "color"),
        Output("pdf-progress-label", "children"),
        Input("pdf-document", "loadProgress"),
        Input("pdf-document", "numPages"),
        Input("pdf-document", "errorData"),
    )
    def show_progress(progress, num_pages, error):
        percent, status = calculate_progress(progress, num_pages, error)
        return percent, {"exception": "red", "success": "teal", "active": "blue"}[status], f"{percent}%"


if __name__ == "__main__":
    app.run(debug=False)
