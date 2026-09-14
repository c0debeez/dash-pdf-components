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
export interface CanvasProps extends NodeIdentity {
  /** Enables debug mode on page bounding box.  */
  debug?: boolean;
  /** Renderer paint property. Named registry function, original arguments followed by options and context. */
  paint?: FunctionProps;
  /** Renderer id property. Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. */
  id?: string | Record<string, any>;
  /** Renderer style property. Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. */
  style?: PDFStyle | PDFStyle[];
  /** Render component in all wrapped pages.  */
  fixed?: boolean;
  /** Force the wrapping algorithm to start a new page when rendering the
element.  */
  break?: boolean;
  /** Hint that no page wrapping should occur between all sibling elements following the element within n points  */
  minPresenceAhead?: number;
  /** PDF child nodes where supported by this primitive. */
  children?: React.ReactNode;
  /** Ordered JSON drawing operations: [{method, args}]. Mutually exclusive with paint. */
  operations?: { method: string; args?: any[] }[];
}
