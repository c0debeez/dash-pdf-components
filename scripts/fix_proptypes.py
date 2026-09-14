"""Quote wildcard HTML keys emitted unquoted by Dash's proptypes generator."""

import json
import re
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "dash_pdf_components/proptypes.js"
source = path.read_text()
source = re.sub(r"(?m)^(\s*)(aria-\*|data-\*):", lambda match: match[1] + json.dumps(match[2]) + ":", source)
path.write_text(source)
