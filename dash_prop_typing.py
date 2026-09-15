"""Generate custom Python types during ``dash-generate-components``.

Dash automatically imports this module at build time. See:

- https://github.com/plotly/dash/pull/3152
- https://github.com/plotly/dash/pull/3220
- https://dash.plotly.com/dash-3-for-component-developers#custom-typing-generator
"""

import json
from collections.abc import Callable
from pathlib import Path
from typing import Any, TypeAlias

root = Path(__file__).parent
components = json.loads((root / "docs/api-mapping.json").read_text())["components"]
imports = "from ._typing import FunctionProps, PDFStyleInput, CSSStyle, Bookmark, Permissions, FontRegistration, FontDescriptor, ImageSource, PageSize, FormFormatting"
renderer_components = {
    name: props
    for name, props in components.items()
    if name not in {"PDFViewer", "PDFDownloadLink", "BlobProvider"}
}
custom_imports = {name: [imports] for name in [*renderer_components, "PDF"]}

TypeInfo: TypeAlias = dict[str, Any]
TypeGenerator: TypeAlias = Callable[[TypeInfo, str, str], str]


def static_type(annotation: str) -> TypeGenerator:
    """Return a Dash custom-type callback for a fixed annotation."""

    def generate_type(_type_info: TypeInfo, _component_name: str, _prop_name: str) -> str:
        return annotation

    return generate_type


custom_props = {}
for name, props in renderer_components.items():
    overrides = {}
    if "style" in props:
        overrides["style"] = static_type("PDFStyleInput")
    for field in ["render", "layout", "paint", "hyphenationCallback", "onRender"]:
        if field in props:
            overrides[field] = static_type("FunctionProps")
    if "bookmark" in props:
        overrides["bookmark"] = static_type("typing.Union[str, Bookmark]")
    if "permissions" in props:
        overrides["permissions"] = static_type("Permissions")
    if name in {"Image", "ImageBackground"}:
        overrides.update(src=static_type("ImageSource"), source=static_type("ImageSource"))
    if name == "Page":
        overrides["size"] = static_type("PageSize")
    if name == "TextInput":
        overrides["format"] = static_type("FormFormatting")
    custom_props[name] = overrides


_DOCUMENT_TYPES = """PDFUrlType = TypedDict(
    "PDFUrlType",
    {"url": str},
)
PDFDataType = TypedDict(
    "PDFDataType",
    {"data": typing.Sequence[NumberType]},
)"""

custom_props.update(
    {
        "PDF": {
            "file": static_type("typing.Union[str, PDFUrlType, PDFDataType]"),
            "pages": static_type('typing.Union[Literal["all"], typing.Sequence[int]]'),
            "style": static_type("CSSStyle"),
        },
    }
)

custom_imports["PDF"] = [imports, _DOCUMENT_TYPES]
custom_props["PDF"].update(
    fonts=static_type("typing.Sequence[FontRegistration]"),
    fontDescriptors=static_type("typing.Sequence[FontDescriptor]"),
    hyphenationCallback=static_type("FunctionProps"),
)
