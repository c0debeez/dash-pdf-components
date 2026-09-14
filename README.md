# dash-pdf-components

Lightweight React-PDF rendering components for Plotly Dash.

```bash
uv add dash-pdf-components
```

## Basic Usage

Run this with the bundled assets directory, or point `file` at your own PDF:

```python
import dash_pdf_components as dpc
from dash import Dash, get_asset_url

app = Dash(__name__)
app.layout = dpc.PDF(
    id="pdf",
    file=get_asset_url("documents/quixote.pdf"),
    fit="width",
    style={"height": "70vh"},
)

if __name__ == "__main__":
    app.run(debug=True)
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

Render selected pages in a fixed order:

```python
dpc.PDF(
    file=get_asset_url("documents/quixote.pdf"),
    pages=[1, 3],
    pageNumber=3,
    width=600,
    style={"height": "70vh"},
)
```

Fit a single page within both container dimensions:

```python
dpc.PDF(
    file=get_asset_url("documents/quixote.pdf"),
    fit="page",
    style={"height": "70vh"},
)
```

## Standard Callbacks

PDF controls are ordinary Dash callbacks; no JavaScript callback is needed to
change the page, scale, rotation, source, or password:

```python
from dash import Input, Output, State, html, no_update

app.layout = html.Div([
    html.Button("Next page", id="next"),
    dpc.PDF(
        id="pdf",
        file=get_asset_url("documents/quixote.pdf"),
        pages="all",
        fit="width",
        style={"height": "70vh"},
    ),
])

@app.callback(
    Output("pdf", "pageNumber"),
    Input("next", "n_clicks"),
    State("pdf", "pageNumber"),
    State("pdf", "numPages"),
    prevent_initial_call=True,
)
def next_page(_clicks, page, count):
    if not count:
        return no_update
    return min((page or 1) + 1, count)
