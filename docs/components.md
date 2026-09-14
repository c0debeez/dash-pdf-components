# Component reference

Generated from the installed renderer declarations and [API mapping](api-mapping.json). Direct fields retain upstream semantics; adapted fields use the [Dash adapters](adapters.md).

Each example assumes `import dash_pdf_components as dpr`. Image examples require a local `assets/photo.png`. Definitions must be referenced by visible SVG shapes to affect the output.

## Document

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Text("Hello"))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| title | string | direct | Same renderer property and semantics. |
| author | string | direct | Same renderer property and semantics. |
| subject | string | direct | Same renderer property and semantics. |
| creator | string | direct | Same renderer property and semantics. |
| keywords | string | direct | Same renderer property and semantics. |
| producer | string | direct | Same renderer property and semantics. |
| language | string | direct | Same renderer property and semantics. |
| creationDate | string | adapted | ISO 8601 string validated and converted to Date. |
| modificationDate | string | adapted | ISO 8601 string validated and converted to Date. |
| pdfVersion | "1.3" \| "1.4" \| "1.5" \| "1.6" \| "1.7" \| "1.7ext3" | direct | Same renderer property and semantics. |
| conformance | "PDF/A-1" \| "PDF/A-1b" \| "PDF/A-2" \| "PDF/A-2b" \| "PDF/A-3" \| "PDF/A-3b" | direct | Same renderer property and semantics. |
| pageMode | "useNone" \| "useOutlines" \| "useThumbs" \| "fullScreen" \| "useOC" \| "useAttachments" | direct | Same renderer property and semantics. |
| pageLayout | "singlePage" \| "oneColumn" \| "twoColumnLeft" \| "twoColumnRight" \| "twoPageLeft" \| "twoPageRight" | direct | Same renderer property and semantics. |
| ownerPassword | string | direct | Same renderer property and semantics. |
| userPassword | string | direct | Same renderer property and semantics. |
| permissions | Permissions | direct | Same renderer property and semantics. |
| onRender | FunctionProps | adapted | Named registry function, original arguments followed by options and context. |

## Page

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Text("Hello"), size="A4")))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| wrap | boolean | direct | Same renderer property and semantics. |
| layout | FunctionProps | adapted | Named registry function, original arguments followed by options and context. |
| experimentalPagination | boolean | direct | Same renderer property and semantics. |
| debug | boolean | direct | Same renderer property and semantics. |
| size | string \| (string \| number)[] \| { width: string \| number; height?: string \| number } | direct | Same renderer property and semantics. |
| orientation | "portrait" \| "landscape" | direct | Same renderer property and semantics. |
| dpi | number | direct | Same renderer property and semantics. |
| bookmark | string \| Bookmark | direct | Same renderer property and semantics. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |

## View

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.View(dpr.Text("Hello")))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| wrap | boolean | direct | Same renderer property and semantics. |
| debug | boolean | direct | Same renderer property and semantics. |
| render | FunctionProps | adapted | Named registry function, original arguments followed by options and context. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |

