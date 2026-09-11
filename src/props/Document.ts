import type React from "react";
import type {
  PDFDashBaseProps,
  PDFDocumentOptions,
  PDFErrorData,
  PDFFile,
  PDFItemClickData,
} from "props/shared/pdf";

export interface DocumentLoadData {
  /** Number of pages in the loaded document. */
  numPages: number;
  /** PDF fingerprints when available. */
  fingerprints: Array<string | null>;
}

export interface DocumentProgressData {
  /** Number of bytes loaded. */
  loaded: number;
  /** Total number of bytes, when known. */
  total: number;
}

export interface DocumentPasswordData {
  /** Password challenge reported by PDF.js. */
  reason: "need-password" | "incorrect-password";
}

export interface DocumentProps extends PDFDashBaseProps {
  /** Page, Thumbnail, or Outline components rendered inside the document context. */
  children?: React.ReactNode;
  /** PDF source: URL, base64 data URI, or an object containing url or byte-array data. null clears the document. Cross-origin URLs require CORS. */
  file?: string | PDFFile | null;
  /** JSON-safe React-PDF Document options. Package-local CMaps, standard fonts, WASM, ICC profiles, and annotation images are supplied by default. */
  options?: PDFDocumentOptions;
  /** Base URL containing the pdfjs-dist package directories. Defaults to assets installed with this package. Set this to a version-matched CDN root to replace all auxiliary assets. */
  assetBaseUrl?: string;
  /** PDF.js module Worker URL. Defaults to the Worker installed with this package. */
  workerSrc?: string;
  /** Path prefixed to annotation image URLs. Defaults to the package annotation image directory. */
  imageResourcesPath?: string;
  /** Link rel used by external links in annotations. Defaults to noopener noreferrer nofollow. */
  externalLinkRel?: string;
  /** Link target used by external links in annotations. */
  externalLinkTarget?: "_self" | "_blank" | "_parent" | "_top";
  /** Document rendering mode. Custom render functions are not JSON-safe, so Dash supports canvas and none. Defaults to canvas. */
  renderMode?: "canvas" | "none";
  /** Global document rotation in degrees. */
  rotate?: number | null;
  /** Global document scale. Defaults to 1. */
  scale?: number;
  /** Password submitted after React-PDF requests one. It is not copied into callback output properties. */
  password?: string;
  /** Number of pages in the loaded document. Read-only. */
  numPages?: number | null;
  /** Loaded document metadata. Read-only. */
  loadData?: DocumentLoadData | null;
  /** Latest loading progress. Read-only. */
  loadProgress?: DocumentProgressData | null;
  /** Whether React-PDF retrieved the current source. Read-only. */
  sourceLoaded?: boolean;
  /** Latest document or source error. Read-only. */
  errorData?: PDFErrorData | null;
  /** Latest password challenge. Read-only. */
  passwordData?: DocumentPasswordData | null;
  /** Latest internal-link, Outline, or Thumbnail navigation event. Navigation is handled automatically; use this read-only value to observe it. */
  itemClickData?: PDFItemClickData | null;
}
