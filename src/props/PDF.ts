import type React from "react";
import type {
  DocumentLoadData,
  DocumentPasswordData,
  DocumentProgressData,
} from "props/Document";
import type { PDFLayerData } from "props/Page";
import type {
  PDFDashBaseProps,
  PDFDocumentOptions,
  PDFErrorData,
  PDFFile,
  PDFItemClickData,
  PDFPageColors,
  PDFPageData,
} from "props/shared/pdf";

/** Props for the common single-page PDF viewer. */
export interface PDFProps extends PDFDashBaseProps {
  /** Additional content rendered inside the page. */
  children?: React.ReactNode;
  /** PDF source: URL, base64 data URI, or an object containing url or byte-array data. null clears the viewer. */
  file?: string | PDFFile | null;
  /** One-based current page number. Defaults to 1 and updates when an internal PDF link is followed. */
  pageNumber?: number;
  /** Page width. */
  width?: number;
  /** Page height. Ignored when width is provided. */
  height?: number;
  /** Page scale. Defaults to 1. */
  scale?: number;
  /** Page rotation in degrees. Defaults to 0. */
  rotate?: number | null;
  /** Whether selectable and searchable text is rendered. Defaults to true. */
  renderTextLayer?: boolean;
  /** Whether links and annotations are rendered. Defaults to true. */
  renderAnnotationLayer?: boolean;
  /** Whether interactive PDF forms are rendered. renderAnnotationLayer must also be true. Defaults to false. */
  renderForms?: boolean;
  /** Rendering mode. Custom render functions are not JSON-safe, so Dash supports canvas and none. Defaults to canvas. */
  renderMode?: "canvas" | "none";
  /** Canvas background color. */
  canvasBackground?: string;
  /** Physical-pixel to CSS-pixel ratio. Defaults to window.devicePixelRatio. */
  devicePixelRatio?: number;
  /** Colors used to render the page. */
  pageColors?: PDFPageColors;
  /** JSON-safe React-PDF Document options. Package-local PDF.js assets are supplied by default. */
  options?: PDFDocumentOptions;
  /** Base URL containing version-matched PDF.js assets. Defaults to assets installed with this package. */
  assetBaseUrl?: string;
  /** PDF.js module Worker URL. Defaults to the Worker installed with this package. */
  workerSrc?: string;
  /** Path prefixed to annotation image URLs. Defaults to the package annotation image directory. */
  imageResourcesPath?: string;
  /** Link rel used by external links in annotations. Defaults to noopener noreferrer nofollow. */
  externalLinkRel?: string;
  /** Link target used by external links in annotations. */
  externalLinkTarget?: "_self" | "_blank" | "_parent" | "_top";
  /** Password submitted after React-PDF requests one. It is not copied into callback output properties. */
  password?: string;
  /** Number of pages in the loaded document. Read-only. */
  numPages?: number | null;
  /** Loaded document metadata. Read-only. */
  documentData?: DocumentLoadData | null;
  /** Latest document loading progress. Read-only. */
  loadProgress?: DocumentProgressData | null;
  /** Whether React-PDF retrieved the current source. Read-only. */
  sourceLoaded?: boolean;
  /** Latest document, page, or layer error. Read-only. */
  errorData?: PDFErrorData | null;
  /** Latest password challenge. Read-only. */
  passwordData?: DocumentPasswordData | null;
  /** Latest internal-link navigation event. Read-only. */
  itemClickData?: PDFItemClickData | null;
  /** Latest loaded page dimensions. Read-only. */
  pageData?: PDFPageData | null;
  /** Latest rendered page dimensions. Read-only. */
  renderData?: PDFPageData | null;
  /** Latest annotation-layer result. Read-only. */
  annotationsData?: PDFLayerData | null;
  /** Latest text-layer result. Read-only. */
  textData?: PDFLayerData | null;
  /** Content displayed while React-PDF is loading. Defaults to the current Dash loading state when omitted. */
  loading?: React.ReactNode;
}