## Text

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Text("Hello"))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| wrap | boolean | direct | Same renderer property and semantics. |
| debug | boolean | direct | Same renderer property and semantics. |
| render | FunctionProps | adapted | Named registry function, original arguments followed by options and context. |
| hyphenationCallback | FunctionProps | adapted | Named registry function, original arguments followed by options and context. |
| hyphenationPenalty | number | direct | Same renderer property and semantics. |
| orphans | number | direct | Same renderer property and semantics. |
| widows | number | direct | Same renderer property and semantics. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |
| x | string \| number | direct | Same renderer property and semantics. |
| y | string \| number | direct | Same renderer property and semantics. |
| fill | string | direct | Same renderer property and semantics. |
| color | string | direct | Same renderer property and semantics. |
| stroke | string | direct | Same renderer property and semantics. |
| transform | string | direct | Same renderer property and semantics. |
| strokeDasharray | string | direct | Same renderer property and semantics. |
| opacity | string \| number | direct | Same renderer property and semantics. |
| strokeWidth | string \| number | direct | Same renderer property and semantics. |
| fillOpacity | string \| number | direct | Same renderer property and semantics. |
| fillRule | "nonzero" \| "evenodd" | direct | Same renderer property and semantics. |
| strokeOpacity | string \| number | direct | Same renderer property and semantics. |
| textAnchor | "start" \| "middle" \| "end" | direct | Same renderer property and semantics. |
| strokeLinecap | "butt" \| "round" \| "square" | direct | Same renderer property and semantics. |
| strokeLinejoin | "butt" \| "round" \| "square" \| "miter" \| "bevel" | direct | Same renderer property and semantics. |
| visibility | "visible" \| "hidden" \| "collapse" | direct | Same renderer property and semantics. |
| clipPath | string | direct | Same renderer property and semantics. |
| markerStart | string | direct | Same renderer property and semantics. |
| markerMid | string | direct | Same renderer property and semantics. |
| markerEnd | string | direct | Same renderer property and semantics. |
| dominantBaseline | "middle" \| "auto" \| "central" \| "hanging" \| "mathematical" \| "text-after-edge" \| "text-before-edge" | direct | Same renderer property and semantics. |

## Image

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Image(src="/assets/photo.png", style={"width": 100}))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| debug | boolean | direct | Same renderer property and semantics. |
| cache | boolean | direct | Same renderer property and semantics. |
| srcSet | string | direct | Same renderer property and semantics. |
| sizes | string \| number | direct | Same renderer property and semantics. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |
| src | ImageSource \| FunctionProps | adapted | URL/data URL, request dictionary, {data: base64, format}, byte list or named (possibly async) source function. |
| source | ImageSource \| FunctionProps | adapted | URL/data URL, request dictionary, {data: base64, format}, byte list or named (possibly async) source function. |
| x | string \| number | direct | SVG image coordinate from the browser implementation; omitted from upstream ImageProps. |
| y | string \| number | direct | SVG image coordinate from the browser implementation; omitted from upstream ImageProps. |

## ImageBackground

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.ImageBackground(dpr.Text("Caption"), src="/assets/photo.png", style={"width": 200, "height": 100}))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| debug | boolean | direct | Same renderer property and semantics. |
| cache | boolean | direct | Same renderer property and semantics. |
| srcSet | string | direct | Same renderer property and semantics. |
| sizes | string \| number | direct | Same renderer property and semantics. |
| imageStyle | Record<string, any> | direct | Same renderer property and semantics. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |
| src | ImageSource \| FunctionProps | adapted | URL/data URL, request dictionary, {data: base64, format}, byte list or named (possibly async) source function. |
| source | ImageSource \| FunctionProps | adapted | URL/data URL, request dictionary, {data: base64, format}, byte list or named (possibly async) source function. |

## Link

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Link("Visit", src="https://react-pdf.org"))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| wrap | boolean | direct | Same renderer property and semantics. |
| debug | boolean | direct | Same renderer property and semantics. |
| href | string | direct | Same renderer property and semantics. |
| src | string | direct | Same renderer property and semantics. |
| hitSlop | number \| { "top"?: number; "bottom"?: number; "left"?: number; "right"?: number } | direct | Same renderer property and semantics. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |

## Note

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Note("An annotation"))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| children | string | direct | Same renderer property and semantics. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |

## Canvas

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Canvas(operations=[{"method": "rect", "args": [0, 0, 100, 20]}, {"method": "fill", "args": ["blue"]}], style={"width": 100, "height": 20}))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| debug | boolean | direct | Same renderer property and semantics. |
| paint | FunctionProps | adapted | Named registry function, original arguments followed by options and context. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |

## FieldSet

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.FieldSet(dpr.TextInput(name="name", value="Ada"), name="person"))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| name | string | direct | Same renderer property and semantics. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |

