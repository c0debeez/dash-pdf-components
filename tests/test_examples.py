"""Check the complete source inventory and run every converted document in Chrome."""

import json
import re
import threading
import time
from pathlib import Path

import pytest
from werkzeug.serving import make_server

from examples.gallery import MANIFEST, get_example

ROOT = Path(__file__).parents[1]


def test_official_inventory():
    playground = json.loads((ROOT / "examples/upstream/playground.json").read_text())
    assert {item["id"] for item in MANIFEST if item["group"] == "Playground"} == {"playground-" + key for key in playground}
    repository = (ROOT / "examples/upstream/apps/examples/src/examples/index.ts").read_text()
    assert {item["id"] for item in MANIFEST if item["group"] == "Repository"} == {
        "repository-" + slug for slug in re.findall(r"import \w+ from '\./([^']+)'", repository)
    }
    assert len(MANIFEST) == 75
    assert len({item["id"] for item in MANIFEST}) == 75
    for item in MANIFEST:
        document, config = get_example(item["id"])
        assert document.to_plotly_json()["type"] == "Document"
        assert set(config) == {"fonts", "emojiSource", "hyphenationCallback"}


@pytest.mark.browser
def test_all_official_examples(browser):
    import runpy

    app = runpy.run_path(str(ROOT / "examples/usage.py"))["app"]
    server = make_server("127.0.0.1", 0, app.server, threaded=True)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    failures = []

    def script(code, args=None):
        return browser("execute/sync", {"script": code, "args": args or []})

    try:
        browser("url", {"url": f"http://127.0.0.1:{server.server_port}"})
        end = time.monotonic() + 60
        while time.monotonic() < end:
            ready = script("try{return !!window.dash_component_api?.getLayout('preview')?.props.url}catch(e){return false}")
            if ready:
                break
            time.sleep(0.2)
        for item in MANIFEST:
            previous = script("return window.dash_component_api.getLayout('preview').props.n_render || 0")
            script("window.dash_clientside.set_props('example', {value: arguments[0]})", [item["id"]])
            end = time.monotonic() + 180
            state = {}
            while time.monotonic() < end:
                state = script(
                    "const p=window.dash_component_api.getLayout('preview').props;return {error:p.errorData,loading:p.generating,n_render:p.n_render,url:p.url,size:p.size,fileName:p.fileName}"
                )
                if state.get("fileName") == item["id"] + ".pdf" and (
                    state.get("error") or ((state.get("n_render") or 0) > previous and state.get("url"))
                ):
                    break
                time.sleep(0.2)
            if state.get("error") or not state.get("url") or (state.get("n_render") or 0) <= previous:
                failures.append((item["id"], state))
                print("FAILED", item["id"], state, flush=True)
                continue
            header = browser(
                "execute/async",
                {
                    "script": "const done=arguments[arguments.length-1];fetch(arguments[0]).then(r=>r.blob()).then(b=>b.slice(0,5).text()).then(done).catch(e=>done(String(e)))",
                    "args": [state["url"]],
                },
            )
            assert header == "%PDF-", (item["id"], header)
            print("GENERATED", item["id"], state["size"], flush=True)
        logs = browser("log", {"type": "browser"})
        assert not [entry for entry in logs if entry["level"] == "SEVERE"], logs
        assert not failures, failures
    finally:
        server.shutdown()
        thread.join(timeout=10)
