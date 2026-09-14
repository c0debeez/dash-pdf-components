"""Construct Dash PDF nodes from pinned official React example conversions."""

import json
from pathlib import Path

from dash import get_asset_url

import dash_pdf_components as dpr

ROOT = Path(__file__).parent
MANIFEST = json.loads((ROOT / "data/manifest.json").read_text())
RESOURCE_MAP = json.loads((ROOT / "resources.json").read_text()) if (ROOT / "resources.json").exists() else {}


def localize(value):
    if isinstance(value, str):
        for source, destination in RESOURCE_MAP.items():
            if source in value:
                value = value.replace(source, destination)
        if value.startswith("/assets/"):
            try:
                value = get_asset_url(value[len("/assets/") :])
            except AttributeError:
                pass  # Descriptor inventory can be loaded before a Dash app exists.
        return value
    if isinstance(value, list):
        return [localize(item) for item in value]
    if isinstance(value, dict):
        return {key: localize(item) for key, item in value.items()}
    return value


def component(node):
    if isinstance(node, list):
        return [component(child) for child in node]
    if not isinstance(node, dict) or node.get("namespace") not in {"dash_pdf_components", "dash_pdf_renderer_components"}:
        return node
    props = dict(node["props"])
    if "children" in props:
        props["children"] = component(props["children"])
    return getattr(dpr, node["type"])(**props)


def get_example(identifier):
    if identifier not in {item["id"] for item in MANIFEST}:
        raise ValueError(f"Unknown official example: {identifier}")
    data = localize(json.loads((ROOT / f"data/{identifier}.json").read_text()))
    # SVG image text retains its embedded font-family rather than the prefixed PDF-node family.
    if identifier == "repository-svg-image":
        data["fonts"].append(
            {
                "family": "Roboto",
                "src": next(
                    "/assets/official/" + asset.name for asset in (ROOT.parent / "assets/official").glob("*-Roboto-Regular.ttf")
                ),
            }
        )
    configuration = {key: data.get(key) for key in ["fonts", "emojiSource", "hyphenationCallback"]}
    return component(data["document"]), configuration
