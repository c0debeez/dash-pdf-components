"""Types for JSON adaptations that Dash docgen cannot infer from renderer aliases."""

import json
from pathlib import Path

root = Path(__file__).parent
components = json.loads((root / "docs/api-mapping.json").read_text())["components"]
imports = "from ._typing import FunctionProps, PDFStyleInput, CSSStyle, Bookmark, Permissions, FontRegistration, FontDescriptor, ImageSource, PageSize, FormFormatting"
custom_imports = {name: [imports] for name in components if name not in {"PDFViewer", "PDFDownloadLink", "BlobProvider"}}


def constant(annotation):
    return lambda *_: annotation


custom_props = {}
for name, props in components.items():
    overrides = {}
    if "style" in props:
        overrides["style"] = constant("CSSStyle" if name in {"PDFViewer", "PDFDownloadLink", "BlobProvider"} else "PDFStyleInput")
    for field in ["render", "layout", "paint", "hyphenationCallback", "onRender"]:
        if field in props:
            overrides[field] = constant("FunctionProps")
    if "bookmark" in props:
        overrides["bookmark"] = constant("typing.Union[str, Bookmark]")
    if "permissions" in props:
        overrides["permissions"] = constant("Permissions")
    if name in {"Image", "ImageBackground"}:
        overrides.update(src=constant("ImageSource"), source=constant("ImageSource"))
    if name == "Page":
        overrides["size"] = constant("PageSize")
    if name == "TextInput":
        overrides["format"] = constant("FormFormatting")
    if name in {"PDFViewer", "PDFDownloadLink", "BlobProvider"}:
        overrides.update(
            fonts=constant("typing.Sequence[FontRegistration]"),
            fontDescriptors=constant("typing.Sequence[FontDescriptor]"),
            render=constant("FunctionProps"),
            hyphenationCallback=constant("FunctionProps"),
        )
    custom_props[name] = overrides

from collections.abc import Callable
from typing import Any, TypeAlias

TypeInfo: TypeAlias = dict[str, Any]
TypeGenerator: TypeAlias = Callable[[TypeInfo, str, str], str]


def _static_type(annotation: str) -> TypeGenerator:
    def generate_type(type_info: TypeInfo, component_name: str, prop_name: str) -> str:
        return annotation

    return generate_type


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
            "file": _static_type("typing.Union[str, PDFUrlType, PDFDataType]"),
            "pages": _static_type('typing.Union[Literal["all"], typing.Sequence[int]]'),
        },
    }
)

custom_imports["PDF"] = [imports, _DOCUMENT_TYPES]
custom_props["PDF"].update(
    fonts=constant("typing.Sequence[FontRegistration]"),
    fontDescriptors=constant("typing.Sequence[FontDescriptor]"),
    hyphenationCallback=constant("FunctionProps"),
)
