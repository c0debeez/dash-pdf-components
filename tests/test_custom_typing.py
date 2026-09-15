"""Regression tests for Dash's build-time custom typing configuration."""

import dash_prop_typing


def annotation(component: str, prop: str) -> str:
    return dash_prop_typing.custom_props[component][prop]({}, component, prop)


def test_pdf_uses_html_container_style() -> None:
    assert annotation("PDF", "style") == "CSSStyle"


def test_renderer_nodes_use_pdf_styles() -> None:
    assert annotation("Document", "style") == "PDFStyleInput"
    assert annotation("Text", "style") == "PDFStyleInput"


def test_removed_output_components_are_not_configured() -> None:
    for component in ("PDFViewer", "PDFDownloadLink", "BlobProvider"):
        assert component not in dash_prop_typing.custom_props
        assert component not in dash_prop_typing.custom_imports
