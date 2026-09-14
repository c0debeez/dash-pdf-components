import React from "react";
import api from "../docs/api-mapping.json";
import styles from "../docs/style-fields.json";
import { registrations, settings } from "./example_renderer.mjs";
const primitiveNames = [
  "Document",
  "Page",
  "View",
  "Text",
  "Image",
  "ImageBackground",
  "Link",
  "Note",
  "Canvas",
  "FieldSet",
  "TextInput",
  "Checkbox",
  "Select",
  "List",
  "Svg",
  "Line",
  "Polyline",
  "Polygon",
  "Path",
  "Rect",
  "Circle",
  "Ellipse",
  "Tspan",
  "G",
  "Stop",
  "Defs",
  "ClipPath",
  "Marker",
  "LinearGradient",
  "RadialGradient",
];
const names = new Map(
  primitiveNames.flatMap((name) => [
    [name, name],
    [name.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase(), name],
  ]),
);
export function convert(example, id) {
  const functions = {};
  const prefix = id.replace(/[^a-zA-Z0-9_$]/g, "_");
  const familyNames = new Map(
    registrations.map((font) => [font.family, `${id}: ${font.family}`]),
  );
  const walk = (node, path = "document") => {
    if (node == null || typeof node === "boolean") return null;
    if (typeof node === "number" || typeof node === "string") return node;
    if (Array.isArray(node))
      return node.map((child, index) => walk(child, path + "_" + index));
    if (React.isValidElement(node)) {
      if (node.type === React.Fragment) return walk(node.props.children, path);
      // Experimental layout's measured fragment carriers remain renderer-owned.
      if (node.type === "FRAGMENT") return node;
      if (typeof node.type === "function")
        return walk(node.type(node.props), path);
      const name = names.get(node.type);
      if (!name)
        throw new Error(`Unknown primitive ${String(node.type)} at ${path}`);
      const props = {};
      for (const [field, value] of Object.entries(node.props)) {
        if (field === "children")
          props.children = walk(value, path + "_children");
        else if (field === "style" || field === "imageStyle")
          props[field] = style(value);
        else if (typeof value === "function")
          props[field] = reference(value, path + "_" + field, field);
        else if (value instanceof Date) props[field] = value.toISOString();
        else if (field === "id") props.pdfId = value;
        else props[field] = value;
      }
      const normalized = {},
        styleExtras = {};
      for (const [field, value] of Object.entries(props)) {
        const canonical = field.replace(/-([a-zA-Z])/g, (_, letter) =>
          letter.toUpperCase(),
        );
        if (canonical === "dy") continue; // renderer 4.9 ignores SVG dy; preserve its y coordinate.
        if (
          canonical in api.components[name] ||
          ["children", "pdfId", "renderTemplate", "operations"].includes(
            canonical,
          )
        )
          normalized[canonical] = value;
        else if (canonical in styles.properties) {
          styleExtras[canonical] =
            canonical === "fontFamily"
              ? familyNames.get(value) || value
              : value;
        } else throw new Error(`Unmapped example field ${name}.${field}`);
      }
      if (
        ["TextInput", "Checkbox", "Select", "List"].includes(name) &&
        !normalized.name
      )
        normalized.name = path.replace(/[^a-zA-Z0-9_$]/g, "_");
      if (Object.keys(styleExtras).length)
        normalized.style = Array.isArray(normalized.style)
          ? [...normalized.style, styleExtras]
          : { ...normalized.style, ...styleExtras };
      return {
        namespace: "dash_pdf_components",
        type: name,
        props: normalized,
      };
    }
    throw new Error(`Unexpected example node at ${path}`);
  };
  const style = (value) => {
    if (Array.isArray(value)) return value.map(style);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        key === "fontFamily"
          ? Array.isArray(entry)
            ? entry.map((family) => familyNames.get(family) || family)
            : familyNames.get(entry) || entry
          : typeof entry === "object"
            ? style(entry)
            : entry,
      ]),
    );
  };
  const reference = (fn, key, field) => {
    key = key.replace(/[^a-zA-Z0-9_$]/g, "_");
    functions[key] = (...args) =>
      ["render", "layout"].includes(field)
        ? walk(fn(...args), key)
        : fn(...args);
    return { function: `official.${prefix}.${key}` };
  };
  let document = walk(React.createElement(example.Document));
  if (document.type === "Page")
    document = {
      namespace: "dash_pdf_components",
      type: "Document",
      props: { children: document },
    };
  const fonts = registrations.map((font) => ({
    ...font,
    family: familyNames.get(font.family),
  }));
  const result = {
    id,
    name: example.name,
    description: example.description || "",
    document,
    fonts,
  };
  if (settings.emojiSource) result.emojiSource = settings.emojiSource;
  if (settings.hyphenationCallback)
    result.hyphenationCallback = reference(
      settings.hyphenationCallback,
      "hyphenationCallback",
      "hyphenationCallback",
    );
  return { result, functions, prefix };
}
