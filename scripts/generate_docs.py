"""Generate a property reference from the audited API mapping."""

import json
from pathlib import Path

mapping = json.loads(Path("docs/api-mapping.json").read_text())
examples = {
    "Document": 'dpr.Document(dpr.Page(dpr.Text("Hello")))',
    "Page": 'dpr.Page(dpr.Text("Hello"), size="A4")',
    "View": 'dpr.View(dpr.Text("Hello"))',
    "Text": 'dpr.Text("Hello")',
    "Image": 'dpr.Image(src="/assets/photo.png", style={"width": 100})',
    "ImageBackground": 'dpr.ImageBackground(dpr.Text("Caption"), src="/assets/photo.png", style={"width": 200, "height": 100})',
    "Link": 'dpr.Link("Visit", src="https://react-pdf.org")',
    "Note": 'dpr.Note("An annotation")',
    "Canvas": 'dpr.Canvas(operations=[{"method": "rect", "args": [0, 0, 100, 20]}, {"method": "fill", "args": ["blue"]}], style={"width": 100, "height": 20})',
    "FieldSet": 'dpr.FieldSet(dpr.TextInput(name="name", value="Ada"), name="person")',
    "TextInput": 'dpr.TextInput(name="name", value="Ada", style={"width": 150, "height": 25})',
    "Checkbox": 'dpr.Checkbox(name="agree", checked=True, style={"width": 20, "height": 20})',
    "Select": 'dpr.Select(name="choice", select=["one", "two"], value="one", style={"width": 100, "height": 25})',
    "List": 'dpr.List(name="choices", select=["one", "two"], value="two", style={"width": 100, "height": 40})',
    "Svg": 'dpr.Svg(dpr.Rect(width=100, height=50, fill="blue"), width=100, height=50)',
    "Line": 'dpr.Line(x1=0, y1=0, x2=100, y2=50, stroke="black")',
    "Polyline": 'dpr.Polyline(points="0,0 50,50 100,0", stroke="black")',
    "Polygon": 'dpr.Polygon(points="0,0 50,50 100,0", fill="blue")',
    "Path": 'dpr.Path(d="M0 0L100 50", stroke="black")',
    "Rect": 'dpr.Rect(width=100, height=50, fill="blue")',
    "Circle": 'dpr.Circle(cx=25, cy=25, r=20, fill="blue")',
    "Ellipse": 'dpr.Ellipse(cx=50, cy=25, rx=40, ry=20, fill="blue")',
    "Tspan": 'dpr.Text(dpr.Tspan("SVG label", x=10, y=25), x=10, y=25)',
    "G": "dpr.G(dpr.Rect(width=100, height=50), opacity=0.5)",
    "Stop": 'dpr.LinearGradient([dpr.Stop(offset="0%", stopColor="blue"), dpr.Stop(offset="100%", stopColor="green")], pdfId="gradient")',
    "Defs": 'dpr.Defs(dpr.ClipPath(dpr.Rect(width=100, height=50), pdfId="clip"))',
    "ClipPath": 'dpr.ClipPath(dpr.Rect(width=100, height=50), pdfId="clip")',
    "Marker": 'dpr.Marker(dpr.Path(d="M0 0L8 4L0 8Z", fill="black"), pdfId="arrow", markerWidth=8, markerHeight=8)',
    "LinearGradient": 'dpr.LinearGradient([dpr.Stop(offset="0%", stopColor="blue"), dpr.Stop(offset="100%", stopColor="green")], pdfId="gradient")',
    "RadialGradient": 'dpr.RadialGradient([dpr.Stop(offset="0%", stopColor="blue"), dpr.Stop(offset="100%", stopColor="white")], pdfId="gradient")',
}
svg = {
    "Line",
    "Polyline",
    "Polygon",
    "Path",
    "Rect",
    "Circle",
    "Ellipse",
    "Tspan",
    "G",
    "Stop",
    "Defs",
    "ClipPath",
    "Marker",
    "LinearGradient",
    "RadialGradient",
}
definitions = {"ClipPath", "Marker", "LinearGradient", "RadialGradient"}
lines = [
    "# Component reference",
    "",
    "Generated from the installed renderer declarations and [API mapping](api-mapping.json). Direct fields retain upstream semantics; adapted fields use the [Dash adapters](adapters.md).",
    "",
    "Each example assumes `import dash_pdf_components as dpr`. Image examples require a local `assets/photo.png`. Definitions must be referenced by visible SVG shapes to affect the output.",
    "",
]
for name, fields in mapping["components"].items():
    if name in {"PDFViewer", "PDFDownloadLink", "BlobProvider"}:
        continue
    expression = examples.get(name)
    if expression:
        if name in definitions:
            expression = f"dpr.Defs({expression})"
        if name in svg:
            expression = f"dpr.Svg({expression}, width=200, height=100)"
        if name != "Document":
            if name != "Page":
                expression = f"dpr.Page({expression})"
            expression = f"dpr.Document({expression})"
        expression = f"dpr.PDF(document={expression})"
    else:
        expression = f'dpr.{name}(document=dpr.Document(dpr.Page(dpr.Text("Hello"))), children="Download"' + (
            ", returnBase64=True)" if name == "BlobProvider" else ")"
        )
    lines += [
        f"## {name}",
        "",
        "```python",
        f"component = {expression}",
        "```",
        "",
        "| Property | Type | Mapping | Notes |",
        "| --- | --- | --- | --- |",
    ]
    for field, info in fields.items():
        values = [field, info.get("type", "See generated Python binding"), info["mode"], info.get("note", "")]
        lines.append("| " + " | ".join(str(value).replace("|", "\\|").replace("\n", " ") for value in values) + " |")
    if name in {"PDFViewer", "PDFDownloadLink", "BlobProvider"}:
        lines += [
            "",
            "Additional shared properties, generation controls, callback outputs, fonts, and status render are documented in [output adapters](adapters.md) and the generated Python class.",
        ]
    lines += [""]
Path("docs/components.md").write_text("\n".join(lines))
