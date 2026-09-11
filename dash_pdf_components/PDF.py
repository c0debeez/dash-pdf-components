# AUTO GENERATED FILE - DO NOT EDIT

import typing  # noqa: F401
from typing_extensions import TypedDict, NotRequired, Literal # noqa: F401
from dash.development.base_component import Component, _explicitize_args
try:
    from dash.types import NumberType  # noqa: F401
except ImportError:
    # Backwards compatibility for dash<=4.1.0
    if typing.TYPE_CHECKING:
        raise
    NumberType = typing.Union[  # noqa: F401
        typing.SupportsFloat, typing.SupportsInt, typing.SupportsComplex
    ]

PDFUrlType = TypedDict(
    "PDFUrlType",
    {"url": str},
)
PDFDataType = TypedDict(
    "PDFDataType",
    {"data": typing.Sequence[NumberType]},
)


ComponentSingleType = typing.Union[str, int, float, Component, None]
ComponentType = typing.Union[
    ComponentSingleType,
    typing.Sequence[ComponentSingleType],
]


class PDF(Component):
    """A PDF component.
Renders a common single-page PDF viewer with document and page state exposed as one Dash component.

Keyword arguments:

- children (a list of or a singular dash component, string or number; optional):
    Additional content rendered inside the page.

- id (string; optional):
    Unique ID to identify this component in Dash callbacks.

- annotationsData (dict; optional):
    Latest annotation-layer result. Read-only.

    `annotationsData` is a dict with keys:

    - layer (a value equal to: 'annotations', 'text'; required):
        Layer that finished loading or rendering.

    - count (number; optional):
        Number of loaded items when available.

- aria-* (string; optional):
    Wild card aria attributes.

- assetBaseUrl (string; optional):
    Base URL containing version-matched PDF.js assets. Defaults to
    assets installed with this package.

- canvasBackground (string; optional):
    Canvas background color.

- className (string; optional):
    className of the component.

- data-* (string; optional):
    Wild card data attributes.

- devicePixelRatio (number; optional):
    Physical-pixel to CSS-pixel ratio. Defaults to
    window.devicePixelRatio.

- dir (a value equal to: 'ltr', 'rtl', 'auto'; optional):
    Text direction applied to the root element.

- documentData (dict; optional):
    Loaded document metadata. Read-only.

    `documentData` is a dict with keys:

    - numPages (number; required):
        Number of pages in the loaded document.

    - fingerprints (list of strings; required):
        PDF fingerprints when available.

- error (a list of or a singular dash component, string or number; optional):
    Content displayed when the React-PDF component fails.

- errorData (dict; optional):
    Latest document, page, or layer error. Read-only.

    `errorData` is a dict with keys:

    - stage (string; required):
        Operation that failed.

    - name (string; required):
        JavaScript error name.

    - message (string; required):
        Human-readable error message.

- externalLinkRel (string; optional):
    Link rel used by external links in annotations. Defaults to
    noopener noreferrer nofollow.

- externalLinkTarget (a value equal to: '_self', '_blank', '_parent', '_top'; optional):
    Link target used by external links in annotations.

- file (dict; optional):
    PDF source: URL, base64 data URI, or an object containing url or
    byte-array data. None clears the viewer.

    `file` is a string | dict with keys:

    - url (string; required):
        PDF URL.

- height (number; optional):
    Page height. Ignored when width is provided.

- hidden (boolean; optional):
    Whether the root element is hidden.

- imageResourcesPath (string; optional):
    Path prefixed to annotation image URLs. Defaults to the package
    annotation image directory.

- itemClickData (dict; optional):
    Latest internal-link navigation event. Read-only.

    `itemClickData` is a dict with keys:

    - pageIndex (number; required):
        Zero-based destination page index.

    - pageNumber (number; required):
        One-based destination page number.

    - timestamp (number; required):
        Event timestamp in milliseconds. Allows repeated clicks on the
        same item to trigger Dash callbacks.

- key (string | number; optional):
    A unique identifier for the component, used to improve performance
    by React.js while rendering components. See
    https://reactjs.org/docs/lists-and-keys.html for more info.

- lang (string; optional):
    Language applied to the root element.

- loadProgress (dict; optional):
    Latest document loading progress. Read-only.

    `loadProgress` is a dict with keys:

    - loaded (number; required):
        Number of bytes loaded.

    - total (number; required):
        Total number of bytes, when known.

- loading (a list of or a singular dash component, string or number; optional):
    Content displayed while React-PDF is loading. Defaults to the
    current Dash loading state when omitted.

- loading_state (dict; optional):
    Object that holds the loading state object coming from
    dash-renderer.

    `loading_state` is a dict with keys:

    - is_loading (boolean; required):
        Determines if the component is loading or not.

    - prop_name (string; required):
        Holds which property is loading.

    - component_name (string; required):
        Holds the name of the component that is loading.

- noData (a list of or a singular dash component, string or number; optional):
    Content displayed when no document or page is provided.

- numPages (number; optional):
    Number of pages in the loaded document. Read-only.

- options (dict; optional):
    JSON-safe React-PDF Document options. Package-local PDF.js assets
    are supplied by default.

    `options` is a dict with strings as keys and values of type dict
    with keys:


- pageColors (dict; optional):
    Colors used to render the page.

    `pageColors` is a dict with keys:

    - background (string; required):
        Page background color.

    - foreground (string; required):
        Page foreground color.

- pageData (dict; optional):
    Latest loaded page dimensions. Read-only.

    `pageData` is a dict with keys:

    - pageNumber (number; required):
        One-based page number.

    - width (number; required):
        Rendered page width.

    - height (number; required):
        Rendered page height.

    - originalWidth (number; required):
        Unscaled page width.

    - originalHeight (number; required):
        Unscaled page height.

- pageNumber (number; optional):
    One-based current page number. Defaults to 1 and updates when an
    internal PDF link is followed.

- password (string; optional):
    Password submitted after React-PDF requests one. It is not copied
    into callback output properties.

- passwordData (dict; optional):
    Latest password challenge. Read-only.

    `passwordData` is a dict with keys:

    - reason (a value equal to: 'need-password', 'incorrect-password'; required):
        Password challenge reported by PDF.js.

- renderAnnotationLayer (boolean; optional):
    Whether links and annotations are rendered. Defaults to True.

- renderData (dict; optional):
    Latest rendered page dimensions. Read-only.

    `renderData` is a dict with keys:

    - pageNumber (number; required):
        One-based page number.

    - width (number; required):
        Rendered page width.

    - height (number; required):
        Rendered page height.

    - originalWidth (number; required):
        Unscaled page width.

    - originalHeight (number; required):
        Unscaled page height.

- renderForms (boolean; optional):
    Whether interactive PDF forms are rendered. renderAnnotationLayer
    must also be True. Defaults to False.

- renderMode (a value equal to: 'canvas', 'none'; optional):
    Rendering mode. Custom render functions are not JSON-safe, so Dash
    supports canvas and none. Defaults to canvas.

- renderTextLayer (boolean; optional):
    Whether selectable and searchable text is rendered. Defaults to
    True.

- role (string; optional):
    ARIA role applied to the root element.

- rotate (number; optional):
    Page rotation in degrees. Defaults to 0.

- scale (number; optional):
    Page scale. Defaults to 1.

- sourceLoaded (boolean; optional):
    Whether React-PDF retrieved the current source. Read-only.

- tabIndex (number; optional):
    Tab index.

- textData (dict; optional):
    Latest text-layer result. Read-only.

    `textData` is a dict with keys:

    - layer (a value equal to: 'annotations', 'text'; required):
        Layer that finished loading or rendering.

    - count (number; optional):
        Number of loaded items when available.

- width (number; optional):
    Page width.

- workerSrc (string; optional):
    PDF.js module Worker URL. Defaults to the Worker installed with
    this package."""
    _children_props: typing.List[str] = ['loading', 'error', 'noData']
    _base_nodes = ['loading', 'error', 'noData', 'children']
    _namespace = 'dash_pdf_components'
    _type = 'PDF'
    PageColors = TypedDict(
        "PageColors",
            {
            "background": str,
            "foreground": str
        }
    )

    Options = TypedDict(
        "Options",
            {

        }
    )

    DocumentData = TypedDict(
        "DocumentData",
            {
            "numPages": NumberType,
            "fingerprints": typing.Sequence[str]
        }
    )

    LoadProgress = TypedDict(
        "LoadProgress",
            {
            "loaded": NumberType,
            "total": NumberType
        }
    )

    ErrorData = TypedDict(
        "ErrorData",
            {
            "stage": str,
            "name": str,
            "message": str
        }
    )

    PasswordData = TypedDict(
        "PasswordData",
            {
            "reason": Literal["need-password", "incorrect-password"]
        }
    )

    ItemClickData = TypedDict(
        "ItemClickData",
            {
            "pageIndex": NumberType,
            "pageNumber": NumberType,
            "timestamp": NumberType
        }
    )

    PageData = TypedDict(
        "PageData",
            {
            "pageNumber": NumberType,
            "width": NumberType,
            "height": NumberType,
            "originalWidth": NumberType,
            "originalHeight": NumberType
        }
    )

    RenderData = TypedDict(
        "RenderData",
            {
            "pageNumber": NumberType,
            "width": NumberType,
            "height": NumberType,
            "originalWidth": NumberType,
            "originalHeight": NumberType
        }
    )

    AnnotationsData = TypedDict(
        "AnnotationsData",
            {
            "layer": Literal["annotations", "text"],
            "count": NotRequired[NumberType]
        }
    )

    TextData = TypedDict(
        "TextData",
            {
            "layer": Literal["annotations", "text"],
            "count": NotRequired[NumberType]
        }
    )

    LoadingState = TypedDict(
        "LoadingState",
            {
            "is_loading": bool,
            "prop_name": str,
            "component_name": str
        }
    )


    def __init__(
        self,
        children: typing.Optional[ComponentType] = None,
        file: typing.Optional[typing.Union[str, PDFUrlType, PDFDataType]] = None,
        pageNumber: typing.Optional[NumberType] = None,
        width: typing.Optional[NumberType] = None,
        height: typing.Optional[NumberType] = None,
        scale: typing.Optional[NumberType] = None,
        rotate: typing.Optional[NumberType] = None,
        renderTextLayer: typing.Optional[bool] = None,
        renderAnnotationLayer: typing.Optional[bool] = None,
        renderForms: typing.Optional[bool] = None,
        renderMode: typing.Optional[Literal["canvas", "none"]] = None,
        canvasBackground: typing.Optional[str] = None,
        devicePixelRatio: typing.Optional[NumberType] = None,
        pageColors: typing.Optional["PageColors"] = None,
        options: typing.Optional[typing.Dict[typing.Union[str, float, int], "Options"]] = None,
        assetBaseUrl: typing.Optional[str] = None,
        workerSrc: typing.Optional[str] = None,
        imageResourcesPath: typing.Optional[str] = None,
        externalLinkRel: typing.Optional[str] = None,
        externalLinkTarget: typing.Optional[Literal["_self", "_blank", "_parent", "_top"]] = None,
        password: typing.Optional[str] = None,
        numPages: typing.Optional[NumberType] = None,
        documentData: typing.Optional["DocumentData"] = None,
        loadProgress: typing.Optional["LoadProgress"] = None,
        sourceLoaded: typing.Optional[bool] = None,
        errorData: typing.Optional["ErrorData"] = None,
        passwordData: typing.Optional["PasswordData"] = None,
        itemClickData: typing.Optional["ItemClickData"] = None,
        pageData: typing.Optional["PageData"] = None,
        renderData: typing.Optional["RenderData"] = None,
        annotationsData: typing.Optional["AnnotationsData"] = None,
        textData: typing.Optional["TextData"] = None,
        loading: typing.Optional[ComponentType] = None,
        error: typing.Optional[ComponentType] = None,
        noData: typing.Optional[ComponentType] = None,
        id: typing.Optional[typing.Union[str, dict]] = None,
        key: typing.Optional[typing.Union[str, NumberType]] = None,
        style: typing.Optional[typing.Any] = None,
        className: typing.Optional[str] = None,
        tabIndex: typing.Optional[NumberType] = None,
        role: typing.Optional[str] = None,
        dir: typing.Optional[Literal["ltr", "rtl", "auto"]] = None,
        lang: typing.Optional[str] = None,
        hidden: typing.Optional[bool] = None,
        loading_state: typing.Optional["LoadingState"] = None,
        **kwargs
    ):
        self._prop_names = ['children', 'id', 'annotationsData', 'aria-*', 'assetBaseUrl', 'canvasBackground', 'className', 'data-*', 'devicePixelRatio', 'dir', 'documentData', 'error', 'errorData', 'externalLinkRel', 'externalLinkTarget', 'file', 'height', 'hidden', 'imageResourcesPath', 'itemClickData', 'key', 'lang', 'loadProgress', 'loading', 'loading_state', 'noData', 'numPages', 'options', 'pageColors', 'pageData', 'pageNumber', 'password', 'passwordData', 'renderAnnotationLayer', 'renderData', 'renderForms', 'renderMode', 'renderTextLayer', 'role', 'rotate', 'scale', 'sourceLoaded', 'style', 'tabIndex', 'textData', 'width', 'workerSrc']
        self._valid_wildcard_attributes =            ['data-', 'aria-']
        self.available_properties = ['children', 'id', 'annotationsData', 'aria-*', 'assetBaseUrl', 'canvasBackground', 'className', 'data-*', 'devicePixelRatio', 'dir', 'documentData', 'error', 'errorData', 'externalLinkRel', 'externalLinkTarget', 'file', 'height', 'hidden', 'imageResourcesPath', 'itemClickData', 'key', 'lang', 'loadProgress', 'loading', 'loading_state', 'noData', 'numPages', 'options', 'pageColors', 'pageData', 'pageNumber', 'password', 'passwordData', 'renderAnnotationLayer', 'renderData', 'renderForms', 'renderMode', 'renderTextLayer', 'role', 'rotate', 'scale', 'sourceLoaded', 'style', 'tabIndex', 'textData', 'width', 'workerSrc']
        self.available_wildcard_properties =            ['data-', 'aria-']
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        super(PDF, self).__init__(children=children, **args)

setattr(PDF, "__init__", _explicitize_args(PDF.__init__))
