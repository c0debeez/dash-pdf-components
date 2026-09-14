"""Cache official example images and fonts and record their original URLs."""

import concurrent.futures
import hashlib
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

root = Path(__file__).resolve().parents[1]
assets = root / "assets/official"
urls = set()


def collect(node):
    if isinstance(node, dict):
        if node.get("type") in {"Image", "ImageBackground"}:
            for key in ["src", "source", "srcSet"]:
                value = node.get("props", {}).get(key)
                if isinstance(value, str):
                    urls.update(re.findall(r"https://[^\s,]+", value))
        if "fonts" in node and "document" in node:
            for registration in node["fonts"]:
                for font in registration.get("fonts", [registration]):
                    if font.get("src", "").startswith("https://"):
                        urls.add(font["src"])
        for child in node.values():
            collect(child)
    elif isinstance(node, list):
        for child in node:
            collect(child)


for file in (root / "examples/data").glob("*.json"):
    collect(json.loads(file.read_text()))
# Playground fonts are relative to its website, not the Dash app.
relative_fonts = set()
for file in (root / "examples/data").glob("*.json"):
    data = json.loads(file.read_text())
    if not isinstance(data, dict):
        continue
    for registration in data["fonts"]:
        for font in registration.get("fonts", [registration]):
            if font.get("src", "").startswith("/fonts/"):
                relative_fonts.add(font["src"])
                urls.add("https://react-pdf.org" + font["src"])
# Emoji image filenames follow Twemoji's hexadecimal Unicode code points.
for file in (root / "examples/data").glob("*.json"):
    data = json.loads(file.read_text())
    source = data.get("emojiSource") if isinstance(data, dict) else None
    if source:
        for character in set(
            re.findall(r"[\U0001F300-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF]", json.dumps(data, ensure_ascii=False))
        ):
            urls.add(source["url"] + format(ord(character), "x") + "." + source.get("format", "png"))
# Playground serves these assets outside the React example application's public directory.
for name in ["luke.jpg", "mountains.jpg"]:
    urls.add(f"https://react-pdf.org/images/{name}")

mapping = json.loads((root / "examples/resources.json").read_text()) if (root / "examples/resources.json").exists() else {}


def fetch(url):
    if url in mapping and (root / mapping[url].lstrip("/")).exists():
        return url, mapping[url]
    suffix = Path(urllib.parse.urlsplit(url).path).suffix.lower()
    if suffix not in {".ttf", ".jpg", ".jpeg", ".png", ".svg"}:
        suffix = ".jpg"
    name = hashlib.sha256(url.encode()).hexdigest()[:12] + suffix
    destination = assets / name
    if not destination.exists():
        fetch_url = (
            "https://raw.githubusercontent.com/diegomura/react-pdf-site/master/public/images/logo.png"
            if url == "https://react-pdf.org/images/logo.png"
            else url
        )
        request = urllib.request.Request(fetch_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=45) as response:
            content = response.read()
        destination.write_bytes(content)
    return url, "/assets/official/" + name


failed = {}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
    pending = {executor.submit(fetch, url): url for url in sorted(urls)}
    for future in concurrent.futures.as_completed(pending):
        try:
            source, destination = future.result()
            mapping[source] = destination
            print("Cached", source, flush=True)
        except (OSError, TimeoutError) as error:
            failed[pending[future]] = str(error)
            print("Failed", pending[future], error, flush=True)

for name in ["quijote1.jpg", "quijote2.png"]:
    mapping[f"/images/{name}"] = "/assets/official/" + next(assets.glob("*-" + name)).name
for name in ["luke.jpg", "mountains.jpg"]:
    url = "https://react-pdf.org/images/" + name
    if url in mapping:
        mapping["/images/" + name] = mapping[url]
for source in relative_fonts:
    remote = "https://react-pdf.org" + source
    if remote in mapping:
        mapping[source] = mapping[remote]
mapping["https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/"] = "/assets/official/emoji/"
emoji_dir = assets / "emoji"
emoji_dir.mkdir(exist_ok=True)
for url, destination in list(mapping.items()):
    if "/twemoji/" in url and url.endswith(".png"):
        import shutil

        shutil.copyfile(root / destination.lstrip("/"), emoji_dir / Path(urllib.parse.urlsplit(url).path).name)
(root / "examples/resources.json").write_text(json.dumps(mapping, indent=2, sort_keys=True) + "\n")
(root / "examples/resource-failures.json").write_text(json.dumps(failed, indent=2, sort_keys=True) + "\n")
print(f"Cached {len(mapping)} resource mappings; {len(failed)} unavailable upstream URLs.")
