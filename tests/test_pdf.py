import inspect
import typing

import dash_pdf_components as dpc
from dash_pdf_components.Outline import PDFOutlineItemType


def test_react_pdf_component_tree_properties():
    document = dpc.Document(
        [
            dpc.Page(id="page", pageNumber=2, scale=1.25, rotate=90, renderForms=True),
            dpc.Thumbnail(pageNumber=2, width=120),
            dpc.Outline(id="outline"),
        ],
        file={"data": [37, 80, 68, 70]},
        assetBaseUrl="https://registry.npmmirror.com/pdfjs-dist/5.4.296/files/",
    )

    assert document.file == {"data": [37, 80, 68, 70]}
    assert document.assetBaseUrl.endswith("/files/")
    assert document.children[0].pageNumber == 2
    assert document.children[0].scale == 1.25
    assert document.children[0].rotate == 90
    assert document.children[0].renderForms is True
    assert document.children[1].width == 120
    assert document.children[2].id == "outline"


def test_document_file_typing_accepts_url_and_data():
    assert dpc.Document(file={"url": "/assets/document.pdf"}).file == {"url": "/assets/document.pdf"}
    assert dpc.Document(file={"data": [37, 80, 68, 70]}).file == {"data": [37, 80, 68, 70]}


def test_pdf_simplifies_single_page_viewer_properties():
    viewer = dpc.PDF(
        id="pdf",
        file={"url": "/assets/document.pdf"},
        pageNumber=2,
        width=720,
        scale=1.25,
        rotate=90,
        renderForms=True,
    )

    assert viewer.id == "pdf"
    assert viewer.file == {"url": "/assets/document.pdf"}
    assert viewer.pageNumber == 2
    assert viewer.width == 720
    assert viewer.scale == 1.25
    assert viewer.rotate == 90
    assert viewer.renderForms is True


def test_outline_data_typing_is_recursive():
    signature = inspect.signature(dpc.Outline)
    item_hints = typing.get_type_hints(PDFOutlineItemType)
    expected = typing.Sequence[PDFOutlineItemType] | None

    assert signature.parameters["outlineData"].annotation == expected
    assert item_hints["items"] == typing.Sequence[PDFOutlineItemType]


def test_item_click_data_includes_timestamp():
    assert "timestamp" in dpc.Thumbnail.ItemClickData.__required_keys__
    assert "timestamp" in dpc.Outline.ItemClickData.__required_keys__
    assert "timestamp" in dpc.Document.ItemClickData.__required_keys__


def test_local_pdfjs_assets_are_registered():
    document = dpc.Document()
    resources = next(resource for resource in document._js_dist if resource.get("dynamic"))

    assert "pdfjs/build/pdf.worker.min.mjs" in resources["relative_package_path"]
    assert "pdfjs/cmaps/UniGB-UTF8-H.bcmap" in resources["relative_package_path"]
    assert "pdfjs/standard_fonts/FoxitSerif.pfb" in resources["relative_package_path"]
    assert "pdfjs/wasm/qcms_bg.wasm" in resources["relative_package_path"]
    assert "pdfjs/iccs/CGATS001Compat-v2-micro.icc" in resources["relative_package_path"]
    assert "pdfjs/web/images/annotation-note.svg" in resources["relative_package_path"]
