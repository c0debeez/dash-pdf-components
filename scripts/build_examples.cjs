/** Convert pinned official React examples into JSON-backed Dash documents. */
const fs = require("fs"),
  path = require("path"),
  crypto = require("crypto"),
  esbuild = require("esbuild");
const root = path.resolve(__dirname, ".."),
  vendor = path.join(root, "examples/upstream"),
  out = path.join(root, "examples/data");
const renderer = path.join(__dirname, "example_renderer.mjs"),
  bridge = path.join(__dirname, "example_bridge.mjs");
const assets = path.join(root, "assets/official");
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(assets, { recursive: true });
const workspace = path.join(root, "build/examples");
fs.mkdirSync(workspace, { recursive: true });
const schema = require(path.join(root, "docs/api-mapping.json"));
const primitives = Object.keys(schema.components).filter(
  (name) => !["PDFViewer", "PDFDownloadLink", "BlobProvider"].includes(name),
);
const plugin = (browser) => ({
  name: "example-adapters",
  setup(build) {
    build.onResolve({ filter: /^@react-pdf\/renderer$/ }, () => ({
      path: renderer,
    }));
    build.onLoad({ filter: /docs[\/]api-mapping\.json$/ }, () => ({
      loader: "json",
      contents: JSON.stringify({
        components: Object.fromEntries(
          primitives.map((name) => [
            name,
            Object.fromEntries(
              Object.keys(schema.components[name]).map((key) => [key, null]),
            ),
          ]),
        ),
      }),
    }));
    build.onLoad({ filter: /docs[\/]style-fields\.json$/ }, () => ({
      loader: "json",
      contents: JSON.stringify({
        properties: Object.fromEntries(
          Object.keys(
            JSON.parse(
              fs.readFileSync(path.join(root, "docs/style-fields.json")),
            ).properties,
          ).map((key) => [key, null]),
        ),
      }),
    }));

    if (browser)
      build.onResolve({ filter: /^react$/ }, () => ({
        path: "react",
        namespace: "browser-react",
      }));
    if (browser)
      build.onLoad({ filter: /.*/, namespace: "browser-react" }, () => ({
        contents:
          "const React=window.React;export default React;export const createElement=React.createElement,Fragment=React.Fragment,isValidElement=React.isValidElement;",
      }));
    build.onResolve({ filter: /\.(ttf|jpe?g|png|svg)$/ }, (args) => ({
      path: path.resolve(args.resolveDir, args.path),
      namespace: "example-asset",
    }));
    build.onLoad({ filter: /.*/, namespace: "example-asset" }, (args) => {
      const bytes = fs.readFileSync(args.path);
      const name =
        crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 12) +
        "-" +
        path.basename(args.path);
      fs.writeFileSync(path.join(assets, name), bytes);
      return {
        contents: `export default ${JSON.stringify("/assets/official/" + name)};`,
      };
    });
  },
});
(async () => {
  const source = fs.readFileSync(
    path.join(vendor, "apps/examples/src/examples/index.ts"),
    "utf8",
  );
  const imports = [...source.matchAll(/import (\w+) from '\.\/([^']+)'/g)].map(
    (match) => ({ variable: match[1], slug: match[2] }),
  );
  const examples = imports.map((item) => ({
    id: "repository-" + item.slug,
    source: path.join(
      vendor,
      "apps/examples/src/examples",
      item.slug,
      "index.tsx",
    ),
    url:
      "https://github.com/diegomura/react-pdf/tree/" +
      JSON.parse(fs.readFileSync(path.join(vendor, "tree.json"))).sha +
      "/apps/examples/src/examples/" +
      item.slug,
  }));
  const playground = JSON.parse(
    fs.readFileSync(path.join(vendor, "playground.json")),
  );
  for (const [slug, code] of Object.entries(playground)) {
    const file = path.join(workspace, slug + ".tsx");
    fs.writeFileSync(
      file,
      `import React from 'react';import {${[...primitives, "Font", "StyleSheet"].join(",")}} from ${JSON.stringify(renderer)};let captured;const ReactPDF={render:node=>{captured=node;}};\n${code}\nexport default {name:${JSON.stringify(slug)},Document:()=>captured};`,
    );
    examples.push({
      id: "playground-" + slug,
      source: file,
      url: "https://react-pdf.org/playground?example=" + slug,
    });
  }
  const manifest = [],
    dynamic = [];
  for (const example of examples) {
    const entry = path.join(workspace, example.id + ".mjs");
    fs.writeFileSync(
      entry,
      `import example from ${JSON.stringify(example.source)};import {convert} from ${JSON.stringify(bridge)};export default convert(example,${JSON.stringify(example.id)});`,
    );
    const bundle = path.join(workspace, example.id + ".cjs");
    try {
      await esbuild.build({
        entryPoints: [entry],
        bundle: true,
        platform: "node",
        format: "cjs",
        outfile: bundle,
        plugins: [plugin(false)],
        external: ["react"],
        jsx: "transform",
        tsconfigRaw: { compilerOptions: { jsx: "react" } },
        nodePaths: [path.join(root, "node_modules")],
        logLevel: "silent",
      });
      const { result, functions } = require(bundle).default;
      result.source = example.url;
      fs.writeFileSync(
        path.join(out, example.id + ".json"),
        JSON.stringify(result) + "\n",
      );
      manifest.push({
        id: result.id,
        name: result.name,
        description: result.description,
        source: example.url,
        group: example.id.startsWith("repository-")
          ? "Repository"
          : "Playground",
      });
      if (Object.keys(functions).length) dynamic.push({ example, entry });
      console.log(
        "Converted",
        example.id,
        Object.keys(functions).length ? "with JS callbacks" : "",
      );
    } catch (error) {
      console.error("FAILED", example.id, error.message);
      process.exitCode = 1;
    }
  }
  if (process.exitCode) return;
  const browserBundles = [];
  for (const { entry, example } of dynamic) {
    const browserEntry = path.join(workspace, example.id + "-browser.mjs");
    fs.writeFileSync(
      browserEntry,
      `import entry from ${JSON.stringify(entry)};window.dashPdfComponentsFunctions ||= {};window.dashPdfComponentsFunctions.official ||= {};window.dashPdfComponentsFunctions.official[entry.prefix]=entry.functions;`,
    );
    const compiled = await esbuild.build({
      entryPoints: [browserEntry],
      bundle: true,
      platform: "browser",
      format: "iife",
      write: false,
      plugins: [plugin(true)],
      jsx: "transform",
      tsconfigRaw: { compilerOptions: { jsx: "react" } },
      minify: true,
      logLevel: "silent",
    });
    browserBundles.push(compiled.outputFiles[0].text);
  }
  fs.writeFileSync(
    path.join(root, "assets/official-examples.js"),
    browserBundles.join("\n"),
  );
  fs.writeFileSync(
    path.join(out, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log(
    `Converted all ${manifest.length} official examples; ${dynamic.length} callback modules.`,
  );
})();
