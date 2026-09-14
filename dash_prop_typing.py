"""Custom Python annotations used by ``dash-generate-components``."""

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

_OUTLINE_TYPES = """class PDFOutlineItemType(TypedDict):
    title: str
    bold: bool
    italic: bool
    url: NotRequired[typing.Optional[str]]
    items: typing.Sequence[\"PDFOutlineItemType\"]"""

custom_props = {
    "Document": {
        "file": _static_type("typing.Union[str, PDFUrlType, PDFDataType]"),
    },
    "PDF": {
        "file": _static_type("typing.Union[str, PDFUrlType, PDFDataType]"),
        "pages": _static_type('typing.Union[Literal["all"], typing.Sequence[int]]'),
    },
    "Outline": {
        "outlineData": _static_type("typing.Sequence[PDFOutlineItemType]"),
    },
}

custom_imports: dict[str, list[str]] = {
    "Document": [_DOCUMENT_TYPES],
    "PDF": [_DOCUMENT_TYPES],
    "Outline": [_OUTLINE_TYPES],
}