```

Use `Document + Page + Outline + Thumbnail` for a custom shared-document layout.
All components use Dash loading state; built-in loading messages are disabled.
Resource fetching is separate from callback loading and can be observed through
`loadProgress`. Toolbars, password inputs, and download controls belong to the app.

## API

### Common Properties

| Property | Description | Default |
| --- | --- | --- |
| `aria-*` | Accessible HTML attributes | Not set |
| `className` | Root container CSS class | Not set |
| `data-*` | Custom HTML data attributes | Not set |
| `dir` | Interface text direction | Inherited |
| `hidden` | Whether to hide the container | false |
| `id` | Component ID used by Dash callbacks | Not set |
| `key` | Stable key controlling component identity | Not set |
| `lang` | Interface language tag; does not translate the PDF | Inherited |
| `loading_state` | Dash loading state; legacy compatibility managed by Dash | Managed by Dash |
| `role` | Container accessibility role | Not set |
| `style` | Root container CSS, not PDF content styling | Not set |
| `tabIndex` | Keyboard focus order | Not set |

### PDF

| Property | Description | Default |
| --- | --- | --- |
| `children` | Document children or page overlays; PDF children repeat on each page | Not set |
| `annotationsData` | Read-only latest annotation result: pageNumber, layer, count | None |
| `assetBaseUrl` | Version-matched PDF.js asset root; may use a CDN | Packaged local assets |
| `canvasBackground` | Canvas background color | Renderer default |
| `devicePixelRatio` | Physical-pixel to CSS-pixel ratio | window.devicePixelRatio |
| `documentData` | Read-only page count and fingerprints, not full PDF metadata | None |
| `error` | Custom load/render failure content | React-PDF default message |
| `errorData` | Read-only latest error stage, name, and message | None |
| `externalLinkRel` | External link rel attribute | noopener noreferrer nofollow |
| `externalLinkTarget` | External link target: _self/_blank/_parent/_top | Current window |
| `file` | URL, upload data URI, or url/data object; None clears the document | None |
| `fit` | width fits width; page fits both dimensions and needs a fixed container height; overrides width/height | Disabled |
| `height` | Base page height; ignored when width is supplied | Intrinsic size |
| `imageResourcesPath` | Annotation image resource path | Document asset web/images/ directory |
| `itemClickData` | Read-only destination pageNumber/pageIndex and timestamp for repeated clicks | None |
| `loadProgress` | Read-only loaded/total byte counts; total may be unknown | None |
| `noData` | Custom content when no document/page is provided | React-PDF default message |
| `numPages` | Read-only document page count | None |
| `options` | JSON-safe document loading options; see below | Local asset configuration |
| `pageColors` | Page color overrides: foreground and background | Original PDF colors |
| `pageData` | Read-only latest loaded page number and intrinsic/rendered dimensions | None |
| `pageNumber` | One-based current page, updated by navigation | 1 |
| `pages` | Omit for current page, all for every page, or an ordered list; duplicates and invalid pages are filtered | Current page |
| `password` | Encrypted document password; not copied into event outputs | Not set |
| `passwordData` | Read-only need-password or incorrect-password challenge | None |
| `renderAnnotationLayer` | Whether to render links and annotations | true |
| `renderData` | Read-only latest rendered page number and dimensions | None |
| `renderForms` | Whether to render interactive forms; annotations must be enabled | false |
| `renderMode` | canvas renders the page; none disables the page canvas | canvas |
| `renderTextLayer` | Whether to render selectable text | true |
| `rotate` | Clockwise rotation, usually 0/90/180/270; Page and Thumbnail can inherit document rotation | 0 |
| `scale` | Page scale multiplier; also multiplies the fitted size in PDF | 1 |
| `sourceLoaded` | Read-only source retrieval status, not page render completion | false |
| `textData` | Read-only latest text result: pageNumber, layer, count | None |
| `width` | Base page width in CSS pixels | Intrinsic size |
| `workerSrc` | PDF.js module Worker URL; overrides assetBaseUrl | Local Worker or Worker under assetBaseUrl |

### Document

| Property | Description | Default |
| --- | --- | --- |
| `children` | Document children or page overlays; PDF children repeat on each page | Not set |
| `assetBaseUrl` | Version-matched PDF.js asset root; may use a CDN | Packaged local assets |
| `documentData` | Read-only page count and fingerprints, not full PDF metadata | None |
| `error` | Custom load/render failure content | React-PDF default message |
| `errorData` | Read-only latest error stage, name, and message | None |
| `externalLinkRel` | External link rel attribute | noopener noreferrer nofollow |
| `externalLinkTarget` | External link target: _self/_blank/_parent/_top | Current window |
| `file` | URL, upload data URI, or url/data object; None clears the document | None |
| `imageResourcesPath` | Annotation image resource path | Document asset web/images/ directory |
| `itemClickData` | Read-only destination pageNumber/pageIndex and timestamp for repeated clicks | None |
| `loadData` | Read-only legacy load result; prefer documentData on Document or pageData on Page/Thumbnail | None |
| `loadProgress` | Read-only loaded/total byte counts; total may be unknown | None |
| `noData` | Custom content when no document/page is provided | React-PDF default message |
| `numPages` | Read-only document page count | None |
| `options` | JSON-safe document loading options; see below | Local asset configuration |
| `password` | Encrypted document password; not copied into event outputs | Not set |
| `passwordData` | Read-only need-password or incorrect-password challenge | None |
| `renderMode` | canvas renders the page; none disables the page canvas | canvas |
| `rotate` | Clockwise rotation, usually 0/90/180/270; Page and Thumbnail can inherit document rotation | Document setting or intrinsic PDF rotation |
| `scale` | Page scale multiplier; also multiplies the fitted size in PDF | 1 |
| `sourceLoaded` | Read-only source retrieval status, not page render completion | false |
| `workerSrc` | PDF.js module Worker URL; overrides assetBaseUrl | Local Worker or Worker under assetBaseUrl |

PDF rotation defaults to 0. Other components inherit intrinsic rotation when unspecified. Page/Thumbnail scale defaults to 1, overriding Document.scale unless explicitly set to None.

### Page

| Property | Description | Default |
| --- | --- | --- |
| `children` | Document children or page overlays; PDF children repeat on each page | Not set |
| `annotationsData` | Read-only latest annotation result: pageNumber, layer, count | None |
| `canvasBackground` | Canvas background color | Renderer default |
| `devicePixelRatio` | Physical-pixel to CSS-pixel ratio | window.devicePixelRatio |
| `error` | Custom load/render failure content | React-PDF default message |
| `errorData` | Read-only latest error stage, name, and message | None |
| `height` | Base page height; ignored when width is supplied | Intrinsic size |
| `imageResourcesPath` | Annotation image resource path | Document asset web/images/ directory |
| `loadData` | Read-only legacy load result; prefer documentData on Document or pageData on Page/Thumbnail | None |
| `noData` | Custom content when no document/page is provided | React-PDF default message |
| `pageColors` | Page color overrides: foreground and background | Original PDF colors |
| `pageData` | Read-only latest loaded page number and intrinsic/rendered dimensions | None |
| `pageIndex` | Zero-based page index; pageNumber takes precedence | 0 |
| `pageNumber` | One-based current page, updated by navigation | 1 |
| `renderAnnotationLayer` | Whether to render links and annotations | true |
| `renderData` | Read-only latest rendered page number and dimensions | None |
| `renderForms` | Whether to render interactive forms; annotations must be enabled | false |
| `renderMode` | canvas renders the page; none disables the page canvas | canvas |
| `renderTextLayer` | Whether to render selectable text | true |
| `rotate` | Clockwise rotation, usually 0/90/180/270; Page and Thumbnail can inherit document rotation | Document setting or intrinsic PDF rotation |
| `scale` | Page scale multiplier; also multiplies the fitted size in PDF | 1 |
| `textData` | Read-only latest text result: pageNumber, layer, count | None |
| `width` | Base page width in CSS pixels | Intrinsic size |

### Thumbnail

| Property | Description | Default |
| --- | --- | --- |
| `canvasBackground` | Canvas background color | Renderer default |
| `devicePixelRatio` | Physical-pixel to CSS-pixel ratio | window.devicePixelRatio |
| `error` | Custom load/render failure content | React-PDF default message |
| `errorData` | Read-only latest error stage, name, and message | None |
| `height` | Base page height; ignored when width is supplied | Intrinsic size |
| `itemClickData` | Read-only destination pageNumber/pageIndex and timestamp for repeated clicks | None |
| `loadData` | Read-only legacy load result; prefer documentData on Document or pageData on Page/Thumbnail | None |
| `noData` | Custom content when no document/page is provided | React-PDF default message |
| `pageColors` | Page color overrides: foreground and background | Original PDF colors |
| `pageData` | Read-only latest loaded page number and intrinsic/rendered dimensions | None |
| `pageIndex` | Zero-based page index; pageNumber takes precedence | 0 |
| `pageNumber` | One-based current page, updated by navigation | 1 |
| `renderData` | Read-only latest rendered page number and dimensions | None |
| `renderMode` | canvas renders the page; none disables the page canvas | canvas |
| `rotate` | Clockwise rotation, usually 0/90/180/270; Page and Thumbnail can inherit document rotation | Document setting or intrinsic PDF rotation |
| `scale` | Page scale multiplier; also multiplies the fitted size in PDF | 1 |
| `width` | Base page width in CSS pixels | Intrinsic size |

### Outline

| Property | Description | Default |
| --- | --- | --- |
| `errorData` | Read-only latest error stage, name, and message | None |
| `itemClickData` | Read-only destination pageNumber/pageIndex and timestamp for repeated clicks | None |
| `outlineData` | Read-only embedded outline: title, bold, italic, url, recursive items | None |

### options

| Property | Description | Default |
| --- | --- | --- |
| `cMapUrl` | Character map directory URL | Local cmaps/ |
| `cMapPacked` | Whether character maps are binary packed | true |
| `standardFontDataUrl` | Standard font directory URL | Local standard_fonts/ |
| `wasmUrl` | WASM directory URL | Local wasm/ |
| `iccUrl` | ICC profile directory URL | Local iccs/ |
| `httpHeaders` | Additional HTTP headers for PDF requests | Not set |
| `withCredentials` | Whether cross-origin requests include credentials | false |
| `password` | Initial password; prefer the component password property | Not set |
| `isEvalSupported` | Whether expression evaluation is allowed | false |

Defaults describe browser behavior, not Python None. Common properties apply to all five components. Output properties describe the latest event. Loading is managed by Dash; there is no loading property. options accepts additional JSON-safe PDF.js options. Use get_asset_url for local files. Workers/assets are local by default. UI theme and language do not modify original PDF content.

## Advanced Usage

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

When both libraries are installed, Ant Design is selected by default. Set `PDF_UI=antd` or `PDF_UI=mantine` to choose explicitly, for example `PDF_UI=mantine python usage.py`. Keep the [`assets`](assets) directory alongside `usage.py`; it contains the demo PDFs and shared reader styles and callbacks. For a source checkout, build the components using `pnpm run build` before running the demo.

### Ant Design

![PDF reader using dash-antd-components](docs/images/pdf-antd.png)

### Mantine

![PDF reader using dash-mantine-components](docs/images/pdf-mantine.png)

React-PDF uses PDF.js internally. The matching Worker, character maps, standard fonts, WASM, ICC profiles, and annotation images load from this package by default. Set `assetBaseUrl` on `PDF` or `Document` to replace them with a version-matched CDN:

```python
dpc.PDF(
    file=get_asset_url("document.pdf"),
    assetBaseUrl="https://registry.npmmirror.com/pdfjs-dist/5.4.296/files/",
)
```

`workerSrc`, `imageResourcesPath`, and individual `options` values such as `cMapUrl`, `standardFontDataUrl`, `wasmUrl`, and `iccUrl` override the defaults. These options are also available on `Document`.

Internal PDF links navigate automatically. `PDF` and a single rendered `Page` switch to the destination page, while documents rendering multiple pages scroll to the mounted destination. `itemClickData` remains available for observing navigation.
