# dash-pdf-components

Generate, display, and download PDFs in Plotly Dash through one `PDF` output component. `Document`, `Page`, `Text`, image, SVG, and form components describe documents to generate; they do not render HTML.

```bash
uv add dash-pdf-components
```

Python 3.10+ and Dash 3+ are required. The frontend uses `@react-pdf/renderer` for generation and React-PDF/PDF.js for display. React and ReactDOM are provided by Dash. Ant Design is optional and is not a package dependency.

## Display an existing PDF

```python
from dash import Dash, get_asset_url
import dash_pdf_components as dpc

app = Dash(__name__)
app.layout = dpc.PDF(
    id="pdf",
    file=get_asset_url("documents/quixote.pdf"),
    pages="all",
    fit="width",
    style={"height": "75vh"},
)

if __name__ == "__main__":
    app.run(debug=True)
```

Keep the sample `assets/` directory alongside this example, or use your own PDF URL. `file` accepts a URL, upload data URI, `{"url": "..."}`, or `{"data": [37, 80, 68, 70, ...]}`. Cross-origin resources require browser access permission. `None` clears the input.

Omit `pages` to show `pageNumber`, use `"all"` for continuous reading, or an ordered list such as `[1, 3, 5]`. Duplicate, invalid, and out-of-range pages are filtered. In continuous reading, navigation scrolls to the target and scrolling updates `pageNumber`. Internal links outside an explicit selection emit `itemClickData` without changing the selection. The legacy `pageNumber="all"` is deprecated.

`fit="width"` fits the available width. `fit="page"` fits both dimensions and needs an explicit container height. `scale` multiplies the fitted size; `rotate` controls page rotation. `width` and `height` describe page dimensions; set container dimensions through `style`.

## Generate and display a document

```python
from dash import Dash
import dash_pdf_components as dpc

app = Dash(__name__)
app.layout = dpc.PDF(
    id="report",
    document=dpc.Document(
        title="Report",
        children=dpc.Page(
            [
                dpc.Text("Hello PDF!"),
                dpc.Text(renderTemplate="{pageNumber} / {totalPages}", fixed=True),
            ],
            size="A4",
            style={"padding": 40},
        ),
    ),
    fit="page",
    style={"height": "75vh"},
    showDownload=True,
    fileName="report.pdf",
)

if __name__ == "__main__":
    app.run(debug=True)
```

`file` and `document` are mutually exclusive. A generated Blob passes directly to the display module inside the browser. PDF bytes do not travel through Python unless explicitly requested. Changes to document nodes or generation configuration regenerate automatically; page navigation, scale, and rotation only update the preview.

`PDF.children` is additional content repeated over displayed pages. Always supply generated content through `document`. Document-node styles follow renderer layout properties and units; `PDF.style` is HTML container CSS.

## Output modes and callbacks

| Property | Meaning | Default |
| --- | --- | --- |
| `mode` | `viewer` displays, `download` renders a link, `blob` generates without preview | `viewer` |
| `document` | One Document description to generate; mutually exclusive with file | None |
| `fileName` / `downloadLabel` | Filename and basic download link label | document.pdf / Download PDF |
| `showDownload` | Include a download link with a preview | false |
| `autoGenerate` | Generate on document or font configuration changes | true |
| `n_generate` | Change the counter to request manual generation | 0 |
| `generating` | Read-only generator activity, separate from Dash callback loading | false |
| `url` / `size` | Read-only generated browser Blob URL and byte count | None / 0 |
| `returnBase64` / `data` | Opt-in Base64 export and read-only result | false / None |
| `n_render` | Read-only successful generation count; page drawing does not increment it | 0 |
| `n_clicks` | Read-only successful download click count | 0 |
| `errorData` | Read-only error stage, name, and message | None |
| `numPages` / `documentData` | Read-only PDF.js-loaded page count and fingerprints | None |
| `pageData` / `renderData` | Read-only latest loaded/rendered page dimensions | None |
| `loadProgress` / `sourceLoaded` | Read-only source retrieval progress and status | None / false |
| `password` / `passwordData` | Reader password and read-only password challenge | None |
| `itemClickData` | Read-only internal-link destination and timestamp | None |
| `annotationsData` / `textData` | Read-only latest layer counts | None |
| `previewMode` | `pdfjs` or `native` browser iframe | pdfjs |

`mode="blob"` requires a document when an input is provided. `mode="download"` supports both existing files and generated documents. Native preview does not expose PDF.js page/layer events; `showToolbar` is a browser hint and `frameId` names its iframe. `numPages` is obtained only when PDF.js loads a document; generating without a preview does not load PDF.js just to obtain page counts.

```python
from dash import Input, Output, html

app.layout = html.Div([
    html.Button("Generate", id="generate"),
    dpc.PDF(id="output", document=document, mode="download",
            autoGenerate=False, fileName="report.pdf"),
])

@app.callback(Output("output", "n_generate"), Input("generate", "n_clicks"),
              prevent_initial_call=True)
def generate(clicks):
    return clicks
```