## TextInput

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.TextInput(name="name", value="Ada", style={"width": 150, "height": 25}))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| align | "left" \| "center" \| "right" | direct | Same renderer property and semantics. |
| multiline | boolean | direct | Same renderer property and semantics. |
| password | boolean | direct | Same renderer property and semantics. |
| noSpell | boolean | direct | Same renderer property and semantics. |
| format | { "type": "number" \| "date" \| "time" \| "percent" \| "zip" \| "zipPlus4" \| "phone" \| "ssn"; "param"?: string; "nDec"?: number; "sepComma"?: boolean; "negStyle"?: "MinusBlack" \| "Red" \| "ParensBlack" \| "ParensRed"; "currency"?: string; "currencyPrepend"?: boolean } | direct | Same renderer property and semantics. |
| fontSize | number | direct | Same renderer property and semantics. |
| maxLength | number | direct | Same renderer property and semantics. |
| name | string | direct | Same renderer property and semantics. |
| required | boolean | direct | Same renderer property and semantics. |
| noExport | boolean | direct | Same renderer property and semantics. |
| readOnly | boolean | direct | Same renderer property and semantics. |
| value | string \| number | direct | Same renderer property and semantics. |
| defaultValue | string \| number | direct | Same renderer property and semantics. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |

## Checkbox

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Checkbox(name="agree", checked=True, style={"width": 20, "height": 20}))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| backgroundColor | string | direct | Same renderer property and semantics. |
| borderColor | string | direct | Same renderer property and semantics. |
| checked | boolean | direct | Same renderer property and semantics. |
| onState | string | direct | Same renderer property and semantics. |
| offState | string | direct | Same renderer property and semantics. |
| xMark | boolean | direct | Same renderer property and semantics. |
| name | string | direct | Same renderer property and semantics. |
| required | boolean | direct | Same renderer property and semantics. |
| noExport | boolean | direct | Same renderer property and semantics. |
| readOnly | boolean | direct | Same renderer property and semantics. |
| value | string \| number | direct | Same renderer property and semantics. |
| defaultValue | string \| number | direct | Same renderer property and semantics. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |

## Select

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Select(name="choice", select=["one", "two"], value="one", style={"width": 100, "height": 25}))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| sort | boolean | direct | Same renderer property and semantics. |
| edit | boolean | direct | Same renderer property and semantics. |
| multiSelect | boolean | direct | Same renderer property and semantics. |
| noSpell | boolean | direct | Same renderer property and semantics. |
| select | (string)[] | direct | Same renderer property and semantics. |
| name | string | direct | Same renderer property and semantics. |
| required | boolean | direct | Same renderer property and semantics. |
| noExport | boolean | direct | Same renderer property and semantics. |
| readOnly | boolean | direct | Same renderer property and semantics. |
| value | string \| number | direct | Same renderer property and semantics. |
| defaultValue | string \| number | direct | Same renderer property and semantics. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |

## List

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.List(name="choices", select=["one", "two"], value="two", style={"width": 100, "height": 40}))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| sort | boolean | direct | Same renderer property and semantics. |
| edit | boolean | direct | Same renderer property and semantics. |
| multiSelect | boolean | direct | Same renderer property and semantics. |
| noSpell | boolean | direct | Same renderer property and semantics. |
| select | (string)[] | direct | Same renderer property and semantics. |
| name | string | direct | Same renderer property and semantics. |
| required | boolean | direct | Same renderer property and semantics. |
| noExport | boolean | direct | Same renderer property and semantics. |
| readOnly | boolean | direct | Same renderer property and semantics. |
| value | string \| number | direct | Same renderer property and semantics. |
| defaultValue | string \| number | direct | Same renderer property and semantics. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |

## Svg

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Rect(width=100, height=50, fill="blue"), width=100, height=50))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| debug | boolean | direct | Same renderer property and semantics. |
| width | string \| number | direct | Same renderer property and semantics. |
| height | string \| number | direct | Same renderer property and semantics. |
| viewBox | string | direct | Same renderer property and semantics. |
| preserveAspectRatio | string | direct | Same renderer property and semantics. |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fixed | boolean | direct | Same renderer property and semantics. |
| break | boolean | direct | Same renderer property and semantics. |
| minPresenceAhead | number | direct | Same renderer property and semantics. |
| fill | string | direct | Same renderer property and semantics. |
| color | string | direct | Same renderer property and semantics. |
| stroke | string | direct | Same renderer property and semantics. |
| transform | string | direct | Same renderer property and semantics. |
| strokeDasharray | string | direct | Same renderer property and semantics. |
| opacity | string \| number | direct | Same renderer property and semantics. |
| strokeWidth | string \| number | direct | Same renderer property and semantics. |
| fillOpacity | string \| number | direct | Same renderer property and semantics. |
| fillRule | "nonzero" \| "evenodd" | direct | Same renderer property and semantics. |
| strokeOpacity | string \| number | direct | Same renderer property and semantics. |
| textAnchor | "start" \| "middle" \| "end" | direct | Same renderer property and semantics. |
| strokeLinecap | "butt" \| "round" \| "square" | direct | Same renderer property and semantics. |
| strokeLinejoin | "butt" \| "round" \| "square" \| "miter" \| "bevel" | direct | Same renderer property and semantics. |
| visibility | "visible" \| "hidden" \| "collapse" | direct | Same renderer property and semantics. |
| clipPath | string | direct | Same renderer property and semantics. |
| markerStart | string | direct | Same renderer property and semantics. |
| markerMid | string | direct | Same renderer property and semantics. |
| markerEnd | string | direct | Same renderer property and semantics. |
| dominantBaseline | "middle" \| "auto" \| "central" \| "hanging" \| "mathematical" \| "text-after-edge" \| "text-before-edge" | direct | Same renderer property and semantics. |

## Line

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Line(x1=0, y1=0, x2=100, y2=50, stroke="black"), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| x1 | string \| number | direct | Same renderer property and semantics. |
| x2 | string \| number | direct | Same renderer property and semantics. |
| y1 | string \| number | direct | Same renderer property and semantics. |
| y2 | string \| number | direct | Same renderer property and semantics. |
| fill | string | direct | Same renderer property and semantics. |
| color | string | direct | Same renderer property and semantics. |
| stroke | string | direct | Same renderer property and semantics. |
| transform | string | direct | Same renderer property and semantics. |
| strokeDasharray | string | direct | Same renderer property and semantics. |
| opacity | string \| number | direct | Same renderer property and semantics. |
| strokeWidth | string \| number | direct | Same renderer property and semantics. |
| fillOpacity | string \| number | direct | Same renderer property and semantics. |
| fillRule | "nonzero" \| "evenodd" | direct | Same renderer property and semantics. |
| strokeOpacity | string \| number | direct | Same renderer property and semantics. |
| textAnchor | "start" \| "middle" \| "end" | direct | Same renderer property and semantics. |
| strokeLinecap | "butt" \| "round" \| "square" | direct | Same renderer property and semantics. |
| strokeLinejoin | "butt" \| "round" \| "square" \| "miter" \| "bevel" | direct | Same renderer property and semantics. |
| visibility | "visible" \| "hidden" \| "collapse" | direct | Same renderer property and semantics. |
| clipPath | string | direct | Same renderer property and semantics. |
| markerStart | string | direct | Same renderer property and semantics. |
| markerMid | string | direct | Same renderer property and semantics. |
| markerEnd | string | direct | Same renderer property and semantics. |
| dominantBaseline | "middle" \| "auto" \| "central" \| "hanging" \| "mathematical" \| "text-after-edge" \| "text-before-edge" | direct | Same renderer property and semantics. |

## Polyline

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Polyline(points="0,0 50,50 100,0", stroke="black"), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| points | string | direct | Same renderer property and semantics. |
| fill | string | direct | Same renderer property and semantics. |
| color | string | direct | Same renderer property and semantics. |
| stroke | string | direct | Same renderer property and semantics. |
| transform | string | direct | Same renderer property and semantics. |
| strokeDasharray | string | direct | Same renderer property and semantics. |
| opacity | string \| number | direct | Same renderer property and semantics. |
| strokeWidth | string \| number | direct | Same renderer property and semantics. |
| fillOpacity | string \| number | direct | Same renderer property and semantics. |
| fillRule | "nonzero" \| "evenodd" | direct | Same renderer property and semantics. |
| strokeOpacity | string \| number | direct | Same renderer property and semantics. |
| textAnchor | "start" \| "middle" \| "end" | direct | Same renderer property and semantics. |
| strokeLinecap | "butt" \| "round" \| "square" | direct | Same renderer property and semantics. |
| strokeLinejoin | "butt" \| "round" \| "square" \| "miter" \| "bevel" | direct | Same renderer property and semantics. |
| visibility | "visible" \| "hidden" \| "collapse" | direct | Same renderer property and semantics. |
| clipPath | string | direct | Same renderer property and semantics. |
| markerStart | string | direct | Same renderer property and semantics. |
| markerMid | string | direct | Same renderer property and semantics. |
| markerEnd | string | direct | Same renderer property and semantics. |
| dominantBaseline | "middle" \| "auto" \| "central" \| "hanging" \| "mathematical" \| "text-after-edge" \| "text-before-edge" | direct | Same renderer property and semantics. |

