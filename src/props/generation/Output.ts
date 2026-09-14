import React from "react";
import { DashBaseProps, FunctionProps } from "./shared/dash";
export interface OutputProps extends DashBaseProps {
  /** PDF document. Standard input for PDFDownloadLink and BlobProvider; also accepted by PDFViewer. */
  document?: React.ReactNode;
  /** Viewer Document or download/status HTML UI. Legacy Document children are accepted only without document. */
  children?: React.ReactNode;
  /** Named function producing DOM UI from {loading, error, url, size, data}. */
  render?: FunctionProps;
  /** CSS styles on the HTML container (viewer/provider) or download anchor. */
  style?: Record<string, any>;
  /** HTML class name. */
  className?: string;
  /** Download filename. Default: document.pdf. */
  fileName?: string;
  /** Preview height in pixels or CSS length. Default: 700. */
  height?: number | string;
  /** Preview width. Default: 100%. */
  width?: number | string;
  /** Preview style. Default: playground; native uses the browser PDF viewer. */
  previewMode?: "playground" | "native";
  /** Controlled preview page, starting at 1. Default: 1. */
  pageNumber?: number;
  /** Read-only loaded preview page count. */
  numPages?: number;
  /** Stable iframe DOM ID, replacing a non-serializable innerRef. */
  frameId?: string;
  /** Include a download link with a preview. Default: true. */
  showDownload?: boolean;
  /** Default download text. */
  downloadLabel?: string;
  /** Show floating page controls, or native browser toolbar hint. Default: true. */
  showToolbar?: boolean;
  /** Font registrations with family and either src or fonts. Font request options match renderer. */
  fonts?: Record<string, any>[];
  /** Emoji URL configuration, or {builder: {function, options}}. */
  emojiSource?: Record<string, any>;
  /** Job-scoped named global hyphenation function. Omit for renderer default. */
  hyphenationCallback?: FunctionProps;
  /** Explicit font operation performed before generation. clear restores standard fonts before registering fonts. */
  fontAction?: "load" | "reset" | "clear";
  /** Font descriptors for load or diagnostic getFont calls: fontFamily/fontWeight/fontStyle. */
  fontDescriptors?: Record<string, any>[];
  /** Generate automatically when document or configuration changes. Default: true. */
  autoGenerate?: boolean;
  /** Change this counter to generate manually, adapting usePDF update/pdf.updateContainer. */
  n_generate?: number;
  /** Read-only count of latest successful generations; adapts Document.onRender. */
  n_render?: number;
  /** Read-only number of download anchor clicks. */
  n_clicks?: number;
  /** Read-only generation loading state, distinct from Dash callback loading. */
  loading?: boolean;
  /** Read-only error message or null. */
  error?: string | null;
  /** Read-only current browser-local Blob URL; revoked on replacement or unmount. */
  url?: string | null;
  /** Read-only byte count. */
  size?: number;
  /** Opt in to Base64 transmission to Python callbacks. Default: false. */
  returnBase64?: boolean;
  /** Read-only Base64 PDF when enabled. */
  data?: string | null;
  /** Read-only renderer version. */
  rendererVersion?: string;
  /** Read-only registered family names after generation. */
  fontFamilies?: string[];
  /** Read-only serializable font-source diagnostics (no fontkit objects). */
  fontInfo?: Record<string, any>;
}
