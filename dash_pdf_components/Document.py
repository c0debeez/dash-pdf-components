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


class Document(Component):
    """A Document component.
Loads a PDF and provides React-PDF document context to Page, Thumbnail, and Outline children.

Keyword arguments:

- children (a list of or a singular dash component, string or number; optional):
    Page, Thumbnail, or Outline components rendered inside the
    document context.

- id (string; optional):
    Unique ID to identify this component in Dash callbacks.

- aria-* (string; optional):
    Wild card aria attributes.

- assetBaseUrl (string; optional):
    Base URL containing the pdfjs-dist package directories. Defaults
    to assets installed with this package. Set this to a
    version-matched CDN root to replace all auxiliary assets.

- className (string; optional):
    className of the component.

- data-* (string; optional):
    Wild card data attributes.

- dir (a value equal to: 'ltr', 'rtl', 'auto'; optional):
    Text direction applied to the root element.

- error (a list of or a singular dash component, string or number; optional):
    Content displayed when the React-PDF component fails.

- errorData (dict; optional):
    Latest document or source error. Read-only.

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
    byte-array data. None clears the document. Cross-origin URLs
    require CORS.

    `file` is a string | dict with keys:

    - data (list of numbers; required):
        PDF bytes as a JSON array of integers from 0 to 255.

- hidden (boolean; optional):
    Whether the root element is hidden.

- imageResourcesPath (string; optional):
    Path prefixed to annotation image URLs. Defaults to the package
    annotation image directory.

- itemClickData (dict; optional):
    Latest internal-link, Outline, or Thumbnail navigation event.
    Navigation is handled automatically; use this read-only value to
    observe it.

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

- loadData (dict; optional):
    Loaded document metadata. Read-only.

    `loadData` is a dict with keys:

    - numPages (number; required):
        Number of pages in the loaded document.

    - fingerprints (list of strings; required):
        PDF fingerprints when available.

- loadProgress (dict; optional):
    Latest loading progress. Read-only.

    `loadProgress` is a dict with keys:

    - loaded (number; required):
        Number of bytes loaded.

    - total (number; required):
        Total number of bytes, when known.

- loading (a list of or a singular dash component, string or number; optional):
    Content displayed while the React-PDF component is loading.

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
    JSON-safe React-PDF Document options. Package-local CMaps,
    standard fonts, WASM, ICC profiles, and annotation images are
    supplied by default.

    `options` is a dict with keys:

    - cMapUrl (string; optional):
        URL of the predefined Adobe CMaps directory.

    - cMapPacked (boolean; optional):
        Whether CMaps are binary packed. Defaults to True when package
        assets are used.

    - standardFontDataUrl (string; optional):
        URL of the standard PDF fonts directory.

    - wasmUrl (string; optional):
        URL of the WebAssembly support files directory.

    - iccUrl (string; optional):
        URL of the ICC color profiles directory.

    - httpHeaders (dict; optional):
        HTTP headers sent while loading the document.

        `httpHeaders` is a dict with keys:


    - withCredentials (boolean; optional):
        Whether cross-origin requests include credentials. Defaults to
        False.

    - password (string; optional):
        Password used to open an encrypted PDF.

    - isEvalSupported (boolean; optional):
        Disable evaluation of embedded JavaScript expressions.
        Defaults to False in this package.

- password (string; optional):
    Password submitted after React-PDF requests one. It is not copied
    into callback output properties.

- passwordData (dict; optional):
    Latest password challenge. Read-only.

    `passwordData` is a dict with keys:

    - reason (a value equal to: 'need-password', 'incorrect-password'; required):
        Password challenge reported by PDF.js.

- renderMode (a value equal to: 'canvas', 'none'; optional):
    Document rendering mode. Custom render functions are not
    JSON-safe, so Dash supports canvas and none. Defaults to canvas.

- role (string; optional):
    ARIA role applied to the root element.

- rotate (number; optional):
    Global document rotation in degrees.

- scale (number; optional):
    Global document scale. Defaults to 1.

- sourceLoaded (boolean; optional):
    Whether React-PDF retrieved the current source. Read-only.

- tabIndex (number; optional):
    Tab index.

- workerSrc (string; optional):
    PDF.js module Worker URL. Defaults to the Worker installed with
    this package."""
    _children_props: typing.List[str] = ['loading', 'error', 'noData']
    _base_nodes = ['loading', 'error', 'noData', 'children']
    _namespace = 'dash_pdf_components'
    _type = 'Document'
    OptionsHttpHeaders = TypedDict(
        "OptionsHttpHeaders",
            {

        }
    )

    Options = TypedDict(
        "Options",
            {
            "cMapUrl": NotRequired[str],
            "cMapPacked": NotRequired[bool],
            "standardFontDataUrl": NotRequired[str],
            "wasmUrl": NotRequired[str],
            "iccUrl": NotRequired[str],
            "httpHeaders": NotRequired["OptionsHttpHeaders"],
            "withCredentials": NotRequired[bool],
            "password": NotRequired[str],
            "isEvalSupported": NotRequired[bool]
        }
    )

    LoadData = TypedDict(
        "LoadData",
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
        options: typing.Optional["Options"] = None,
        assetBaseUrl: typing.Optional[str] = None,
        workerSrc: typing.Optional[str] = None,
        imageResourcesPath: typing.Optional[str] = None,
        externalLinkRel: typing.Optional[str] = None,
        externalLinkTarget: typing.Optional[Literal["_self", "_blank", "_parent", "_top"]] = None,
        renderMode: typing.Optional[Literal["canvas", "none"]] = None,
        rotate: typing.Optional[NumberType] = None,
        scale: typing.Optional[NumberType] = None,
        password: typing.Optional[str] = None,
        numPages: typing.Optional[NumberType] = None,
        loadData: typing.Optional["LoadData"] = None,
        loadProgress: typing.Optional["LoadProgress"] = None,
        sourceLoaded: typing.Optional[bool] = None,
        errorData: typing.Optional["ErrorData"] = None,
        passwordData: typing.Optional["PasswordData"] = None,
        itemClickData: typing.Optional["ItemClickData"] = None,
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
        self._prop_names = ['children', 'id', 'aria-*', 'assetBaseUrl', 'className', 'data-*', 'dir', 'error', 'errorData', 'externalLinkRel', 'externalLinkTarget', 'file', 'hidden', 'imageResourcesPath', 'itemClickData', 'key', 'lang', 'loadData', 'loadProgress', 'loading', 'loading_state', 'noData', 'numPages', 'options', 'password', 'passwordData', 'renderMode', 'role', 'rotate', 'scale', 'sourceLoaded', 'style', 'tabIndex', 'workerSrc']
        self._valid_wildcard_attributes =            ['data-', 'aria-']
        self.available_properties = ['children', 'id', 'aria-*', 'assetBaseUrl', 'className', 'data-*', 'dir', 'error', 'errorData', 'externalLinkRel', 'externalLinkTarget', 'file', 'hidden', 'imageResourcesPath', 'itemClickData', 'key', 'lang', 'loadData', 'loadProgress', 'loading', 'loading_state', 'noData', 'numPages', 'options', 'password', 'passwordData', 'renderMode', 'role', 'rotate', 'scale', 'sourceLoaded', 'style', 'tabIndex', 'workerSrc']
        self.available_wildcard_properties =            ['data-', 'aria-']
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        super(Document, self).__init__(children=children, **args)

setattr(Document, "__init__", _explicitize_args(Document.__init__))