## Polygon

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Polygon(points="0,0 50,50 100,0", fill="blue"), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| points | string | direct | Same renderer property and semantics. |
| fill | string | direct | Same renderer property and semantics. |
| color | string | direct | Same renderer property and semantics. |
| stroke | string | direct | Same renderer property and semantics. |
| transform | string | direct | Same renderer property and semantics. |
| strokeDasharray | string | direct | Same renderer property and semantics. |
| opacity | string \| number | direct | Same renderer property and semantics. |
| strokeWidth | string \| number | direct | Same renderer property and semantics. |
| fillOpacity | string \| number | direct | Same renderer property and semantics. |
| fillRule | "nonzero" \| "evenodd" | direct | Same renderer property and semantics. |
| strokeOpacity | string \| number | direct | Same renderer property and semantics. |
| textAnchor | "start" \| "middle" \| "end" | direct | Same renderer property and semantics. |
| strokeLinecap | "butt" \| "round" \| "square" | direct | Same renderer property and semantics. |
| strokeLinejoin | "butt" \| "round" \| "square" \| "miter" \| "bevel" | direct | Same renderer property and semantics. |
| visibility | "visible" \| "hidden" \| "collapse" | direct | Same renderer property and semantics. |
| clipPath | string | direct | Same renderer property and semantics. |
| markerStart | string | direct | Same renderer property and semantics. |
| markerMid | string | direct | Same renderer property and semantics. |
| markerEnd | string | direct | Same renderer property and semantics. |
| dominantBaseline | "middle" \| "auto" \| "central" \| "hanging" \| "mathematical" \| "text-after-edge" \| "text-before-edge" | direct | Same renderer property and semantics. |

## Path

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Path(d="M0 0L100 50", stroke="black"), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| d | string | direct | Same renderer property and semantics. |
| fill | string | direct | Same renderer property and semantics. |
| color | string | direct | Same renderer property and semantics. |
| stroke | string | direct | Same renderer property and semantics. |
| transform | string | direct | Same renderer property and semantics. |
| strokeDasharray | string | direct | Same renderer property and semantics. |
| opacity | string \| number | direct | Same renderer property and semantics. |
| strokeWidth | string \| number | direct | Same renderer property and semantics. |
| fillOpacity | string \| number | direct | Same renderer property and semantics. |
| fillRule | "nonzero" \| "evenodd" | direct | Same renderer property and semantics. |
| strokeOpacity | string \| number | direct | Same renderer property and semantics. |
| textAnchor | "start" \| "middle" \| "end" | direct | Same renderer property and semantics. |
| strokeLinecap | "butt" \| "round" \| "square" | direct | Same renderer property and semantics. |
| strokeLinejoin | "butt" \| "round" \| "square" \| "miter" \| "bevel" | direct | Same renderer property and semantics. |
| visibility | "visible" \| "hidden" \| "collapse" | direct | Same renderer property and semantics. |
| clipPath | string | direct | Same renderer property and semantics. |
| markerStart | string | direct | Same renderer property and semantics. |
| markerMid | string | direct | Same renderer property and semantics. |
| markerEnd | string | direct | Same renderer property and semantics. |
| dominantBaseline | "middle" \| "auto" \| "central" \| "hanging" \| "mathematical" \| "text-after-edge" \| "text-before-edge" | direct | Same renderer property and semantics. |

