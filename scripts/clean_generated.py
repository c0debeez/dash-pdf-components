"""Remove stale generated bindings while preserving the package initializer."""

from pathlib import Path

package = Path(__file__).resolve().parents[1] / "dash_pdf_components"
for file in package.glob("*.py"):
    if file.name != "__init__.py":
        file.unlink()