For Python access, enable `returnBase64=True` and decode `data` using `base64.b64decode`. Enabling Base64 export uses the current generated Blob and does not re-layout the document. Blob URLs belong to the current browser and are released on result replacement or component unmount; Python cannot fetch them. User-supplied URLs are not owned or released by this component.

`error` remains custom error UI, not an error output string. `noData` supplies empty-input UI. Dash callback loading uses Dash context; `generating` and PDF resource loading are separate activities.

## Document nodes, fonts, and functions

The upstream document primitives include `Document`, `Page`, `View`, `Text`, `Image`, `ImageBackground`, `Link`, `Note`, `Canvas`, PDF form fields, and SVG primitives. See [component properties](docs/components.md), [the upstream audit](docs/api-mapping.json), and [boundary adaptations](docs/adapters.md). Generated Python bindings include descriptions and custom document style/font types.

`fonts`, `fontAction`, `fontDescriptors`, `emojiSource`, and `hyphenationCallback` configure generation. `fontFamilies`, `fontInfo`, and `rendererVersion` expose diagnostics. Fonts must include the glyphs used in your document. Browser URLs, data URLs, image byte arrays, and supported source dictionaries are accepted; Python filesystem paths are not browser sources.

Named JavaScript functions use `{"function": "gallery.name", "options": {...}}`, registered in `window.dashPdfComponentsFunctions`. Callbacks receive their upstream arguments followed by options and context; generation context includes `createElement`, PDF primitives, and the output ID. Raw Python functions or JavaScript source strings are not component properties. The old synchronous top-level JS `createPDFElement` export is not retained; use the supplied callback context.

Font-dependent generation jobs are serialized and per-job settings restored. Superseded jobs cannot publish results. `Text.renderTemplate` adapts page-number text; Canvas accepts JSON drawing `operations`. Editable forms inside a PDF do not update Dash properties.

## Lazy loading and local assets

The main entry contains only public wrappers and the controller. Generation and PDF.js display have independent `async-pdf-generator.js` and `async-pdf-viewer.js` chunks registered with Dash.

- Displaying `file` loads the display module and Worker, without the renderer.
- Generating in blob/download mode loads the renderer, without PDF.js or its Worker.
- Generating and displaying loads both modules.
- Native preview avoids the PDF.js display module.

Matching PDF.js Worker, CMaps, standard fonts, WASM, ICC, and annotation image resources are packaged locally. `assetBaseUrl`, `workerSrc`, `imageResourcesPath`, and individual PDF.js `options` override reader resource defaults. Laziness reduces browser transfer and execution; installation still includes both engines.

## Preserved official examples and Ant Design reader

The complete `examples/` snapshot and conversions from the companion renderer project are preserved: 31 repository examples and 44 Playground templates, including upstream source and licenses. The original `../dash-pdf-renderer-components/examples` is left intact. See [example sources and resources](examples/README.md).

```bash
uv sync
pnpm install --frozen-lockfile
pnpm run build
python usage.py                       # editable generation + existing-file reader
PDF_DEMO=basic python usage.py         # display only
PDF_DEMO=gallery python usage.py       # all 75 generated examples
```

The gallery serves cached fonts, images, emoji, and named callbacks from `assets/`. Some source examples are large: the image stress test generates about 100 MB and the full Don Quixote requires more processing time. Downloads and Base64 jobs are manual in the gallery.

The adjacent `dash-antd-components/docs` PDF page includes existing-file reading, all 75 generated examples through `PDFReaderAIO`, and manual download/Base64 output. AIO owns pagination, zoom, rotation, password entry, theme, and download controls, keeping Ant Design out of this package's runtime dependencies. To develop that docs app, install this checkout into its environment, then run the docs app using its README instructions.

## Migration from the separate libraries

| Previous interface | Unified interface |
| --- | --- |
| `dash_pdf_renderer_components.Document/Page/Text/...` | `dash_pdf_components.Document/Page/Text/...` |
| `PDFViewer(children=document)` | `PDF(document=document, mode="viewer")` |
| `BlobProvider(document=document)` | `PDF(document=document, mode="blob")` |
| `PDFDownloadLink(document=document)` | `PDF(document=document, mode="download")` |
| Output `loading` / error string `error` | `generating` / structured `errorData` |
| Viewer CSS width/height | `PDF.style` width/height |
| `previewMode="playground"` | `previewMode="pdfjs"`, with optional AIO controls |
| Status `render` / custom download children | Ordinary Dash callback UI / `downloadLabel` |

The old output wrappers are not exported. Older reader `Document + Page` composition becomes `PDF(file=..., pageNumber=...)`; the new Document/Page describe generated content. Reader Outline/Thumbnail wrappers are not provided. This is a breaking 0.2 release with Dash 3 as the minimum version.
