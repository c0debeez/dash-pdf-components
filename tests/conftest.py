import json
import os
import shutil
import socket
import subprocess
import time
import urllib.error
import urllib.request

import pytest


@pytest.fixture
def browser():
    driver = os.environ.get("CHROMEDRIVER") or shutil.which("chromedriver")
    chrome = os.environ.get("CHROME_BIN") or shutil.which("google-chrome") or shutil.which("chrome")
    if not driver or not chrome:
        pytest.skip("Chrome and chromedriver are required")
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
    process = subprocess.Popen([driver, f"--port={port}"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    session = None

    def request(method, path, body=None):
        req = urllib.request.Request(
            f"http://127.0.0.1:{port}{path}",
            data=json.dumps(body).encode() if body is not None else None,
            headers={"Content-Type": "application/json"},
            method=method,
        )
        try:
            with opener.open(req, timeout=45) as response:
                value = json.load(response)["value"]
        except urllib.error.HTTPError as error:
            raise AssertionError(error.read().decode()) from error
        if isinstance(value, dict) and "error" in value and "message" in value:
            raise AssertionError(value)
        return value

    try:
        for _ in range(100):
            try:
                request("GET", "/status")
                break
            except OSError:
                time.sleep(0.1)
        session = request(
            "POST",
            "/session",
            {
                "capabilities": {
                    "alwaysMatch": {
                        "browserName": "chrome",
                        "goog:chromeOptions": {
                            "binary": chrome,
                            "args": ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
                        },
                        "goog:loggingPrefs": {"browser": "ALL"},
                    }
                }
            },
        )["sessionId"]

        def command(path, body=None):
            return request("POST", f"/session/{session}/{path}", body or {})

        yield command
    finally:
        if session:
            request("DELETE", f"/session/{session}")
        process.terminate()
        process.wait(timeout=10)
