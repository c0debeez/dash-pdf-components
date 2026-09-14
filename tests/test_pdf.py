import importlib.util
import inspect
import json
import shutil
import subprocess
import typing
from pathlib import Path

import pytest

import dash_pdf_components as dpc
from dash_pdf_components.Outline import PDFOutlineItemType


def test_loading_is_managed_by_dash():
    for component in (dpc.PDF, dpc.Document, dpc.Page, dpc.Thumbnail, dpc.Outline):
        props = component()._prop_names
        assert "loading" not in props
        assert "loading_state" in props


def test_basic_usage_needs_no_ui_library(monkeypatch):
    monkeypatch.setenv("PDF_DEMO", "basic")
    monkeypatch.setenv("PDF_UI", "not-a-ui-library")
    root = Path(__file__).resolve().parents[1]
    spec = importlib.util.spec_from_file_location("pdf_basic_usage", root / "usage.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    viewer = module.app.layout
    assert viewer._type == "PDF"
    assert viewer.pages == "all"
    assert viewer.fit == "width"
    assert viewer.file == "/assets/documents/quixote.pdf"
    assert not module.app.callback_map
    response = module.app.server.test_client().get(viewer.file)
    assert response.status_code == 200
    assert response.data.startswith(b"%PDF-")


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


def test_pdf_accepts_all_pages():
    viewer = dpc.PDF(file="/assets/document.pdf", pageNumber="all", width=600)
    assert viewer.pageNumber == "all"
    assert "all" in str(inspect.signature(dpc.PDF).parameters["pageNumber"].annotation)


def test_pdf_page_selection_and_fit_properties():
    viewer = dpc.PDF(file="document.pdf", pages=[1, 3, 5], pageNumber=3, fit="width")
    assert viewer.pages == [1, 3, 5]
    assert viewer.pageNumber == 3
    assert viewer.fit == "width"
    assert "Sequence[int]" in str(inspect.signature(dpc.PDF).parameters["pages"].annotation)
    assert "documentData" in dpc.Document()._prop_names
    assert "pageData" in dpc.Page()._prop_names
    assert "pageData" in dpc.Thumbnail()._prop_names


def test_viewer_selection_and_fit_rules():
    node = shutil.which("node")
    if not node:
        pytest.skip("Node.js is required to test viewer sizing")
    root = Path(__file__).resolve().parents[1]
    program = r"""
    const ts = require('typescript');
    const assert = require('node:assert/strict');
    const source = JSON.parse(require('node:fs').readFileSync(0, 'utf8'));
    const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020}});
    const target = {exports: {}};
    new Function('require', 'module', 'exports', compiled.outputText)(require, target, target.exports);
    const {selectPages, fitPageWidth} = target.exports;
    assert.deepEqual(selectPages(undefined, 2, 4), [2]);
    assert.deepEqual(selectPages('all', 2, 4), [1, 2, 3, 4]);
    assert.deepEqual(selectPages('all', 1, 0), []);
    assert.deepEqual(selectPages([3, 1, 3, 0, -1, 1.5, 8], 1, 4), [3, 1]);
    assert.deepEqual(selectPages([], 1, 4), []);
    assert.equal(fitPageWidth(undefined, 600, 400, 200, 400), undefined);
    assert.equal(fitPageWidth('width', 600, 400, 200, 400), 600);
    assert.equal(fitPageWidth('page', 600, 400, 200, 400), 200);
    assert.equal(fitPageWidth('page', 600, 400, 400, 200), 600);
    assert.equal(fitPageWidth('width', 0, 400, 200, 400), undefined);
    """
    result = subprocess.run(
        [node, "-e", program],
        cwd=root,
        input=json.dumps((root / "src/fragments/viewer.ts").read_text()),
        text=True,
        check=False,
        capture_output=True,
    )
    assert result.returncode == 0, result.stderr


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
