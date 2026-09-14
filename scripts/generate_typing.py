"""Generate portable Python types from the renderer style audit."""

import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
inventory = json.loads((root / "docs/style-fields.json").read_text())
fields = inventory["properties"]


def annotation(value):
    if all(part.strip().startswith('"') for part in value.split("|")):
        return "typing.Literal[" + ", ".join(part.strip() for part in value.split("|")) + "]"
    if value in {"string", "number", "boolean"}:
        return {"string": "str", "number": "NumberType", "boolean": "bool"}[value]
    if value in {"string | number", "number | string"}:
        return "typing.Union[str, NumberType]"
    return "typing.Any"


style = ",\n".join(f"    {name!r}: {annotation(value)}" for name, value in sorted(fields.items()))
source = (
    '''"""Build-generated JSON boundary types; do not edit manually."""
import typing
from typing import TypedDict
from typing_extensions import NotRequired
NumberType = typing.Union[int, float]
FunctionProps = TypedDict("FunctionProps", {"function": str, "options": NotRequired[typing.Dict[str, typing.Any]]})
PDFStyle = TypedDict("PDFStyle", {
'''
    + style
    + """
}, total=False)
SVGPresentationAttributes = TypedDict("SVGPresentationAttributes", {
"""
    + ",\n".join(f"    {name!r}: {annotation(value)}" for name, value in sorted(inventory["svgProperties"].items()))
    + """
}, total=False)
PDFStyleInput = typing.Union[PDFStyle, typing.Mapping[str, typing.Any], typing.Sequence[PDFStyle]]
CSSStyle = typing.Mapping[str, typing.Any]
Bookmark = TypedDict("Bookmark", {"title": str, "top": NumberType, "left": NumberType, "zoom": NumberType, "fit": bool, "expanded": bool}, total=False)
Permissions = TypedDict("Permissions", {"printing": typing.Literal["lowResolution", "highResolution"], "modifying": bool, "copying": bool, "annotating": bool, "fillingForms": bool, "contentAccessibility": bool, "documentAssembly": bool}, total=False)
FontDescriptor = TypedDict("FontDescriptor", {"fontFamily": str, "fontWeight": typing.Union[str, NumberType], "fontStyle": typing.Literal["normal", "italic", "oblique"]}, total=False)
FontSource = TypedDict("FontSource", {"src": str, "fontWeight": typing.Union[str, NumberType], "fontStyle": str, "postscriptName": str, "method": str, "headers": typing.Dict[str, str], "body": typing.Any}, total=False)
FontRegistration = TypedDict("FontRegistration", {"family": str, "src": str, "fonts": typing.Sequence[FontSource], "fontWeight": typing.Union[str, NumberType], "fontStyle": str, "postscriptName": str, "method": str, "headers": typing.Dict[str, str], "body": typing.Any}, total=False)
ImageSource = typing.Union[str, typing.Sequence[int], typing.Mapping[str, typing.Any], FunctionProps]
PageSize = typing.Union[str, typing.Sequence[typing.Union[str, NumberType]], typing.Mapping[str, typing.Union[str, NumberType]]]
FormFormatting = TypedDict("FormFormatting", {"type": typing.Literal["date", "time", "percent", "number", "zip", "zipPlus4", "phone", "ssn"], "param": str, "nDec": NumberType, "sepComma": bool, "negStyle": typing.Literal["MinusBlack", "Red", "ParensBlack", "ParensRed"], "currency": str, "currencyPrepend": bool}, total=False)
"""
)
(root / "dash_pdf_components/_typing.py").write_text(source)
