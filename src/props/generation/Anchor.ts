// Synced by scripts/sync_api.cjs.
import { FunctionProps } from "./shared/dash";
export interface AnchorProps {
  /** HTML anchor onClick event, using a named JS function reference. */
  onClick?: FunctionProps;
  /** HTML anchor hidden. */
  hidden?: boolean;
  /** HTML anchor download. */
  download?: string | boolean;
  /** HTML anchor hrefLang. */
  hrefLang?: string;
  /** HTML anchor media. */
  media?: string;
  /** HTML anchor ping. */
  ping?: string;
  /** HTML anchor target. */
  target?: "_self" | "_blank" | "_parent" | "_top" | string;
  /** HTML anchor type. */
  type?: string;
  /** HTML anchor referrerPolicy. */
  referrerPolicy?:
    | ""
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";
  /** HTML anchor defaultChecked. */
  defaultChecked?: boolean;
  /** HTML anchor defaultValue. */
  defaultValue?: string | number | string[];
  /** HTML anchor suppressContentEditableWarning. */
  suppressContentEditableWarning?: boolean;
  /** HTML anchor suppressHydrationWarning. */
  suppressHydrationWarning?: boolean;
  /** HTML anchor accessKey. */
  accessKey?: string;
  /** HTML anchor autoCapitalize. */
  autoCapitalize?:
    string | "off" | "none" | "on" | "sentences" | "words" | "characters";
  /** HTML anchor autoFocus. */
  autoFocus?: boolean;
  /** HTML anchor contentEditable. */
  contentEditable?: boolean | "true" | "false" | "inherit" | "plaintext-only";
  /** HTML anchor contextMenu. */
  contextMenu?: string;
  /** HTML anchor dir. */
  dir?: string;
  /** HTML anchor draggable. */
  draggable?: boolean | "true" | "false";
  /** HTML anchor enterKeyHint. */
  enterKeyHint?:
    "enter" | "done" | "go" | "next" | "previous" | "search" | "send";
  /** HTML anchor lang. */
  lang?: string;
  /** HTML anchor nonce. */
  nonce?: string;
  /** HTML anchor slot. */
  slot?: string;
  /** HTML anchor spellCheck. */
  spellCheck?: boolean | "true" | "false";
  /** HTML anchor tabIndex. */
  tabIndex?: number;
  /** HTML anchor title. */
  title?: string;
  /** HTML anchor translate. */
  translate?: "yes" | "no";
  /** HTML anchor radioGroup. */
  radioGroup?: string;
  /** HTML anchor role. */
  role?:
    | string
    | "none"
    | "search"
    | "alert"
    | "alertdialog"
    | "application"
    | "article"
    | "banner"
    | "button"
    | "cell"
    | "checkbox"
    | "columnheader"
    | "combobox"
    | "complementary"
    | "contentinfo"
    | "definition"
    | "dialog"
    | "directory"
    | "document"
    | "feed"
    | "figure"
    | "form"
    | "grid"
    | "gridcell"
    | "group"
    | "heading"
    | "img"
    | "link"
    | "list"
    | "listbox"
    | "listitem"
    | "log"
    | "main"
    | "marquee"
    | "math"
    | "menu"
    | "menubar"
    | "menuitem"
    | "menuitemcheckbox"
    | "menuitemradio"
    | "navigation"
    | "note"
    | "option"
    | "presentation"
    | "progressbar"
    | "radio"
    | "radiogroup"
    | "region"
    | "row"
    | "rowgroup"
    | "rowheader"
    | "scrollbar"
    | "searchbox"
    | "separator"
    | "slider"
    | "spinbutton"
    | "status"
    | "switch"
    | "tab"
    | "table"
    | "tablist"
    | "tabpanel"
    | "term"
    | "textbox"
    | "timer"
    | "toolbar"
    | "tooltip"
    | "tree"
    | "treegrid"
    | "treeitem";
  /** HTML anchor about. */
  about?: string;
  /** HTML anchor content. */
  content?: string;
  /** HTML anchor datatype. */
  datatype?: string;
  /** HTML anchor inlist. */
  inlist?: any;
  /** HTML anchor prefix. */
  prefix?: string;
  /** HTML anchor property. */
  property?: string;
  /** HTML anchor rel. */
  rel?: string;
  /** HTML anchor resource. */
  resource?: string;
  /** HTML anchor rev. */
  rev?: string;
  /** HTML anchor typeof. */
  typeof?: string;
  /** HTML anchor vocab. */
  vocab?: string;
  /** HTML anchor autoCorrect. */
  autoCorrect?: string;
  /** HTML anchor autoSave. */
  autoSave?: string;
  /** HTML anchor color. */
  color?: string;
  /** HTML anchor itemProp. */
  itemProp?: string;
  /** HTML anchor itemScope. */
  itemScope?: boolean;
  /** HTML anchor itemType. */
  itemType?: string;
  /** HTML anchor itemID. */
  itemID?: string;
  /** HTML anchor itemRef. */
  itemRef?: string;
  /** HTML anchor results. */
  results?: number;
  /** HTML anchor security. */
  security?: string;
  /** HTML anchor unselectable. */
  unselectable?: "off" | "on";
  /** HTML anchor popover. */
  popover?: "" | "auto" | "manual" | "hint";
  /** HTML anchor popoverTargetAction. */
  popoverTargetAction?: "toggle" | "show" | "hide";
  /** HTML anchor popoverTarget. */
  popoverTarget?: string;
  /** HTML anchor inert. */
  inert?: boolean;
  /** HTML anchor inputMode. */
  inputMode?:
    | "none"
    | "search"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal";
  /** HTML anchor is. */
  is?: string;
  /** HTML anchor exportparts. */
  exportparts?: string;
  /** HTML anchor part. */
  part?: string;
  /** HTML anchor onCopy event, using a named JS function reference. */
  onCopy?: FunctionProps;
  /** HTML anchor onCopyCapture event, using a named JS function reference. */
  onCopyCapture?: FunctionProps;
  /** HTML anchor onCut event, using a named JS function reference. */
  onCut?: FunctionProps;
  /** HTML anchor onCutCapture event, using a named JS function reference. */
  onCutCapture?: FunctionProps;
  /** HTML anchor onPaste event, using a named JS function reference. */
  onPaste?: FunctionProps;
  /** HTML anchor onPasteCapture event, using a named JS function reference. */
  onPasteCapture?: FunctionProps;
  /** HTML anchor onCompositionEnd event, using a named JS function reference. */
  onCompositionEnd?: FunctionProps;
  /** HTML anchor onCompositionEndCapture event, using a named JS function reference. */
  onCompositionEndCapture?: FunctionProps;
  /** HTML anchor onCompositionStart event, using a named JS function reference. */
  onCompositionStart?: FunctionProps;
  /** HTML anchor onCompositionStartCapture event, using a named JS function reference. */
  onCompositionStartCapture?: FunctionProps;
  /** HTML anchor onCompositionUpdate event, using a named JS function reference. */
  onCompositionUpdate?: FunctionProps;
  /** HTML anchor onCompositionUpdateCapture event, using a named JS function reference. */
  onCompositionUpdateCapture?: FunctionProps;
  /** HTML anchor onFocus event, using a named JS function reference. */
  onFocus?: FunctionProps;
  /** HTML anchor onFocusCapture event, using a named JS function reference. */
  onFocusCapture?: FunctionProps;
  /** HTML anchor onBlur event, using a named JS function reference. */
  onBlur?: FunctionProps;
  /** HTML anchor onBlurCapture event, using a named JS function reference. */
  onBlurCapture?: FunctionProps;
  /** HTML anchor onChange event, using a named JS function reference. */
  onChange?: FunctionProps;
  /** HTML anchor onChangeCapture event, using a named JS function reference. */
  onChangeCapture?: FunctionProps;
  /** HTML anchor onBeforeInput event, using a named JS function reference. */
  onBeforeInput?: FunctionProps;
  /** HTML anchor onBeforeInputCapture event, using a named JS function reference. */
  onBeforeInputCapture?: FunctionProps;
  /** HTML anchor onInput event, using a named JS function reference. */
  onInput?: FunctionProps;
  /** HTML anchor onInputCapture event, using a named JS function reference. */
  onInputCapture?: FunctionProps;
  /** HTML anchor onReset event, using a named JS function reference. */
  onReset?: FunctionProps;
  /** HTML anchor onResetCapture event, using a named JS function reference. */
  onResetCapture?: FunctionProps;
  /** HTML anchor onSubmit event, using a named JS function reference. */
  onSubmit?: FunctionProps;
  /** HTML anchor onSubmitCapture event, using a named JS function reference. */
  onSubmitCapture?: FunctionProps;
  /** HTML anchor onInvalid event, using a named JS function reference. */
  onInvalid?: FunctionProps;
  /** HTML anchor onInvalidCapture event, using a named JS function reference. */
  onInvalidCapture?: FunctionProps;
  /** HTML anchor onLoad event, using a named JS function reference. */
  onLoad?: FunctionProps;
  /** HTML anchor onLoadCapture event, using a named JS function reference. */
  onLoadCapture?: FunctionProps;
  /** HTML anchor onError event, using a named JS function reference. */
  onError?: FunctionProps;
  /** HTML anchor onErrorCapture event, using a named JS function reference. */
  onErrorCapture?: FunctionProps;
  /** HTML anchor onKeyDown event, using a named JS function reference. */
  onKeyDown?: FunctionProps;
  /** HTML anchor onKeyDownCapture event, using a named JS function reference. */
  onKeyDownCapture?: FunctionProps;
  /** HTML anchor onKeyPress event, using a named JS function reference. */
  onKeyPress?: FunctionProps;
  /** HTML anchor onKeyPressCapture event, using a named JS function reference. */
  onKeyPressCapture?: FunctionProps;
  /** HTML anchor onKeyUp event, using a named JS function reference. */
  onKeyUp?: FunctionProps;
  /** HTML anchor onKeyUpCapture event, using a named JS function reference. */
  onKeyUpCapture?: FunctionProps;
  /** HTML anchor onAbort event, using a named JS function reference. */
  onAbort?: FunctionProps;
  /** HTML anchor onAbortCapture event, using a named JS function reference. */
  onAbortCapture?: FunctionProps;
  /** HTML anchor onCanPlay event, using a named JS function reference. */
  onCanPlay?: FunctionProps;
  /** HTML anchor onCanPlayCapture event, using a named JS function reference. */
  onCanPlayCapture?: FunctionProps;
  /** HTML anchor onCanPlayThrough event, using a named JS function reference. */
  onCanPlayThrough?: FunctionProps;
  /** HTML anchor onCanPlayThroughCapture event, using a named JS function reference. */
  onCanPlayThroughCapture?: FunctionProps;
  /** HTML anchor onDurationChange event, using a named JS function reference. */
  onDurationChange?: FunctionProps;
  /** HTML anchor onDurationChangeCapture event, using a named JS function reference. */
  onDurationChangeCapture?: FunctionProps;
  /** HTML anchor onEmptied event, using a named JS function reference. */
  onEmptied?: FunctionProps;
  /** HTML anchor onEmptiedCapture event, using a named JS function reference. */
  onEmptiedCapture?: FunctionProps;
  /** HTML anchor onEncrypted event, using a named JS function reference. */
  onEncrypted?: FunctionProps;
  /** HTML anchor onEncryptedCapture event, using a named JS function reference. */
  onEncryptedCapture?: FunctionProps;
  /** HTML anchor onEnded event, using a named JS function reference. */
  onEnded?: FunctionProps;
  /** HTML anchor onEndedCapture event, using a named JS function reference. */
  onEndedCapture?: FunctionProps;
  /** HTML anchor onLoadedData event, using a named JS function reference. */
  onLoadedData?: FunctionProps;
  /** HTML anchor onLoadedDataCapture event, using a named JS function reference. */
  onLoadedDataCapture?: FunctionProps;
  /** HTML anchor onLoadedMetadata event, using a named JS function reference. */
  onLoadedMetadata?: FunctionProps;
  /** HTML anchor onLoadedMetadataCapture event, using a named JS function reference. */
  onLoadedMetadataCapture?: FunctionProps;
  /** HTML anchor onLoadStart event, using a named JS function reference. */
  onLoadStart?: FunctionProps;
  /** HTML anchor onLoadStartCapture event, using a named JS function reference. */
  onLoadStartCapture?: FunctionProps;
  /** HTML anchor onPause event, using a named JS function reference. */
  onPause?: FunctionProps;
  /** HTML anchor onPauseCapture event, using a named JS function reference. */
  onPauseCapture?: FunctionProps;
  /** HTML anchor onPlay event, using a named JS function reference. */
  onPlay?: FunctionProps;
  /** HTML anchor onPlayCapture event, using a named JS function reference. */
  onPlayCapture?: FunctionProps;
  /** HTML anchor onPlaying event, using a named JS function reference. */
  onPlaying?: FunctionProps;
  /** HTML anchor onPlayingCapture event, using a named JS function reference. */
  onPlayingCapture?: FunctionProps;
  /** HTML anchor onProgress event, using a named JS function reference. */
  onProgress?: FunctionProps;
  /** HTML anchor onProgressCapture event, using a named JS function reference. */
  onProgressCapture?: FunctionProps;
  /** HTML anchor onRateChange event, using a named JS function reference. */
  onRateChange?: FunctionProps;
  /** HTML anchor onRateChangeCapture event, using a named JS function reference. */
  onRateChangeCapture?: FunctionProps;
  /** HTML anchor onSeeked event, using a named JS function reference. */
  onSeeked?: FunctionProps;
  /** HTML anchor onSeekedCapture event, using a named JS function reference. */
  onSeekedCapture?: FunctionProps;
  /** HTML anchor onSeeking event, using a named JS function reference. */
  onSeeking?: FunctionProps;
  /** HTML anchor onSeekingCapture event, using a named JS function reference. */
  onSeekingCapture?: FunctionProps;
  /** HTML anchor onStalled event, using a named JS function reference. */
  onStalled?: FunctionProps;
  /** HTML anchor onStalledCapture event, using a named JS function reference. */
  onStalledCapture?: FunctionProps;
  /** HTML anchor onSuspend event, using a named JS function reference. */
  onSuspend?: FunctionProps;
  /** HTML anchor onSuspendCapture event, using a named JS function reference. */
  onSuspendCapture?: FunctionProps;
  /** HTML anchor onTimeUpdate event, using a named JS function reference. */
  onTimeUpdate?: FunctionProps;
  /** HTML anchor onTimeUpdateCapture event, using a named JS function reference. */
  onTimeUpdateCapture?: FunctionProps;
  /** HTML anchor onVolumeChange event, using a named JS function reference. */
  onVolumeChange?: FunctionProps;
  /** HTML anchor onVolumeChangeCapture event, using a named JS function reference. */
  onVolumeChangeCapture?: FunctionProps;
  /** HTML anchor onWaiting event, using a named JS function reference. */
  onWaiting?: FunctionProps;
  /** HTML anchor onWaitingCapture event, using a named JS function reference. */
  onWaitingCapture?: FunctionProps;
  /** HTML anchor onAuxClick event, using a named JS function reference. */
  onAuxClick?: FunctionProps;
  /** HTML anchor onAuxClickCapture event, using a named JS function reference. */
  onAuxClickCapture?: FunctionProps;
  /** HTML anchor onClickCapture event, using a named JS function reference. */
  onClickCapture?: FunctionProps;
  /** HTML anchor onContextMenu event, using a named JS function reference. */
  onContextMenu?: FunctionProps;
  /** HTML anchor onContextMenuCapture event, using a named JS function reference. */
  onContextMenuCapture?: FunctionProps;
  /** HTML anchor onDoubleClick event, using a named JS function reference. */
  onDoubleClick?: FunctionProps;
  /** HTML anchor onDoubleClickCapture event, using a named JS function reference. */
  onDoubleClickCapture?: FunctionProps;
  /** HTML anchor onDrag event, using a named JS function reference. */
  onDrag?: FunctionProps;
  /** HTML anchor onDragCapture event, using a named JS function reference. */
  onDragCapture?: FunctionProps;
  /** HTML anchor onDragEnd event, using a named JS function reference. */
  onDragEnd?: FunctionProps;
  /** HTML anchor onDragEndCapture event, using a named JS function reference. */
  onDragEndCapture?: FunctionProps;
  /** HTML anchor onDragEnter event, using a named JS function reference. */
  onDragEnter?: FunctionProps;
  /** HTML anchor onDragEnterCapture event, using a named JS function reference. */
  onDragEnterCapture?: FunctionProps;
  /** HTML anchor onDragExit event, using a named JS function reference. */
  onDragExit?: FunctionProps;
  /** HTML anchor onDragExitCapture event, using a named JS function reference. */
  onDragExitCapture?: FunctionProps;
  /** HTML anchor onDragLeave event, using a named JS function reference. */
  onDragLeave?: FunctionProps;
  /** HTML anchor onDragLeaveCapture event, using a named JS function reference. */
  onDragLeaveCapture?: FunctionProps;
  /** HTML anchor onDragOver event, using a named JS function reference. */
  onDragOver?: FunctionProps;
  /** HTML anchor onDragOverCapture event, using a named JS function reference. */
  onDragOverCapture?: FunctionProps;
  /** HTML anchor onDragStart event, using a named JS function reference. */
  onDragStart?: FunctionProps;
  /** HTML anchor onDragStartCapture event, using a named JS function reference. */
  onDragStartCapture?: FunctionProps;
  /** HTML anchor onDrop event, using a named JS function reference. */
  onDrop?: FunctionProps;
  /** HTML anchor onDropCapture event, using a named JS function reference. */
  onDropCapture?: FunctionProps;
  /** HTML anchor onMouseDown event, using a named JS function reference. */
  onMouseDown?: FunctionProps;
  /** HTML anchor onMouseDownCapture event, using a named JS function reference. */
  onMouseDownCapture?: FunctionProps;
  /** HTML anchor onMouseEnter event, using a named JS function reference. */
  onMouseEnter?: FunctionProps;
  /** HTML anchor onMouseLeave event, using a named JS function reference. */
  onMouseLeave?: FunctionProps;
  /** HTML anchor onMouseMove event, using a named JS function reference. */
  onMouseMove?: FunctionProps;
  /** HTML anchor onMouseMoveCapture event, using a named JS function reference. */
  onMouseMoveCapture?: FunctionProps;
  /** HTML anchor onMouseOut event, using a named JS function reference. */
  onMouseOut?: FunctionProps;
  /** HTML anchor onMouseOutCapture event, using a named JS function reference. */
  onMouseOutCapture?: FunctionProps;
  /** HTML anchor onMouseOver event, using a named JS function reference. */
  onMouseOver?: FunctionProps;
  /** HTML anchor onMouseOverCapture event, using a named JS function reference. */
  onMouseOverCapture?: FunctionProps;
  /** HTML anchor onMouseUp event, using a named JS function reference. */
  onMouseUp?: FunctionProps;
  /** HTML anchor onMouseUpCapture event, using a named JS function reference. */
  onMouseUpCapture?: FunctionProps;
  /** HTML anchor onSelect event, using a named JS function reference. */
  onSelect?: FunctionProps;
  /** HTML anchor onSelectCapture event, using a named JS function reference. */
  onSelectCapture?: FunctionProps;
  /** HTML anchor onTouchCancel event, using a named JS function reference. */
  onTouchCancel?: FunctionProps;
  /** HTML anchor onTouchCancelCapture event, using a named JS function reference. */
  onTouchCancelCapture?: FunctionProps;
  /** HTML anchor onTouchEnd event, using a named JS function reference. */
  onTouchEnd?: FunctionProps;
  /** HTML anchor onTouchEndCapture event, using a named JS function reference. */
  onTouchEndCapture?: FunctionProps;
  /** HTML anchor onTouchMove event, using a named JS function reference. */
  onTouchMove?: FunctionProps;
  /** HTML anchor onTouchMoveCapture event, using a named JS function reference. */
  onTouchMoveCapture?: FunctionProps;
  /** HTML anchor onTouchStart event, using a named JS function reference. */
  onTouchStart?: FunctionProps;
  /** HTML anchor onTouchStartCapture event, using a named JS function reference. */
  onTouchStartCapture?: FunctionProps;
  /** HTML anchor onPointerDown event, using a named JS function reference. */
  onPointerDown?: FunctionProps;
  /** HTML anchor onPointerDownCapture event, using a named JS function reference. */
  onPointerDownCapture?: FunctionProps;
  /** HTML anchor onPointerMove event, using a named JS function reference. */
  onPointerMove?: FunctionProps;
  /** HTML anchor onPointerMoveCapture event, using a named JS function reference. */
  onPointerMoveCapture?: FunctionProps;
  /** HTML anchor onPointerUp event, using a named JS function reference. */
  onPointerUp?: FunctionProps;
  /** HTML anchor onPointerUpCapture event, using a named JS function reference. */
  onPointerUpCapture?: FunctionProps;
  /** HTML anchor onPointerCancel event, using a named JS function reference. */
  onPointerCancel?: FunctionProps;
  /** HTML anchor onPointerCancelCapture event, using a named JS function reference. */
  onPointerCancelCapture?: FunctionProps;
  /** HTML anchor onPointerEnter event, using a named JS function reference. */
  onPointerEnter?: FunctionProps;
  /** HTML anchor onPointerLeave event, using a named JS function reference. */
  onPointerLeave?: FunctionProps;
  /** HTML anchor onPointerOver event, using a named JS function reference. */
  onPointerOver?: FunctionProps;
  /** HTML anchor onPointerOverCapture event, using a named JS function reference. */
  onPointerOverCapture?: FunctionProps;
  /** HTML anchor onPointerOut event, using a named JS function reference. */
  onPointerOut?: FunctionProps;
  /** HTML anchor onPointerOutCapture event, using a named JS function reference. */
  onPointerOutCapture?: FunctionProps;
  /** HTML anchor onGotPointerCapture event, using a named JS function reference. */
  onGotPointerCapture?: FunctionProps;
  /** HTML anchor onGotPointerCaptureCapture event, using a named JS function reference. */
  onGotPointerCaptureCapture?: FunctionProps;
  /** HTML anchor onLostPointerCapture event, using a named JS function reference. */
  onLostPointerCapture?: FunctionProps;
  /** HTML anchor onLostPointerCaptureCapture event, using a named JS function reference. */
  onLostPointerCaptureCapture?: FunctionProps;
  /** HTML anchor onScroll event, using a named JS function reference. */
  onScroll?: FunctionProps;
  /** HTML anchor onScrollCapture event, using a named JS function reference. */
  onScrollCapture?: FunctionProps;
  /** HTML anchor onScrollEnd event, using a named JS function reference. */
  onScrollEnd?: FunctionProps;
  /** HTML anchor onScrollEndCapture event, using a named JS function reference. */
  onScrollEndCapture?: FunctionProps;
  /** HTML anchor onWheel event, using a named JS function reference. */
  onWheel?: FunctionProps;
  /** HTML anchor onWheelCapture event, using a named JS function reference. */
  onWheelCapture?: FunctionProps;
  /** HTML anchor onAnimationStart event, using a named JS function reference. */
  onAnimationStart?: FunctionProps;
  /** HTML anchor onAnimationStartCapture event, using a named JS function reference. */
  onAnimationStartCapture?: FunctionProps;
  /** HTML anchor onAnimationEnd event, using a named JS function reference. */
  onAnimationEnd?: FunctionProps;
  /** HTML anchor onAnimationEndCapture event, using a named JS function reference. */
  onAnimationEndCapture?: FunctionProps;
  /** HTML anchor onAnimationIteration event, using a named JS function reference. */
  onAnimationIteration?: FunctionProps;
  /** HTML anchor onAnimationIterationCapture event, using a named JS function reference. */
  onAnimationIterationCapture?: FunctionProps;
  /** HTML anchor onToggle event, using a named JS function reference. */
  onToggle?: FunctionProps;
  /** HTML anchor onBeforeToggle event, using a named JS function reference. */
  onBeforeToggle?: FunctionProps;
  /** HTML anchor onTransitionCancel event, using a named JS function reference. */
  onTransitionCancel?: FunctionProps;
  /** HTML anchor onTransitionCancelCapture event, using a named JS function reference. */
  onTransitionCancelCapture?: FunctionProps;
  /** HTML anchor onTransitionEnd event, using a named JS function reference. */
  onTransitionEnd?: FunctionProps;
  /** HTML anchor onTransitionEndCapture event, using a named JS function reference. */
  onTransitionEndCapture?: FunctionProps;
  /** HTML anchor onTransitionRun event, using a named JS function reference. */
  onTransitionRun?: FunctionProps;
  /** HTML anchor onTransitionRunCapture event, using a named JS function reference. */
  onTransitionRunCapture?: FunctionProps;
  /** HTML anchor onTransitionStart event, using a named JS function reference. */
  onTransitionStart?: FunctionProps;
  /** HTML anchor onTransitionStartCapture event, using a named JS function reference. */
  onTransitionStartCapture?: FunctionProps;
  /** HTML aria attributes supplied as keyword dictionaries. */
  "aria-*"?: any;
  /** HTML data attributes supplied as keyword dictionaries. */
  "data-*"?: any;
}
