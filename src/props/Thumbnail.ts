import type {
  PDFDashBaseProps,
  PDFErrorData,
  PDFItemClickData,
  PDFPageColors,
  PDFPageData,
} from "props/shared/pdf";

export interface ThumbnailProps extends PDFDashBaseProps {
  /** Canvas background color. */
  canvasBackground?: string;
  /** Physical-pixel to CSS-pixel ratio. Defaults to window.devicePixelRatio. */
  devicePixelRatio?: number;
  /** Thumbnail height. Ignored when width is provided. */
  height?: number;
  /** Colors used to render the thumbnail. */
  pageColors?: PDFPageColors;
  /** Zero-based page index. Ignored when pageNumber is provided. Defaults to 0. */
  pageIndex?: number;
  /** One-based page number. Defaults to 1. */
  pageNumber?: number;
  /** Thumbnail rendering mode. Custom render functions are not JSON-safe, so Dash supports canvas and none. Defaults to canvas. */
  renderMode?: "canvas" | "none";
  /** Thumbnail rotation in degrees. Defaults to 0. */
  rotate?: number | null;
  /** Thumbnail scale. Defaults to 1. */
  scale?: number;
  /** Thumbnail width. */
  width?: number;
  /** Latest loaded page dimensions. Read-only. */
  loadData?: PDFPageData | null;
  /** Latest loaded thumbnail dimensions. Read-only. loadData is a deprecated alias. */
  pageData?: PDFPageData | null;
  /** Latest rendered page dimensions. Read-only. */
  renderData?: PDFPageData | null;
  /** Latest thumbnail error. Read-only. */
  errorData?: PDFErrorData | null;
  /** Latest thumbnail click. Read-only. */
  itemClickData?: PDFItemClickData | null;
}
