/** Refresh wrappers and the auditable property map from the locked renderer declarations. */
const fs = require("fs"),
  path = require("path"),
  ts = require("typescript");
const renderer = fs.realpathSync(
  require.resolve("@react-pdf/renderer/package.json"),
);
const entry = path.join(path.dirname(renderer), "lib/react-pdf.d.ts");
const program = ts.createProgram([entry], {
  strict: true,
  skipLibCheck: true,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
});
const checker = program.getTypeChecker(),
  source = program.getSourceFile(entry),
  declarations = {};
function walk(n) {
  if (ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n))
    declarations[n.name.text] = n;
  ts.forEachChild(n, walk);
}
walk(source);
const componentInterfaces = {
  Document: ["DocumentProps"],
  Page: ["PageProps"],
  View: ["ViewProps"],
  Text: ["TextProps", "SVGTextProps"],
  Image: ["BaseImageProps", "ImageWithSrcProp", "ImageWithSourceProp"],
  ImageBackground: [
    "BaseImageBackgroundProps",
    "ImageBackgroundWithSrcProp",
    "ImageBackgroundWithSourceProp",
  ],
  Link: ["LinkProps"],
  Note: ["NoteProps"],
  Canvas: ["CanvasProps"],
  FieldSet: ["FieldSetProps"],
  TextInput: ["TextInputProps"],
  Checkbox: ["CheckboxProps"],
  Select: ["SelectAndListPropsBase"],
  List: ["SelectAndListPropsBase"],
  Svg: ["SVGProps"],
  Line: ["LineProps"],
  Polyline: ["PolylineProps"],
  Polygon: ["PolygonProps"],
  Path: ["PathProps"],
  Rect: ["RectProps"],
  Circle: ["CircleProps"],
  Ellipse: ["EllipseProps"],
  Tspan: ["TspanProps"],
  G: ["GProps"],
  Stop: ["StopProps"],
  Defs: ["DefsProps"],
  ClipPath: ["ClipPathProps"],
  Marker: ["MarkerProps"],
  LinearGradient: ["LinearGradientProps"],
  RadialGradient: ["RadialGradientProps"],
};
function jsonType(t, depth = 0) {
  if (depth > 3) return "any";
  if (t.isIntersection() && t.types.some(part => part.flags & ts.TypeFlags.StringLike)) return "string";
  if (t.isUnion())
    return (
      [
        ...new Set(
          t.types
            .filter(
              (s) => !(s.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Never)),
            )
            .map((s) => jsonType(s, depth)),
        ),
      ].join(" | ") || "any"
    );
  if (t.flags & ts.TypeFlags.StringLiteral) return JSON.stringify(t.value);
  if (t.flags & ts.TypeFlags.NumberLiteral) return String(t.value);
  if (t.flags & ts.TypeFlags.BooleanLike) return "boolean";
  if (t.flags & ts.TypeFlags.StringLike) return "string";
  if (t.flags & ts.TypeFlags.NumberLike) return "number";
  if (t.flags & ts.TypeFlags.Null) return "null";
  if (t.getCallSignatures().length) return "FunctionProps";
  if (checker.isArrayType(t) || checker.isTupleType(t) || t.symbol?.name === "ReadonlyArray") {
    const args = checker.getTypeArguments(t);
    const element = [...new Set(args.map((s) => jsonType(s, depth + 1)))].join(
      " | ",
    );
    return `(${element || "any"})[]`;
  }
  if (t.symbol?.name === "Date") return "string";
  if (depth > 2 || t.flags & ts.TypeFlags.Any) return "any";
  const props = t.getProperties();
  if (props.length && !t.getStringIndexType() && props.length < 40)
    return (
      "{ " +
      props
        .map(
          (p) =>
            `${JSON.stringify(p.name)}${p.flags & ts.SymbolFlags.Optional ? "?" : ""}: ${jsonType(checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration || p.declarations[0]), depth + 1)}`,
        )
        .join("; ") +
      " }"
    );
  return "Record<string, any>";
}
const mapping = {
  package: "@react-pdf/renderer",
  version: JSON.parse(fs.readFileSync(renderer)).version,
  components: {},
  publicAPIs: {},
};
for (const [name, ifs] of Object.entries(componentInterfaces)) {
  const properties = new Map();
  for (const i of ifs)
    for (const p of checker.getTypeAtLocation(declarations[i]).getProperties())
      properties.set(p.name, p);
  let body = "";
  mapping.components[name] = {};
  for (const [field, p] of properties) {
    const t = checker.getTypeOfSymbolAtLocation(
      p,
      p.valueDeclaration || p.declarations[0],
    );
    let type = jsonType(t),
      mode = "direct",
      note = "Same renderer property and semantics.";
    if (field === "children")
      type = name === "Note" ? "string" : "React.ReactNode";
    if (field === "id") {
      type = "string | Record<string, any>";
      mode = "adapted";
      note =
        "Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer.";
    }
    if (field === "style") {
      type = "PDFStyle | PDFStyle[]";
      mode = "adapted";
      note =
        "Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries.";
    }
    if (
      ["render", "layout", "paint", "hyphenationCallback", "onRender"].includes(
        field,
      )
    ) {
      type = "FunctionProps";
      mode = "adapted";
      note =
        "Named registry function, original arguments followed by options and context.";
    }
    if (["creationDate", "modificationDate"].includes(field)) {
      type = "string";
      mode = "adapted";
      note = "ISO 8601 string validated and converted to Date.";
    }
    if (["src", "source"].includes(field) && name.startsWith("Image")) {
      type = "ImageSource | FunctionProps";
      mode = "adapted";
      note =
        "URL/data URL, request dictionary, {data: base64, format}, byte list or named (possibly async) source function.";
    }
    if (field === "size" && name === "Page")
      type =
        "string | (string | number)[] | { width: string | number; height?: string | number }";
    if (field === "bookmark") type = "string | Bookmark";
    if (field === "permissions") type = "Permissions";
    const doc =
      ts
        .displayPartsToString(p.getDocumentationComment(checker))
        .replace(/\*\//g, "")
        .trim() || `Renderer ${field} property.`;
    body += `  /** ${doc} ${mode === "adapted" ? note : ""} */\n  ${field}?: ${type};\n`;
    mapping.components[name][field] = {
      mode,
      type,
      required: !(p.flags & ts.SymbolFlags.Optional),
      note,
    };
  }
  if (!properties.has("children"))
    body +=
      "  /** PDF child nodes where supported by this primitive. */\n  children?: React.ReactNode;\n";
  if (name === 'Image') for (const field of ['x', 'y']) {
    body += `  /** SVG image coordinate, supported by the browser implementation. */\n  ${field}?: string | number;\n`;
    mapping.components[name][field] = {mode:'direct',type:'string | number',required:false,note:'SVG image coordinate from the browser implementation; omitted from upstream ImageProps.'};
  }
  fs.writeFileSync(
    `src/props/generation/${name}.ts`,
    `// Synced by scripts/sync_api.cjs.\nimport React from "react";\nimport { NodeIdentity, PDFStyle, FunctionProps, ImageSource, Bookmark, Permissions } from "./shared/dash";\nexport interface ${name}Props extends NodeIdentity {\n${body}${name === "Text" ? "  /** Dynamic page text. Mutually exclusive with render. */\n  renderTemplate?: string;\n" : ""}${name === "Canvas" ? "  /** Ordered JSON drawing operations: [{method, args}]. Mutually exclusive with paint. */\n  operations?: {method: string; args?: any[]}[];\n" : ""}}\n`,
  );
  fs.writeFileSync(
    `src/components/document/${name}.tsx`,
    `import type { ${name}Props } from "../../props/generation/${name}";\n/** PDF ${name} primitive. Used as a description inside an output component, never as HTML. */\nconst ${name} = (_props: ${name}Props) => null;\nexport default ${name};\n`,
  );
}
// HTML anchor attributes, including named event handlers. Exclude the fields owned by OutputProps.
const anchorType = checker.getTypeAtLocation(declarations.PDFDownloadLinkProps);
let anchorBody = "";
mapping.components.PDFDownloadLink = {};
const owned = new Set([
  "document",
  "children",
  "style",
  "id",
  "className",
  "fileName",
]);
for (const p of anchorType.getProperties()) {
  if (owned.has(p.name)) continue;
  if (p.name === "ref" || p.name === "dangerouslySetInnerHTML") {
    mapping.components.PDFDownloadLink[p.name] = {
      mode: "unsupported",
      note: "Ref/imperative DOM or raw HTML is not a serialized Dash property; use children.",
    };
    continue;
  }
  const t = checker.getTypeOfSymbolAtLocation(
    p,
    p.valueDeclaration || p.declarations[0],
  );
  let type = jsonType(t);
  if (p.name.startsWith("on")) type = "FunctionProps";
  if (p.name === "download") type = "string | boolean";
  if (!p.name.includes("-")) anchorBody += `  /** HTML anchor ${p.name}${p.name.startsWith("on") ? " event, using a named JS function reference" : ""}. */\n  ${JSON.stringify(p.name)}?: ${type};\n`;
  mapping.components.PDFDownloadLink[p.name] = {
    mode: p.name.startsWith("on") ? "adapted" : "direct",
    type,
    note: p.name.startsWith("on")
      ? "JS event followed by options and context. onClick also updates n_clicks."
      : "Forwarded to the download anchor.",
  };
}
anchorBody += '  /** HTML aria attributes supplied as keyword dictionaries. */\n  "aria-*"?: any;\n  /** HTML data attributes supplied as keyword dictionaries. */\n  "data-*"?: any;\n';
fs.writeFileSync(
  "src/props/generation/Anchor.ts",
  `// Synced by scripts/sync_api.cjs.\nimport {FunctionProps} from "./shared/dash";\nexport interface AnchorProps {\n${anchorBody}}\n`,
);
for (const name of ["PDFViewer", "PDFDownloadLink", "BlobProvider"]) {
  mapping.components[name] ||= {};
  for (const field of [
    "document",
    "children",
    "fileName",
    "width",
    "height",
    "showToolbar",
    "style",
    "className",
  ])
    mapping.components[name][field] = {
      mode: field === "document" || field === "children" ? "adapted" : "direct",
      note: "See OutputProps and output API documentation.",
    };
  if (name === "PDFViewer")
    mapping.components[name].innerRef = {
      mode: "unsupported",
      note: "React Ref cannot cross JSON. frameId supplies a stable iframe DOM ID for clientside access.",
    };
}
const outputSource = ts.createSourceFile('Output.ts', fs.readFileSync('src/props/generation/Output.ts', 'utf8'), ts.ScriptTarget.Latest, true);
const outputInterface = outputSource.statements.find(ts.isInterfaceDeclaration);
for (const name of ['PDFViewer', 'PDFDownloadLink', 'BlobProvider']) {
  for (const field of outputInterface.members) {
    const key = field.name.getText(outputSource);
    mapping.components[name][key] = {
      mode: ['style', 'className', 'width', 'height', 'fileName', 'downloadLabel', 'showToolbar', 'showDownload'].includes(key) ? 'direct' : 'adapted',
      type: field.type.getText(outputSource),
      note: ts.getJSDocCommentsAndTags(field).map(doc => doc.comment || '').join(' ') || 'See output adapters.',
    };
  }
}
const nodeNames = Object.keys(componentInterfaces);
fs.writeFileSync(
  "src/fragments/generation/schema.ts",
  `// Synced by scripts/sync_api.cjs.\nexport const nodeSchema = ${JSON.stringify(Object.fromEntries(nodeNames.map((n) => [n, mapping.components[n]])), null, 2)} as const;\nexport const anchorFields = ${JSON.stringify(Object.keys(mapping.components.PDFDownloadLink).filter((n) => !owned.has(n) && mapping.components.PDFDownloadLink[n].mode !== "unsupported"))} as const;\n`,
);
fs.writeFileSync(
  "src/index.ts",
  'export {default as PDF} from "./components/PDF";\n' + nodeNames.map(n => `export {default as ${n}} from "./components/document/${n}";`).join("\n") + "\n",
);
for (const n of ["StyleSheet", "Font", "usePDF", "pdf"])
  mapping.publicAPIs[n] = {
    mode: "adapted",
    note:
      n === "Font"
        ? "fonts/fontAction/fontDescriptors/emojiSource/hyphenationCallback/fontFamilies/fontInfo on each output; job-scoped global settings."
        : n === "StyleSheet"
          ? "PDFStyle dictionaries and media queries; no JS object crosses Python."
          : "autoGenerate, n_generate, n_render and output state replace hooks/instance methods.",
  };
for (const n of [
  "render",
  "renderToFile",
  "renderToStream",
  "renderToBuffer",
  "renderToString",
])
  mapping.publicAPIs[n] = {
    mode: "unsupported",
    note: "Node-only API; explicitly outside the confirmed browser-only scope.",
  };
for (const n of ["PDFRenderer", "container"])
  mapping.publicAPIs[n] = {
    mode: "unsupported",
    note: "Low-level reconciler/runtime objects are not serialized Dash API.",
  };
mapping.publicAPIs.version = {
  mode: "adapted",
  note: "rendererVersion output property.",
};
fs.writeFileSync(
  "docs/api-mapping.json",
  JSON.stringify(mapping, null, 2) + "\n",
);
console.log(
  `Synced ${nodeNames.length + 3} components and HTML anchor attributes.`,
);
const styleType = checker.getIndexTypeOfType(checker.getTypeAtLocation(declarations.Styles), ts.IndexKind.String);
const styleFields = Object.fromEntries(styleType.getProperties().map(p => [p.name,jsonType(checker.getTypeOfSymbolAtLocation(p,p.valueDeclaration||p.declarations[0]))]));
for (const p of checker.getTypeAtLocation(declarations.SVGTextProps).getProperties()) if(!['x','y','style','hyphenationCallback'].includes(p.name))styleFields[p.name]=jsonType(checker.getTypeOfSymbolAtLocation(p,p.valueDeclaration||p.declarations[0]));
const svgDeclaration = program.getSourceFiles().flatMap(source => source.statements).find(statement => ts.isInterfaceDeclaration(statement) && statement.name.text === 'SVGPresentationAttributes');
const svgFields = Object.fromEntries(checker.getTypeAtLocation(svgDeclaration).getProperties().map(p => [p.name,jsonType(checker.getTypeOfSymbolAtLocation(p,p.valueDeclaration||p.declarations[0]))]));
fs.writeFileSync('docs/style-fields.json',JSON.stringify({version:mapping.version,properties:styleFields,svgProperties:svgFields},null,2)+'\n');
