import type React from "react";
import type {
  PDFDashBaseProps,
  PDFErrorData,
  PDFPageColors,
  PDFPageData,
} from "props/shared/pdf";

export interface PDFLayerData {
  /** One-based page number associated with this result. */
  pageNumber: number;
  /** Layer that finished loading or rendering. */
  layer: "annotations" | "text";
  /** Number of loaded items when available. */
  count?: number;
}

export interface PageProps extends PDFDashBaseProps {
  /** Additional content rendered inside the page. */
  children?: React.ReactNode;
  /** Canvas background color. */
  canvasBackground?: string;
  /** Physical-pixel to CSS-pixel ratio. Defaults to window.devicePixelRatio. */
  devicePixelRatio?: number;
  /** Page height. Ignored when width is provided. */
  height?: number;
  /** Path prefixed to annotation image URLs. */
  imageResourcesPath?: string;
  /** Colors used to render the page. */
  pageColors?: PDFPageColors;
  /** Zero-based page index. Ignored when pageNumber is provided. Defaults to 0. */
  pageIndex?: number;
  /** One-based page number. Defaults to 1. */
  pageNumber?: number;
  /** Whether links and annotations are rendered. Defaults to true. */
  renderAnnotationLayer?: boolean;
  /** Whether interactive PDF forms are rendered. renderAnnotationLayer must also be true. Defaults to false. */
  renderForms?: boolean;
  /** Page rendering mode. Custom render functions are not JSON-safe, so Dash supports canvas and none. Defaults to canvas. */
  renderMode?: "canvas" | "none";
  /** Whether selectable and searchable text is rendered. Defaults to true. */
  renderTextLayer?: boolean;
  /** Page rotation in degrees. Defaults to 0. */
  rotate?: number | null;
  /** Page scale. Defaults to 1. */
  scale?: number;
  /** Page width. */
  width?: number;
  /** Latest loaded page dimensions. Read-only. */
  loadData?: PDFPageData | null;
  /** Latest loaded page dimensions. Read-only. loadData is a deprecated alias. */
  pageData?: PDFPageData | null;
  /** Latest rendered page dimensions. Read-only. */
  renderData?: PDFPageData | null;
  /** Latest page or layer error. Read-only. */
  errorData?: PDFErrorData | null;
  /** Latest annotation-layer result. Read-only. */
  annotationsData?: PDFLayerData | null;
  /** Latest text-layer result. Read-only. */
  textData?: PDFLayerData | null;
}
