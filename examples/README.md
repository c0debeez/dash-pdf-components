# Official React-PDF gallery

`PDF_DEMO=gallery python usage.py` offers every example in both source inventories as actual Dash PDF component trees: 31 repository examples and 44 Playground templates. Shared names remain separate because their documents differ. The default is Playground's Don Quixote (`page-wrap`).

## Sources

The repository snapshot is pinned to [ca8a425bdfb9a8ab9b26e724cd747431372fe147](https://github.com/diegomura/react-pdf/tree/ca8a425bdfb9a8ab9b26e724cd747431372fe147/apps/examples/src/examples). Its source files and public assets are preserved in `upstream/apps/examples/`; pre-rendered PDF outputs are excluded. `upstream/LICENSE` retains the upstream MIT license.

`upstream/playground.json` preserves all 44 template source strings served by [React-PDF Playground](https://react-pdf.org/playground) on September 14, 2026. `data/manifest.json` lists each example and its source link.

## Conversion

`pnpm run build:examples` evaluates the pinned source with a renderer descriptor adapter and writes `data/*.json`. Python's `gallery.get_example()` turns those descriptors into `dash_pdf_components.Document`, `Page`, `Text`, SVG, and form nodes. Previewing a saved upstream PDF is not involved.

Math and Mermaid components are expanded into renderer SVG nodes during conversion; Tailwind utilities become PDF styles. These three packages are development dependencies rather than dependencies of the browser component bundle. JSX in the gallery callback bundle uses Dash's React instance, supporting React 18 and 19.

Function properties use the existing named JavaScript reference API. `assets/official-examples.js` registers the original render, layout, and hyphenation callbacks. Each example has isolated callback state and a font-family prefix to avoid collisions when switching examples. The Playground's bare-Page resume is wrapped in a Document. Hyphenated SVG attribute names are normalized; undeclared SVG style attributes move into `style`. Anonymous Playground form fields receive stable names derived from their document path. Relative Playground font URLs map to their cached font files; SVG-image text registers its embedded Roboto family. SVG `dy`, ignored by renderer 4.9.0, is omitted while preserving the original `y` coordinate.

## Resources and generation

Fonts, photographs, SVG images, and Twemoji PNGs are cached under `assets/official/`. `resources.json` maps their original URLs to local browser URLs; the gallery does not depend on remote CORS access for these resources. The broken `https://react-pdf.org/images/logo.png` URL uses the same logo from the official site's [source repository](https://github.com/diegomura/react-pdf-site/blob/master/public/images/logo.png). Resource copyrights and licenses remain with their original owners; source files preserve font and image origins. Twemoji graphics use [CC-BY 4.0](https://github.com/twitter/twemoji/blob/master/LICENSE-GRAPHICS); the upstream examples use fonts from Google Fonts and photographs from Unsplash and the official example assets.

Run `uv run python scripts/cache_example_resources.py` to refresh the local resource map. Failed URLs are recorded in `resource-failures.json`, which is empty for this snapshot.

The repository image stress test contains 86 full-resolution images and generates a PDF of roughly 100 MB. The repository Don Quixote contains the full book. They take more memory and time than the smaller examples. Only the PDF preview generates automatically; use the additional output buttons to generate a download or transfer Base64 to Python.

The source distribution contains the gallery and assets; the wheel contains the component library. Run `usage.py` from the project/source distribution directory.

The complete source snapshot is also retained in the original renderer project. The adjacent Ant Design docs PDF page uses these conversions with the unified PDF component and AIO controls.
