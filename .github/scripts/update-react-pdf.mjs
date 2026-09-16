import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const packageJson = readJson("package.json");
const currentReactPdf = readJson("node_modules/react-pdf/package.json");
const currentPdfjs = readJson("node_modules/pdfjs-dist/package.json");
const currentRenderer = readJson(
  "node_modules/@react-pdf/renderer/package.json",
);
// Dash currently ships React 18. React-PDF 11 requires React 19, so stay on 10.x.
const releases = JSON.parse(
  execFileSync(
    "npm",
    ["view", "react-pdf@10", "version", "dependencies.pdfjs-dist", "--json"],
    {
      encoding: "utf8",
    },
  ),
);
const latest = (Array.isArray(releases) ? releases : [releases])
  .filter((release) => /^10\.\d+\.\d+$/.test(release.version))
  .sort((a, b) => {
    const left = a.version.split(".").map(Number);
    const right = b.version.split(".").map(Number);
    return left[1] - right[1] || left[2] - right[2];
  })
  .at(-1);
if (!latest) {
  throw new Error("No stable React 18-compatible React-PDF 10 release found.");
}
const reactPdfVersion = latest.version;
const pdfjsVersion = latest["dependencies.pdfjs-dist"];
const rendererRelease = JSON.parse(
  execFileSync(
    "npm",
    [
      "view",
      "@react-pdf/renderer@latest",
      "version",
      "peerDependencies.react",
      "--json",
    ],
    { encoding: "utf8" },
  ),
);
const rendererVersion = rendererRelease.version;
const rendererReactRange = rendererRelease["peerDependencies.react"];
// React-PDF pins PDF.js exactly; reject ranges rather than selecting an incompatible Worker.
const stableVersion = /^\d+\.\d+\.\d+$/;
if (
  !stableVersion.test(reactPdfVersion) ||
  !stableVersion.test(pdfjsVersion) ||
  !stableVersion.test(rendererVersion)
) {
  throw new Error(
    "Expected stable, exact React-PDF, PDF.js, and renderer versions from npm.",
  );
}
if (
  typeof rendererReactRange !== "string" ||
  !rendererReactRange
    .split(/\s*\|\|\s*/)
    .some((range) => /^\^18(?:\.|$)/.test(range))
) {
  throw new Error(
    `Latest @react-pdf/renderer ${rendererVersion} does not explicitly support React 18.`,
  );
}

const reactPdfChanged =
  currentReactPdf.version !== reactPdfVersion ||
  currentPdfjs.version !== pdfjsVersion ||
  packageJson.dependencies["react-pdf"] !== reactPdfVersion ||
  packageJson.dependencies["pdfjs-dist"] !== pdfjsVersion;
const rendererRange = `^${rendererVersion}`;
const rendererChanged =
  currentRenderer.version !== rendererVersion ||
  packageJson.dependencies["@react-pdf/renderer"] !== rendererRange;

if (reactPdfChanged || rendererChanged) {
  packageJson.dependencies["react-pdf"] = reactPdfVersion;
  packageJson.dependencies["pdfjs-dist"] = pdfjsVersion;
  packageJson.dependencies["@react-pdf/renderer"] = rendererRange;
  writeFileSync("package.json", `${JSON.stringify(packageJson, null, 2)}\n`);
  execFileSync("pnpm", ["install", "--no-frozen-lockfile"], {
    stdio: "inherit",
  });
}

const installedReactPdf = readJson("node_modules/react-pdf/package.json");
const installedPdfjs = readJson("node_modules/pdfjs-dist/package.json");
const installedRenderer = readJson(
  "node_modules/@react-pdf/renderer/package.json",
);
const updatedPackageJson = readJson("package.json");
if (
  installedReactPdf.version !== reactPdfVersion ||
  installedReactPdf.dependencies["pdfjs-dist"] !== installedPdfjs.version ||
  installedPdfjs.version !== pdfjsVersion ||
  installedRenderer.version !== rendererVersion ||
  updatedPackageJson.dependencies["react-pdf"] !== reactPdfVersion ||
  updatedPackageJson.dependencies["pdfjs-dist"] !== pdfjsVersion ||
  updatedPackageJson.dependencies["@react-pdf/renderer"] !== rendererRange
) {
  throw new Error(
    "Installed PDF dependencies do not match the requested update.",
  );
}

const changed = reactPdfChanged || rendererChanged;

console.log(
  changed
    ? [
        reactPdfChanged
          ? `React-PDF ${currentReactPdf.version} -> ${reactPdfVersion}, PDF.js ${pdfjsVersion}`
          : `React-PDF ${reactPdfVersion} and PDF.js ${pdfjsVersion} unchanged`,
        rendererChanged
          ? `@react-pdf/renderer ${currentRenderer.version} -> ${rendererVersion}`
          : `@react-pdf/renderer ${rendererVersion} unchanged`,
      ].join("; ")
    : `PDF dependencies are current: React-PDF ${reactPdfVersion}, PDF.js ${pdfjsVersion}, @react-pdf/renderer ${rendererVersion}.`,
);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    [
      `changed=${changed}`,
      `react_pdf_changed=${reactPdfChanged}`,
      `renderer_changed=${rendererChanged}`,
      `react_pdf_version=${reactPdfVersion}`,
      `pdfjs_version=${pdfjsVersion}`,
      `renderer_version=${rendererVersion}`,
      "",
    ].join("\n"),
  );
}
