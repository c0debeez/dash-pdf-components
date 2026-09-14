"""Verify generated bindings and browser resources in release artifacts."""

import json
import subprocess
import tarfile
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
mapping = json.loads((root / "docs/api-mapping.json").read_text())
required = {
    f"dash_pdf_components/{name}.py"
    for name in mapping["components"]
    if name not in {"PDFViewer", "PDFDownloadLink", "BlobProvider"}
}
required |= {
    "dash_pdf_components/PDF.py",
    "dash_pdf_components/async-pdf-generator.js",
    "dash_pdf_components/async-pdf-viewer.js",
    "dash_pdf_components/_typing.py",
    "dash_pdf_components/_imports_.py",
    "dash_pdf_components/metadata.json",
    "dash_pdf_components/package-info.json",
    "dash_pdf_components/proptypes.js",
    "dash_pdf_components/dash_pdf_components.js",
    "dash_pdf_components/pdfjs/build/sRGB_IEC61966_2_1.icc",
    "dash_pdf_components/pdfjs/build/pdf.worker.min.mjs",
    "dash_pdf_components/pdfjs/standard_fonts/FoxitSerif.pfb",
    "dash_pdf_components/pdfjs/cmaps/Adobe-Japan1-UCS2.bcmap",
    "dash_pdf_components/pdfjs/wasm/openjpeg.wasm",
}
wheel = next((root / "dist").glob("*.whl"))
sdist = next((root / "dist").glob("*.tar.gz"))
with zipfile.ZipFile(wheel) as archive:
    assert required <= set(archive.namelist()), required - set(archive.namelist())
with tarfile.open(sdist) as archive:
    names = {"/".join(name.split("/")[1:]) for name in archive.getnames()}
    assert required <= names, required - names
    source = {
        "src/fragments/PDFController.tsx",
        "scripts/generate_typing.py",
        "scripts/fix_proptypes.py",
        "docs/adapters.md",
        "usage.py",
        "examples/gallery.py",
        "examples/data/manifest.json",
        "examples/resources.json",
        "assets/official-examples.js",
        "scripts/example_bridge.mjs",
        "pnpm-workspace.yaml",
    }
    assert source <= names, source - names
packed = subprocess.run(["npm", "pack", "--dry-run", "--json"], cwd=root, capture_output=True, text=True, check=True)
names = {item["path"] for item in json.loads(packed.stdout)[0]["files"]}
resources = {name for name in required if name.endswith((".js", ".mjs", ".icc", ".pfb", ".bcmap", ".wasm"))}
assert resources <= names, resources - names
print("Wheel, sdist and npm package resources verified.")