## Rect

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Rect(width=100, height=50, fill="blue"), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| x | string \| number | direct | Same renderer property and semantics. |
| y | string \| number | direct | Same renderer property and semantics. |
| width | string \| number | direct | Same renderer property and semantics. |
| height | string \| number | direct | Same renderer property and semantics. |
| rx | string \| number | direct | Same renderer property and semantics. |
| ry | string \| number | direct | Same renderer property and semantics. |
| fill | string | direct | Same renderer property and semantics. |
| color | string | direct | Same renderer property and semantics. |
| stroke | string | direct | Same renderer property and semantics. |
| transform | string | direct | Same renderer property and semantics. |
| strokeDasharray | string | direct | Same renderer property and semantics. |
| opacity | string \| number | direct | Same renderer property and semantics. |
| strokeWidth | string \| number | direct | Same renderer property and semantics. |
| fillOpacity | string \| number | direct | Same renderer property and semantics. |
| fillRule | "nonzero" \| "evenodd" | direct | Same renderer property and semantics. |
| strokeOpacity | string \| number | direct | Same renderer property and semantics. |
| textAnchor | "start" \| "middle" \| "end" | direct | Same renderer property and semantics. |
| strokeLinecap | "butt" \| "round" \| "square" | direct | Same renderer property and semantics. |
| strokeLinejoin | "butt" \| "round" \| "square" \| "miter" \| "bevel" | direct | Same renderer property and semantics. |
| visibility | "visible" \| "hidden" \| "collapse" | direct | Same renderer property and semantics. |
| clipPath | string | direct | Same renderer property and semantics. |
| markerStart | string | direct | Same renderer property and semantics. |
| markerMid | string | direct | Same renderer property and semantics. |
| markerEnd | string | direct | Same renderer property and semantics. |
| dominantBaseline | "middle" \| "auto" \| "central" \| "hanging" \| "mathematical" \| "text-after-edge" \| "text-before-edge" | direct | Same renderer property and semantics. |

## Circle

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Circle(cx=25, cy=25, r=20, fill="blue"), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| cx | string \| number | direct | Same renderer property and semantics. |
| cy | string \| number | direct | Same renderer property and semantics. |
| r | string \| number | direct | Same renderer property and semantics. |
| fill | string | direct | Same renderer property and semantics. |
| color | string | direct | Same renderer property and semantics. |
| stroke | string | direct | Same renderer property and semantics. |
| transform | string | direct | Same renderer property and semantics. |
| strokeDasharray | string | direct | Same renderer property and semantics. |
| opacity | string \| number | direct | Same renderer property and semantics. |
| strokeWidth | string \| number | direct | Same renderer property and semantics. |
| fillOpacity | string \| number | direct | Same renderer property and semantics. |
| fillRule | "nonzero" \| "evenodd" | direct | Same renderer property and semantics. |
| strokeOpacity | string \| number | direct | Same renderer property and semantics. |
| textAnchor | "start" \| "middle" \| "end" | direct | Same renderer property and semantics. |
| strokeLinecap | "butt" \| "round" \| "square" | direct | Same renderer property and semantics. |
| strokeLinejoin | "butt" \| "round" \| "square" \| "miter" \| "bevel" | direct | Same renderer property and semantics. |
| visibility | "visible" \| "hidden" \| "collapse" | direct | Same renderer property and semantics. |
| clipPath | string | direct | Same renderer property and semantics. |
| markerStart | string | direct | Same renderer property and semantics. |
| markerMid | string | direct | Same renderer property and semantics. |
| markerEnd | string | direct | Same renderer property and semantics. |
| dominantBaseline | "middle" \| "auto" \| "central" \| "hanging" \| "mathematical" \| "text-after-edge" \| "text-before-edge" | direct | Same renderer property and semantics. |

