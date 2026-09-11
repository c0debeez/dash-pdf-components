import type React from "react";
import type { DashBaseProps } from "props/shared/dash";

export type PDFFile =
  | {
      /** PDF URL. */
      url: string;
    }
  | {
      /** PDF bytes as a JSON array of integers from 0 to 255. */
      data: number[];
    };

export interface PDFErrorData {
  /** Operation that failed. */
  stage: string;
  /** JavaScript error name. */
  name: string;
  /** Human-readable error message. */
  message: string;
}

export interface PDFItemClickData {
  /** Zero-based destination page index. */
  pageIndex: number;
  /** One-based destination page number. */
  pageNumber: number;
  /** Event timestamp in milliseconds. Allows repeated clicks on the same item to trigger Dash callbacks. */
  timestamp: number;
}

export interface PDFPageData {
  /** One-based page number. */
  pageNumber: number;
  /** Rendered page width. */
  width: number;
  /** Rendered page height. */
  height: number;
  /** Unscaled page width. */
  originalWidth: number;
  /** Unscaled page height. */
  originalHeight: number;
}

export interface PDFPageColors {
  /** Page background color. */
  background: string;
  /** Page foreground color. */
  foreground: string;
}

export interface PDFDocumentOptions {
  /** URL of the predefined Adobe CMaps directory. */
  cMapUrl?: string | null;
  /** Whether CMaps are binary packed. Defaults to true when package assets are used. */
  cMapPacked?: boolean | null;
  /** URL of the standard PDF fonts directory. */
  standardFontDataUrl?: string | null;
  /** URL of the WebAssembly support files directory. */
  wasmUrl?: string | null;
  /** URL of the ICC color profiles directory. */
  iccUrl?: string | null;
  /** HTTP headers sent while loading the document. */
  httpHeaders?: Record<string, string> | null;
  /** Whether cross-origin requests include credentials. Defaults to false. */
  withCredentials?: boolean | null;
  /** Password used to open an encrypted PDF. */
  password?: string | null;
  /** Disable evaluation of embedded JavaScript expressions. Defaults to false in this package. */
  isEvalSupported?: boolean | null;
  /** Additional JSON-safe PDF.js document options. */
  [key: string]: unknown;
}

export interface PDFDashBaseProps extends DashBaseProps {
  /** Content displayed while the React-PDF component is loading. */
  loading?: React.ReactNode;
  /** Content displayed when the React-PDF component fails. */
  error?: React.ReactNode;
  /** Content displayed when no document or page is provided. */
  noData?: React.ReactNode;
}
