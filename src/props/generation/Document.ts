// Synced by scripts/sync_api.cjs.
import React from "react";
import {
  NodeIdentity,
  PDFStyle,
  FunctionProps,
  ImageSource,
  Bookmark,
  Permissions,
} from "./shared/dash";
export interface DocumentProps extends NodeIdentity {
  /** Renderer style property. Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. */
  style?: PDFStyle | PDFStyle[];
  /** Renderer title property.  */
  title?: string;
  /** Renderer author property.  */
  author?: string;
  /** Renderer subject property.  */
  subject?: string;
  /** Renderer creator property.  */
  creator?: string;
  /** Renderer keywords property.  */
  keywords?: string;
  /** Renderer producer property.  */
  producer?: string;
  /** Renderer language property.  */
  language?: string;
  /** Renderer creationDate property. ISO 8601 string validated and converted to Date. */
  creationDate?: string;
  /** Renderer modificationDate property. ISO 8601 string validated and converted to Date. */
  modificationDate?: string;
  /** Renderer pdfVersion property.  */
  pdfVersion?: "1.3" | "1.4" | "1.5" | "1.6" | "1.7" | "1.7ext3";
  /** Renderer conformance property.  */
  conformance?:
    "PDF/A-1" | "PDF/A-1b" | "PDF/A-2" | "PDF/A-2b" | "PDF/A-3" | "PDF/A-3b";
  /** Renderer pageMode property.  */
  pageMode?:
    | "useNone"
    | "useOutlines"
    | "useThumbs"
    | "fullScreen"
    | "useOC"
    | "useAttachments";
  /** Renderer pageLayout property.  */
  pageLayout?:
    | "singlePage"
    | "oneColumn"
    | "twoColumnLeft"
    | "twoColumnRight"
    | "twoPageLeft"
    | "twoPageRight";
  /** Renderer ownerPassword property.  */
  ownerPassword?: string;
  /** Renderer userPassword property.  */
  userPassword?: string;
  /** Renderer permissions property.  */
  permissions?: Permissions;
  /** Renderer onRender property. Named registry function, original arguments followed by options and context. */
  onRender?: FunctionProps;
  /** PDF child nodes where supported by this primitive. */
  children?: React.ReactNode;
}