## Ellipse

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Ellipse(cx=50, cy=25, rx=40, ry=20, fill="blue"), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| cx | string \| number | direct | Same renderer property and semantics. |
| cy | string \| number | direct | Same renderer property and semantics. |
| rx | string \| number | direct | Same renderer property and semantics. |
| ry | string \| number | direct | Same renderer property and semantics. |
| fill | string | direct | Same renderer property and semantics. |
| color | string | direct | Same renderer property and semantics. |
| stroke | string | direct | Same renderer property and semantics. |
| transform | string | direct | Same renderer property and semantics. |
| strokeDasharray | string | direct | Same renderer property and semantics. |
| opacity | string \| number | direct | Same renderer property and semantics. |
| strokeWidth | string \| number | direct | Same renderer property and semantics. |
| fillOpacity | string \| number | direct | Same renderer property and semantics. |
| fillRule | "nonzero" \| "evenodd" | direct | Same renderer property and semantics. |
| strokeOpacity | string \| number | direct | Same renderer property and semantics. |
| textAnchor | "start" \| "middle" \| "end" | direct | Same renderer property and semantics. |
| strokeLinecap | "butt" \| "round" \| "square" | direct | Same renderer property and semantics. |
| strokeLinejoin | "butt" \| "round" \| "square" \| "miter" \| "bevel" | direct | Same renderer property and semantics. |
| visibility | "visible" \| "hidden" \| "collapse" | direct | Same renderer property and semantics. |
| clipPath | string | direct | Same renderer property and semantics. |
| markerStart | string | direct | Same renderer property and semantics. |
| markerMid | string | direct | Same renderer property and semantics. |
| markerEnd | string | direct | Same renderer property and semantics. |
| dominantBaseline | "middle" \| "auto" \| "central" \| "hanging" \| "mathematical" \| "text-after-edge" \| "text-before-edge" | direct | Same renderer property and semantics. |

## Tspan

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Text(dpr.Tspan("SVG label", x=10, y=25), x=10, y=25), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| x | string \| number | direct | Same renderer property and semantics. |
| y | string \| number | direct | Same renderer property and semantics. |
| fill | string | direct | Same renderer property and semantics. |
| color | string | direct | Same renderer property and semantics. |
| stroke | string | direct | Same renderer property and semantics. |
| transform | string | direct | Same renderer property and semantics. |
| strokeDasharray | string | direct | Same renderer property and semantics. |
| opacity | string \| number | direct | Same renderer property and semantics. |
| strokeWidth | string \| number | direct | Same renderer property and semantics. |
| fillOpacity | string \| number | direct | Same renderer property and semantics. |
| fillRule | "nonzero" \| "evenodd" | direct | Same renderer property and semantics. |
| strokeOpacity | string \| number | direct | Same renderer property and semantics. |
| textAnchor | "start" \| "middle" \| "end" | direct | Same renderer property and semantics. |
| strokeLinecap | "butt" \| "round" \| "square" | direct | Same renderer property and semantics. |
| strokeLinejoin | "butt" \| "round" \| "square" \| "miter" \| "bevel" | direct | Same renderer property and semantics. |
| visibility | "visible" \| "hidden" \| "collapse" | direct | Same renderer property and semantics. |
| clipPath | string | direct | Same renderer property and semantics. |
| markerStart | string | direct | Same renderer property and semantics. |
| markerMid | string | direct | Same renderer property and semantics. |
| markerEnd | string | direct | Same renderer property and semantics. |
| dominantBaseline | "middle" \| "auto" \| "central" \| "hanging" \| "mathematical" \| "text-after-edge" \| "text-before-edge" | direct | Same renderer property and semantics. |

