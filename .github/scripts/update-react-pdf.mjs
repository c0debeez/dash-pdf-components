import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const current = readJson("node_modules/react-pdf/package.json");
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
const version = latest.version;
const pdfjsVersion = latest["dependencies.pdfjs-dist"];
// React-PDF pins PDF.js exactly; reject ranges rather than selecting an incompatible Worker.
const stableVersion = /^\d+\.\d+\.\d+$/;
if (!stableVersion.test(version) || !stableVersion.test(pdfjsVersion)) {
  throw new Error(
    "Expected stable, exact React-PDF and PDF.js versions from npm.",
  );
}

const changed = current.version !== version;
if (changed) {
  execFileSync(
    "pnpm",
    [
      "add",
      `react-pdf@^${version}`,
      `pdfjs-dist@${pdfjsVersion}`,
      "--save-prod",
    ],
    {
      stdio: "inherit",
    },
  );
  const installed = readJson("node_modules/react-pdf/package.json");
  const installedPdfjs = readJson("node_modules/pdfjs-dist/package.json");
  if (
    installed.version !== version ||
    installed.dependencies["pdfjs-dist"] !== installedPdfjs.version
  ) {
    throw new Error(
      "Installed React-PDF and PDF.js versions do not match the requested update.",
    );
  }
}

console.log(
  changed
    ? `Updated React-PDF ${current.version} -> ${version}, PDF.js ${pdfjsVersion}`
    : `React-PDF ${version} is current.`,
);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `changed=${changed}\nversion=${version}\npdfjs-version=${pdfjsVersion}\n`,
  );
}
