export const registrations = [];
export const settings = {};
export const Font = {
  register: (value) => registrations.push(value),
  registerEmojiSource: (value) => {
    settings.emojiSource = value;
  },
  registerHyphenationCallback: (value) => {
    settings.hyphenationCallback = value;
  },
};
export const StyleSheet = { create: (value) => value };
export const Document = "Document",
  Page = "Page",
  View = "View",
  Text = "Text",
  Image = "Image",
  ImageBackground = "ImageBackground",
  Link = "Link",
  Note = "Note",
  Canvas = "Canvas",
  FieldSet = "FieldSet",
  TextInput = "TextInput",
  Checkbox = "Checkbox",
  Select = "Select",
  List = "List",
  Svg = "Svg",
  Line = "Line",
  Polyline = "Polyline",
  Polygon = "Polygon",
  Path = "Path",
  Rect = "Rect",
  Circle = "Circle",
  Ellipse = "Ellipse",
  Tspan = "Tspan",
  G = "G",
  Stop = "Stop",
  Defs = "Defs",
  ClipPath = "ClipPath",
  Marker = "Marker",
  LinearGradient = "LinearGradient",
  RadialGradient = "RadialGradient";
