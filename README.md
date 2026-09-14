# dash-pdf-components

Lightweight React-PDF rendering components for Plotly Dash.

```bash
uv add dash-pdf-components
```

For the common single-page viewer, use `PDF`:

```python
import dash_pdf_components as dpc
from dash import get_asset_url

dpc.PDF(
    id="pdf",
    file=get_asset_url("document.pdf"),
    pageNumber=1,
    width=720,
)
```

`PDF` combines document loading and page rendering. Navigation controls can update `PDF.pageNumber`, `PDF.scale`, and `PDF.rotate`; callbacks can read `PDF.numPages`, `PDF.documentData`, `PDF.loadProgress`, `PDF.pageData`, `PDF.renderData`, and `PDF.errorData` from the same component.

Render every page without a page-generation callback:

```python
dpc.PDF(
    file=get_asset_url("document.pdf"),
    pages="all",
    fit="width",
    style={"height": "70vh"},
)
```

`pageNumber` controls the current page; `pages` controls which pages are mounted.
Omit `pages` for single-page reading, use `"all"` for continuous reading, or a
list such as `[1, 3, 5]` for selected pages. Lists preserve order; duplicates and
invalid or out-of-range page numbers are ignored. In continuous reading,
navigation scrolls to the destination and scrolling updates `pageNumber`.
Links to pages outside an explicit selection only emit `itemClickData`, without
changing the selection. `pageNumber="all"` remains supported but is deprecated.

`fit="width"` sizes each page to the container's available width;
`fit="page"` fits both dimensions and requires an explicit container height.
These modes respond to resizing and rotation and override `width` and `height`.
`scale` multiplies the fitted size, so zooming may introduce scrollbars.

## API

Use the smallest API that fits the layout:

| Component | Use case |
| --- | --- |
| `PDF` | Default single-page viewer and callback target |
| `Document` | Shared PDF context for custom or continuous layouts |
| `Page` | One page inside `Document` |
| `Thumbnail` | Clickable page preview inside `Document` |
| `Outline` | PDF table of contents inside `Document` |

`PDF` accepts the commonly used React-PDF options directly: `file`, `pageNumber`, `width`, `height`, `scale`, `rotate`, `renderTextLayer`, `renderAnnotationLayer`, `renderForms`, `error`, and `noData`. Advanced PDF.js loading options remain available through `options`, `assetBaseUrl`, and `workerSrc`.

`Document.documentData`, `Page.pageData`, and `Thumbnail.pageData` are the
recommended names for loaded results. Their existing `loadData` aliases remain
available for compatibility. Page and layer results identify their `pageNumber`
and describe the latest event, not a collection of every rendered page.

All components expose Dash's loading state through `data-dash-is-loading`, so
`dcc.Loading` can manage callback loading consistently. React-PDF's built-in
loading messages are disabled; no `loading` property is needed. PDF resource
fetching is separate from Dash callback loading and can be monitored through
`loadProgress` and `numPages` when an application needs its own indicator.

Use the composable API only when the layout needs multiple pages, thumbnails, or an outline:

```python
dpc.Document(
    [
        dpc.Outline(),
        dpc.Thumbnail(pageNumber=1, width=120),
        dpc.Page(pageNumber=1),
        dpc.Page(pageNumber=2),
    ],
    file="/assets/document.pdf",
)
```

The package intentionally has no toolbar, theme system, locale system, or Ant Design dependency. Build navigation, zoom, rotation, and download controls with ordinary Dash components. See [`usage.py`](usage.py) for a complete example.

## Reader demo

Run a rendering-only demo without installing a UI library:

```bash
PDF_DEMO=basic python usage.py
```

This uses `PDF(pages="all", fit="width")` and has no toolbar or application callbacks.

The default reader demo includes PDF upload, an encrypted document (password: `dash-pdf`), page navigation, zoom, rotation, download, bookmarks, thumbnails, and single-page or continuous reading. It uses Ant Design when `dash-antd-components` is installed, otherwise Mantine when `dash-mantine-components` is installed. These UI libraries are optional and are not package dependencies. Its advanced layout keeps `Document + Page + Outline + Thumbnail` so every view shares the same loaded PDF.

Install either UI library and run the demo:

```bash
pip install dash-pdf-components dash-ant-design
python usage.py
```

For Mantine:

```bash
pip install dash-pdf-components dash-mantine-components dash-iconify
python usage.py
```

When both libraries are installed, Ant Design is selected by default. Set `PDF_UI=antd` or `PDF_UI=mantine` to choose explicitly, for example `PDF_UI=mantine python usage.py`. Keep the [`assets`](assets) directory alongside `usage.py`; it contains the demo PDFs and shared reader styles and callbacks. For a source checkout, build the components using the development commands below before running the demo.

### Ant Design

![PDF reader using dash-antd-components](docs/images/pdf-antd.png)

### Mantine

![PDF reader using dash-mantine-components](docs/images/pdf-mantine.png)

React-PDF uses PDF.js internally. The matching Worker, character maps, standard fonts, WASM, ICC profiles, and annotation images load from this package by default. Set `assetBaseUrl` on `PDF` or `Document` to replace them with a version-matched CDN:

```python
dpc.PDF(
    file="/assets/document.pdf",
    assetBaseUrl="https://registry.npmmirror.com/pdfjs-dist/5.4.296/files/",
)
```

`workerSrc`, `imageResourcesPath`, and individual `options` values such as `cMapUrl`, `standardFontDataUrl`, `wasmUrl`, and `iccUrl` override the defaults. These options are also available on `Document`.

Internal PDF links navigate automatically. `PDF` and a single rendered `Page` switch to the destination page, while documents rendering multiple pages scroll to the mounted destination. `itemClickData` remains available for observing navigation.
