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

class PDFOutlineItemType(TypedDict):
    title: str
    bold: bool
    italic: bool
    url: NotRequired[typing.Optional[str]]
    items: typing.Sequence["PDFOutlineItemType"]


ComponentSingleType = typing.Union[str, int, float, Component, None]
ComponentType = typing.Union[
    ComponentSingleType,
    typing.Sequence[ComponentSingleType],
]


class Outline(Component):
    """An Outline component.
Renders a PDF table of contents. Place it inside Document.

Keyword arguments:

- id (string; optional):
    Unique ID to identify this component in Dash callbacks.

- aria-* (string; optional):
    Wild card aria attributes.

- className (string; optional):
    className of the component.

- data-* (string; optional):
    Wild card data attributes.

- dir (a value equal to: 'ltr', 'rtl', 'auto'; optional):
    Text direction applied to the root element.

- errorData (dict; optional):
    Latest outline loading error. Read-only.

    `errorData` is a dict with keys:

    - stage (string; required):
        Operation that failed.

    - name (string; required):
        JavaScript error name.

    - message (string; required):
        Human-readable error message.

- hidden (boolean; optional):
    Whether the root element is hidden.

- itemClickData (dict; optional):
    Latest outline item click. Read-only.

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

- outlineData (list of dicts; optional):
    Serialized table of contents. Read-only.

    `outlineData` is a list of dicts with keys:

    - title (string; required):
        Outline title.

    - bold (boolean; required):
        Whether the title uses bold text.

    - italic (boolean; required):
        Whether the title uses italic text.

    - url (string; optional):
        External URL associated with the item, when available.

    - items (list of dicts; required):
        Nested outline items with the same JSON-safe structure.

        `items` is a list of dicts with keys:


- role (string; optional):
    ARIA role applied to the root element.

- tabIndex (number; optional):
    Tab index."""
    _children_props: typing.List[str] = []
    _base_nodes = ['children']
    _namespace = 'dash_pdf_components'
    _type = 'Outline'
    ItemClickData = TypedDict(
        "ItemClickData",
            {
            "pageIndex": NumberType,
            "pageNumber": NumberType,
            "timestamp": NumberType
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
        outlineData: typing.Optional[typing.Sequence[PDFOutlineItemType]] = None,
        itemClickData: typing.Optional["ItemClickData"] = None,
        errorData: typing.Optional["ErrorData"] = None,
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
        self._prop_names = ['id', 'aria-*', 'className', 'data-*', 'dir', 'errorData', 'hidden', 'itemClickData', 'key', 'lang', 'loading_state', 'outlineData', 'role', 'style', 'tabIndex']
        self._valid_wildcard_attributes =            ['data-', 'aria-']
        self.available_properties = ['id', 'aria-*', 'className', 'data-*', 'dir', 'errorData', 'hidden', 'itemClickData', 'key', 'lang', 'loading_state', 'outlineData', 'role', 'style', 'tabIndex']
        self.available_wildcard_properties =            ['data-', 'aria-']
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(Outline, self).__init__(**args)

setattr(Outline, "__init__", _explicitize_args(Outline.__init__))