## G

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.G(dpr.Rect(width=100, height=50), opacity=0.5), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| style | PDFStyle \| PDFStyle[] | adapted | Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. |
| fill | string | direct | Same renderer property and semantics. |
| color | string | direct | Same renderer property and semantics. |
| stroke | string | direct | Same renderer property and semantics. |
| transform | string | direct | Same renderer property and semantics. |
| strokeDasharray | string | direct | Same renderer property and semantics. |
| opacity | string \| number | direct | Same renderer property and semantics. |
| strokeWidth | string \| number | direct | Same renderer property and semantics. |
| fillOpacity | string \| number | direct | Same renderer property and semantics. |
| fillRule | "nonzero" \| "evenodd" | direct | Same renderer property and semantics. |
| strokeOpacity | string \| number | direct | Same renderer property and semantics. |
| textAnchor | "start" \| "middle" \| "end" | direct | Same renderer property and semantics. |
| strokeLinecap | "butt" \| "round" \| "square" | direct | Same renderer property and semantics. |
| strokeLinejoin | "butt" \| "round" \| "square" \| "miter" \| "bevel" | direct | Same renderer property and semantics. |
| visibility | "visible" \| "hidden" \| "collapse" | direct | Same renderer property and semantics. |
| clipPath | string | direct | Same renderer property and semantics. |
| markerStart | string | direct | Same renderer property and semantics. |
| markerMid | string | direct | Same renderer property and semantics. |
| markerEnd | string | direct | Same renderer property and semantics. |
| dominantBaseline | "middle" \| "auto" \| "central" \| "hanging" \| "mathematical" \| "text-after-edge" \| "text-before-edge" | direct | Same renderer property and semantics. |

## Stop

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.LinearGradient([dpr.Stop(offset="0%", stopColor="blue"), dpr.Stop(offset="100%", stopColor="green")], pdfId="gradient"), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| offset | string \| number | direct | Same renderer property and semantics. |
| stopColor | string | direct | Same renderer property and semantics. |
| stopOpacity | string \| number | direct | Same renderer property and semantics. |

## Defs

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Defs(dpr.ClipPath(dpr.Rect(width=100, height=50), pdfId="clip")), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |

## ClipPath

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Defs(dpr.ClipPath(dpr.Rect(width=100, height=50), pdfId="clip")), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |

## Marker

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Defs(dpr.Marker(dpr.Path(d="M0 0L8 4L0 8Z", fill="black"), pdfId="arrow", markerWidth=8, markerHeight=8)), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| viewBox | string | direct | Same renderer property and semantics. |
| refX | string \| number | direct | Same renderer property and semantics. |
| refY | string \| number | direct | Same renderer property and semantics. |
| markerWidth | string \| number | direct | Same renderer property and semantics. |
| markerHeight | string \| number | direct | Same renderer property and semantics. |
| orient | number \| "auto" \| "auto-start-reverse" | direct | Same renderer property and semantics. |
| markerUnits | "strokeWidth" \| "userSpaceOnUse" | direct | Same renderer property and semantics. |

## LinearGradient

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Defs(dpr.LinearGradient([dpr.Stop(offset="0%", stopColor="blue"), dpr.Stop(offset="100%", stopColor="green")], pdfId="gradient")), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| x1 | string \| number | direct | Same renderer property and semantics. |
| x2 | string \| number | direct | Same renderer property and semantics. |
| y1 | string \| number | direct | Same renderer property and semantics. |
| y2 | string \| number | direct | Same renderer property and semantics. |
| xlinkHref | string | direct | Same renderer property and semantics. |
| gradientTransform | string | direct | Same renderer property and semantics. |
| gradientUnits | "userSpaceOnUse" \| "objectBoundingBox" | direct | Same renderer property and semantics. |

## RadialGradient

```python
component = dpr.PDF(document=dpr.Document(dpr.Page(dpr.Svg(dpr.Defs(dpr.RadialGradient([dpr.Stop(offset="0%", stopColor="blue"), dpr.Stop(offset="100%", stopColor="white")], pdfId="gradient")), width=200, height=100))))
```

| Property | Type | Mapping | Notes |
| --- | --- | --- | --- |
| id | string \| Record<string, any> | adapted | Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. |
| cx | string \| number | direct | Same renderer property and semantics. |
| cy | string \| number | direct | Same renderer property and semantics. |
| r | string \| number | direct | Same renderer property and semantics. |
| fx | string \| number | direct | Same renderer property and semantics. |
| fy | string \| number | direct | Same renderer property and semantics. |
| xlinkHref | string | direct | Same renderer property and semantics. |
| gradientTransform | string | direct | Same renderer property and semantics. |
| gradientUnits | "userSpaceOnUse" \| "objectBoundingBox" | direct | Same renderer property and semantics. |
