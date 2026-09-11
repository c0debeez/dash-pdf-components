from dash_pdf_components import Outline
from dash_pdf_components.Outline import PDFOutlineItemType

child: PDFOutlineItemType = {
    "title": "Chapter 1.1",
    "bold": False,
    "italic": False,
    "items": [],
}

root: PDFOutlineItemType = {
    "title": "Chapter 1",
    "bold": True,
    "italic": False,
    "url": None,
    "items": [child],
}

outline = Outline(outlineData=[root])
