from __future__ import print_function as _

import json
import os as _os
import sys as _sys

import dash as _dash

from ._imports_ import *
from ._imports_ import __all__

if not hasattr(_dash, "__plotly_dash") and not hasattr(_dash, "development"):
    print(
        'Dash was not successfully imported. Make sure you do not have a file named "dash.py" in the current directory.',
        file=_sys.stderr,
    )
    _sys.exit(1)

_basepath = _os.path.dirname(__file__)
with open(_os.path.join(_basepath, "package-info.json"), encoding="utf-8") as _package_file:
    _package = json.load(_package_file)

npm_package_name = _package["name"]
package_name = __name__
__version__ = _package["version"]

_js_dist = [
    {
        "relative_package_path": f"{__name__}.js",
        "external_url": f"https://unpkg.com/{npm_package_name}@{__version__}/{__name__}/{__name__}.js",
        "namespace": package_name,
    },
    {
        "dev_package_path": "proptypes.js",
        "dev_only": True,
        "namespace": package_name,
    },
]

_pdfjs_root = _os.path.join(_basepath, "pdfjs")
if _os.path.isdir(_pdfjs_root):
    _pdfjs_resources = sorted(
        _os.path.relpath(_os.path.join(root, filename), _basepath).replace(_os.sep, "/")
        for root, _, filenames in _os.walk(_pdfjs_root)
        for filename in filenames
    )
    _js_dist.append(
        {
            "relative_package_path": _pdfjs_resources,
            "namespace": package_name,
            "dynamic": True,
        }
    )

_css_dist = []

for _component in __all__:
    setattr(locals()[_component], "_js_dist", _js_dist)
    setattr(locals()[_component], "_css_dist", _css_dist)
