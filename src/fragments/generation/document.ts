import React from "react";
import * as Renderer from "@react-pdf/renderer";
import { Buffer } from "buffer";
import { nodeSchema } from "./schema";
import { isFunctionReference, resolveFunction } from "./functions";
export const nodeNames = new Set(Object.keys(nodeSchema));
const primitives = Object.fromEntries(
  [...nodeNames].map((name) => [name, (Renderer as any)[name]]),
);
const reverse = new Map(
  Object.entries(primitives).map(([name, type]) => [type, name]),
);
const svgNames = new Set([
  "Svg",
  "G",
  "Rect",
  "Circle",
  "Ellipse",
  "Line",
  "Path",
  "Polygon",
  "Polyline",
  "Defs",
  "ClipPath",
  "Marker",
  "LinearGradient",
  "RadialGradient",
  "Stop",
  "Tspan",
]);
const leaves = new Set([
  "Image",
  "TextInput",
  "Checkbox",
  "Select",
  "List",
  "Canvas",
]);
export function isDocument(node: any): boolean {
  return (
    !!node &&
    node.namespace === "dash_pdf_components" &&
    node.type === "Document"
  );
}
export function unwrapDocument(node: any): any {
  return Array.isArray(node) && node.length === 1 ? node[0] : node;
}
export function callbackContext(
  extra: Record<string, any> = {},
): Record<string, any> {
  return { ...extra, createElement: createPDFElement, primitives };
}
function checkParent(name: string, parent: string | undefined, path: string) {
  if (name === "Document" && parent)
    throw new Error(`${path}: Document must be the root.`);
  if (parent === "Document" && name !== "Page")
    throw new Error(`${path}: Document accepts only Page children.`);
  if (name === "Page" && parent !== "Document")
    throw new Error(`${path}: Page must be inside Document.`);
  if (name !== "Svg" && svgNames.has(name) && !parent?.startsWith("svg:"))
    throw new Error(`${path}: ${name} must be inside Svg.`);
  if (
    parent?.startsWith("svg:") &&
    !svgNames.has(name) &&
    !["Text", "Image"].includes(name)
  )
    throw new Error(`${path}: ${name} is not an SVG child.`);
  if (
    ["svg:Text", "svg:Tspan"].includes(parent ?? "") &&
    !["Text", "Tspan"].includes(name)
  )
    throw new Error(`${path}: SVG text accepts only Text or Tspan children.`);
  if (name === "Tspan" && !["svg:Text", "svg:Tspan"].includes(parent ?? ""))
    throw new Error(`${path}: Tspan must be inside SVG Text or Tspan.`);
  if (parent === "Note" || (parent && leaves.has(parent)))
    throw new Error(`${path}: ${parent} does not accept component children.`);
  if (parent === "Text" && !["Text", "Link", "Image"].includes(name))
    throw new Error(
      `${path}: Text accepts inline Text, Link or Image children.`,
    );
}
function imageSource(value: any, context: Record<string, any>): any {
  if (isFunctionReference(value))
    return async () =>
      imageSource(await resolveFunction(value, context)(), context);
  if (Array.isArray(value)) {
    if (value.some((v) => !Number.isInteger(v) || v < 0 || v > 255))
      throw new Error("Image byte values must be integers from 0 to 255.");
    return Buffer.from(value);
  }
  if (
    value &&
    typeof value === "object" &&
    !React.isValidElement(value) &&
    "data" in value
  ) {
    if (!["png", "jpg"].includes(value.format))
      throw new Error("Binary image format must be png or jpg.");
    const data =
      typeof value.data === "string"
        ? Buffer.from(value.data, "base64")
        : imageSource(value.data, context);
    return { ...value, data };
  }
  return value;
}
const drawingMethods = new Set([
  "save",
  "restore",
  "fill",
  "stroke",
  "fillAndStroke",
  "fillColor",
  "strokeColor",
  "opacity",
  "fillOpacity",
  "strokeOpacity",
  "lineWidth",
  "lineCap",
  "lineJoin",
  "miterLimit",
  "dash",
  "undash",
  "moveTo",
  "lineTo",
  "bezierCurveTo",
  "quadraticCurveTo",
  "rect",
  "roundedRect",
  "circle",
  "ellipse",
  "polygon",
  "path",
  "clip",
  "translate",
  "rotate",
  "scale",
  "transform",
  "linearGradient",
  "radialGradient",
]);
function drawing(operations: any[]) {
  return (painter: any) => {
    if (!Array.isArray(operations))
      throw new Error("Canvas.operations must be a list.");
    for (const { method, args = [] } of operations) {
      if (
        !drawingMethods.has(method) ||
        typeof painter[method] !== "function" ||
        !Array.isArray(args)
      )
        throw new Error(`Unsupported Canvas operation ${method}.`);
      painter[method](...args);
    }
    return null;
  };
}
/** Convert only PDF descriptors; DOM wrappers never enter the PDF reconciler. */
export function toPDFNode(
  node: any,
  path = "document",
  parent?: string,
  extra: Record<string, any> = {},
): React.ReactNode {
  if (node == null || typeof node === "boolean") return null;
  if (typeof node === "string" || typeof node === "number") {
    if (
      !parent ||
      !["Text", "Link", "Note", "svg:Text", "svg:Tspan"].includes(parent)
    )
      throw new Error(
        `${path}: text must be inside Text, Link, Note or SVG text.`,
      );
    return node;
  }
  if (Array.isArray(node))
    return node.map((child, i) =>
      toPDFNode(child, `${path}[${i}]`, parent, extra),
    );
  if (React.isValidElement(node) && node.type === React.Fragment)
    return toPDFNode((node.props as any).children, path, parent, extra);
  // Page.layout children are renderer-owned Fragment carriers around measured nodes.
  if (
    React.isValidElement(node) &&
    node.type === (Renderer as any).Fragment &&
    extra.layoutPayload
  )
    return node;
  let name: string, source: any;
  if (React.isValidElement(node)) {
    name = reverse.get(node.type) as string;
    source = node.props;
  } else {
    if (node.namespace !== "dash_pdf_components")
      throw new Error(
        `${path}: PDF content must contain only dash_pdf_components document nodes.`,
      );
    name = node.type;
    source = node.props;
  }
  if (!nodeNames.has(name) || !source)
    throw new Error(`${path}: unknown PDF primitive ${name}.`);
  checkParent(name, parent, path);
  const context = callbackContext({ ...extra, nodePath: path });
  const {
    children,
    setProps,
    loading_state,
    pdfId,
    renderTemplate,
    operations,
    key,
    ...props
  } = source;
  if (pdfId !== undefined) props.id = pdfId;
  else if (typeof props.id !== "string") delete props.id;
  const schema: Record<string, any> = (nodeSchema as any)[name];
  for (const field of Object.keys(props)) {
    if (!(field in schema) && field !== "id")
      throw new Error(`${path}: unsupported ${name}.${field}.`);
  }
  for (const [field, descriptor] of Object.entries(schema) as [string, any][]) {
    if (
      descriptor.required &&
      !["children", "src", "source", "paint"].includes(field) &&
      !(name === "Text" && ["x", "y"].includes(field)) &&
      props[field] === undefined
    )
      throw new Error(`${path}: ${name}.${field} is required.`);
    const literalType = descriptor.type as string;
    if (
      props[field] !== undefined &&
      /^"[^"\n]+"(?: \| "[^"\n]+")*$/.test(literalType)
    ) {
      const choices = literalType
        .split(" | ")
        .map((value) => JSON.parse(value));
      if (!choices.includes(props[field]))
        throw new Error(
          `${path}: ${name}.${field} must be one of ${choices.join(", ")}.`,
        );
    }
  }
  if (name === "Document") {
    for (const field of ["creationDate", "modificationDate"])
      if (props[field] !== undefined) {
        if (
          typeof props[field] !== "string" ||
          !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(props[field]) ||
          !Number.isFinite(Date.parse(props[field]))
        )
          throw new Error(
            `${path}: ${field} must be an ISO 8601 timestamp with timezone.`,
          );
        props[field] = new Date(props[field]);
      }
    // Completion is invoked by Output only for the latest successful job.
    delete props.onRender;
    if (props.conformance && (props.ownerPassword || props.userPassword))
      throw new Error(`${path}: PDF/A conformance does not permit encryption.`);
  }
  if (name === "Text" && renderTemplate !== undefined) {
    if (props.render !== undefined)
      throw new Error(
        `${path}: render and renderTemplate are mutually exclusive.`,
      );
    if (typeof renderTemplate !== "string")
      throw new Error(`${path}: renderTemplate must be a string.`);
    props.render = (values: Record<string, any>) =>
      renderTemplate.replace(
        /\{(pageNumber|totalPages|subPageNumber|subPageTotalPages)\}/g,
        (_, field) => String(values[field] ?? ""),
      );
  }
  for (const field of ["render", "layout", "paint", "hyphenationCallback"])
    if (props[field] !== undefined) {
      const fn =
        typeof props[field] === "function"
          ? props[field]
          : resolveFunction(props[field], context);
      props[field] = (...args: any[]) => {
        const result = fn(...args);
        if (result?.then)
          throw new Error(`${path}: ${field} must be synchronous.`);
        if (field === "render" || field === "layout")
          return toPDFNode(
            result,
            `${path}.${field}`,
            field === "layout"
              ? "Page"
              : parent?.startsWith("svg:")
                ? `svg:${name}`
                : name,
            field === "layout" ? { ...extra, layoutPayload: true } : extra,
          );
        if (
          field === "hyphenationCallback" &&
          (!Array.isArray(result) || result.some((v) => typeof v !== "string"))
        )
          throw new Error(
            `${path}: hyphenationCallback must return a string list.`,
          );
        return result;
      };
    }
  if (name === "Canvas") {
    if (operations !== undefined && props.paint !== undefined)
      throw new Error(`${path}: paint and operations are mutually exclusive.`);
    if (operations !== undefined) props.paint = drawing(operations);
    if (props.paint === undefined)
      throw new Error(`${path}: Canvas requires paint or operations.`);
  }
  if (name === "Image" || name === "ImageBackground") {
    if (props.src !== undefined && props.source !== undefined)
      throw new Error(`${path}: src and source are mutually exclusive.`);
    if (props.src === undefined && props.source === undefined)
      throw new Error(`${path}: image requires src or source.`);
    for (const field of ["src", "source"])
      if (props[field] !== undefined)
        props[field] = imageSource(props[field], context);
  }
  if (name === "Link" && props.src !== undefined && props.href !== undefined)
    throw new Error(`${path}: src and href are mutually exclusive.`);
  if (
    ["FieldSet", "TextInput", "Checkbox", "Select", "List"].includes(name) &&
    !props.name
  )
    throw new Error(`${path}: ${name} requires name.`);
  if (name === "Note" && typeof children !== "string")
    throw new Error(`${path}: Note children must be a string.`);
  const inSVG = name === "Svg" || parent?.startsWith("svg:");
  const childParent = inSVG ? `svg:${name}` : name;
  const converted = props.render
    ? undefined
    : toPDFNode(children, `${path}.children`, childParent, extra);
  return React.createElement(
    primitives[name],
    { ...props, key: key ?? path },
    converted,
  );
}
export function toPDFDocument(
  node: any,
  extra: Record<string, any> = {},
): React.ReactElement<Renderer.DocumentProps> {
  const document = unwrapDocument(node);
  if (!isDocument(document))
    throw new Error("Provide exactly one dash_pdf_components.Document.");
  return toPDFNode(
    document,
    "document",
    undefined,
    extra,
  ) as React.ReactElement<Renderer.DocumentProps>;
}
/** Client-side callback helper; creates primitives without exposing React internals to Python. */
export function createPDFElement(
  name: string,
  props: Record<string, any> = {},
  ...children: any[]
): React.ReactElement {
  if (!nodeNames.has(name)) throw new Error(`Unknown PDF primitive ${name}.`);
  return React.createElement(primitives[name], props, ...children);
}
