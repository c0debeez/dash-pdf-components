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

ComponentSingleType = typing.Union[str, int, float, Component, None]
ComponentType = typing.Union[
    ComponentSingleType,
    typing.Sequence[ComponentSingleType],
]


class Thumbnail(Component):
    """A Thumbnail component.
Renders a PDF page thumbnail without text or annotation layers. Place it inside Document.

Keyword arguments:

- id (string; optional):
    Unique ID to identify this component in Dash callbacks.

- aria-* (string; optional):
    Wild card aria attributes.

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

- error (a list of or a singular dash component, string or number; optional):
    Content displayed when the React-PDF component fails.

- errorData (dict; optional):
    Latest thumbnail error. Read-only.

    `errorData` is a dict with keys:

    - stage (string; required):
        Operation that failed.

    - name (string; required):
        JavaScript error name.

    - message (string; required):
        Human-readable error message.

- height (number; optional):
    Thumbnail height. Ignored when width is provided.

- hidden (boolean; optional):
    Whether the root element is hidden.

- itemClickData (dict; optional):
    Latest thumbnail click. Read-only.

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
    Latest loaded page dimensions. Read-only.

    `loadData` is a dict with keys:

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

- pageColors (dict; optional):
    Colors used to render the thumbnail.

    `pageColors` is a dict with keys:

    - background (string; required):
        Page background color.

    - foreground (string; required):
        Page foreground color.

- pageIndex (number; optional):
    Zero-based page index. Ignored when pageNumber is provided.
    Defaults to 0.

- pageNumber (number; optional):
    One-based page number. Defaults to 1.

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

- renderMode (a value equal to: 'canvas', 'none'; optional):
    Thumbnail rendering mode. Custom render functions are not
    JSON-safe, so Dash supports canvas and none. Defaults to canvas.

- role (string; optional):
    ARIA role applied to the root element.

- rotate (number; optional):
    Thumbnail rotation in degrees. Defaults to 0.

- scale (number; optional):
    Thumbnail scale. Defaults to 1.

- tabIndex (number; optional):
    Tab index.

- width (number; optional):
    Thumbnail width."""
    _children_props: typing.List[str] = ['loading', 'error', 'noData']
    _base_nodes = ['loading', 'error', 'noData', 'children']
    _namespace = 'dash_pdf_components'
    _type = 'Thumbnail'
    PageColors = TypedDict(
        "PageColors",
            {
            "background": str,
            "foreground": str
        }
    )

    LoadData = TypedDict(
        "LoadData",
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

    ErrorData = TypedDict(
        "ErrorData",
            {
            "stage": str,
            "name": str,
            "message": str
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
        canvasBackground: typing.Optional[str] = None,
        devicePixelRatio: typing.Optional[NumberType] = None,
        height: typing.Optional[NumberType] = None,
        pageColors: typing.Optional["PageColors"] = None,
        pageIndex: typing.Optional[NumberType] = None,
        pageNumber: typing.Optional[NumberType] = None,
        renderMode: typing.Optional[Literal["canvas", "none"]] = None,
        rotate: typing.Optional[NumberType] = None,
        scale: typing.Optional[NumberType] = None,
        width: typing.Optional[NumberType] = None,
        loadData: typing.Optional["LoadData"] = None,
        renderData: typing.Optional["RenderData"] = None,
        errorData: typing.Optional["ErrorData"] = None,
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
        self._prop_names = ['id', 'aria-*', 'canvasBackground', 'className', 'data-*', 'devicePixelRatio', 'dir', 'error', 'errorData', 'height', 'hidden', 'itemClickData', 'key', 'lang', 'loadData', 'loading', 'loading_state', 'noData', 'pageColors', 'pageIndex', 'pageNumber', 'renderData', 'renderMode', 'role', 'rotate', 'scale', 'style', 'tabIndex', 'width']
        self._valid_wildcard_attributes =            ['data-', 'aria-']
        self.available_properties = ['id', 'aria-*', 'canvasBackground', 'className', 'data-*', 'devicePixelRatio', 'dir', 'error', 'errorData', 'height', 'hidden', 'itemClickData', 'key', 'lang', 'loadData', 'loading', 'loading_state', 'noData', 'pageColors', 'pageIndex', 'pageNumber', 'renderData', 'renderMode', 'role', 'rotate', 'scale', 'style', 'tabIndex', 'width']
        self.available_wildcard_properties =            ['data-', 'aria-']
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(Thumbnail, self).__init__(**args)

setattr(Thumbnail, "__init__", _explicitize_args(Thumbnail.__init__))
