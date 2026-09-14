import importlib.util
import inspect
import json
import shutil
import subprocess
from pathlib import Path

import pytest

import dash_pdf_components as dpc


def test_loading_is_managed_by_dash():
    for component in (dpc.PDF,):
        props = component()._prop_names
        assert "loading" not in props
        assert "loading_state" in props


def test_basic_usage_needs_no_ui_library(monkeypatch):
    monkeypatch.setenv("PDF_DEMO", "basic")
    monkeypatch.setenv("PDF_UI", "not-a-ui-library")
    root = Path(__file__).resolve().parents[1]
    spec = importlib.util.spec_from_file_location("pdf_basic_usage", root / "usage.py")
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    viewer = module.app.layout
    assert viewer._type == "PDF"
    assert viewer.to_plotly_json()["props"]["pages"] == "all"
    assert viewer.to_plotly_json()["props"]["fit"] == "width"
    assert viewer.to_plotly_json()["props"]["file"] == "/assets/documents/quixote.pdf"
    assert not module.app.callback_map
    response = module.app.server.test_client().get(viewer.file)
    assert response.status_code == 200
    assert response.data.startswith(b"%PDF-")


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

    props = viewer.to_plotly_json()["props"]
    assert props["id"] == "pdf"
    assert viewer.to_plotly_json()["props"]["file"] == {"url": "/assets/document.pdf"}
    assert viewer.to_plotly_json()["props"]["pageNumber"] == 2
    assert viewer.to_plotly_json()["props"]["width"] == 720
    assert viewer.to_plotly_json()["props"]["scale"] == 1.25
    assert viewer.to_plotly_json()["props"]["rotate"] == 90
    assert viewer.to_plotly_json()["props"]["renderForms"] is True


def test_pdf_accepts_all_pages():
    viewer = dpc.PDF(file="/assets/document.pdf", pageNumber="all", width=600)
    assert viewer.to_plotly_json()["props"]["pageNumber"] == "all"
    assert "all" in str(inspect.signature(dpc.PDF).parameters["pageNumber"].annotation)


def test_pdf_page_selection_and_fit_properties():
    viewer = dpc.PDF(file="document.pdf", pages=[1, 3, 5], pageNumber=3, fit="width")
    assert viewer.to_plotly_json()["props"]["pages"] == [1, 3, 5]
    assert viewer.to_plotly_json()["props"]["pageNumber"] == 3
    assert viewer.to_plotly_json()["props"]["fit"] == "width"
    assert "Sequence[int]" in str(inspect.signature(dpc.PDF).parameters["pages"].annotation)
    assert "documentData" in viewer._prop_names
    assert "pageData" in viewer._prop_names


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
    assert "timestamp" in dpc.PDF.ItemClickData.__required_keys__


def test_local_pdfjs_assets_are_registered():
    document = dpc.PDF()
    resources = next(resource for resource in vars(type(document))["_js_dist"] if resource.get("dynamic"))

    assert "pdfjs/build/pdf.worker.min.mjs" in resources["relative_package_path"]
    assert "pdfjs/cmaps/UniGB-UTF8-H.bcmap" in resources["relative_package_path"]
    assert "pdfjs/standard_fonts/FoxitSerif.pfb" in resources["relative_package_path"]
    assert "pdfjs/wasm/qcms_bg.wasm" in resources["relative_package_path"]
    assert "pdfjs/iccs/CGATS001Compat-v2-micro.icc" in resources["relative_package_path"]
    assert "pdfjs/web/images/annotation-note.svg" in resources["relative_package_path"]


def test_only_pdf_is_public():
    assert "PDF" in dpc.__all__
    assert {"Document", "Page", "Text", "Svg"} <= set(dpc.__all__)
    for name in ("PDFViewer", "PDFDownloadLink", "BlobProvider", "Outline", "Thumbnail"):
        assert not hasattr(dpc, name)
    root = Path(__file__).resolve().parents[1]
    metadata = json.loads((root / "dash_pdf_components/metadata.json").read_text())
    assert "src/components/PDF.tsx" in metadata
    assert len(metadata) == 31
