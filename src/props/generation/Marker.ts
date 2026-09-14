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
export interface MarkerProps extends NodeIdentity {
  /** Renderer id property. Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. */
  id?: string | Record<string, any>;
  /** Renderer viewBox property.  */
  viewBox?: string;
  /** Renderer refX property.  */
  refX?: string | number;
  /** Renderer refY property.  */
  refY?: string | number;
  /** Renderer markerWidth property.  */
  markerWidth?: string | number;
  /** Renderer markerHeight property.  */
  markerHeight?: string | number;
  /** Renderer orient property.  */
  orient?: number | "auto" | "auto-start-reverse";
  /** Renderer markerUnits property.  */
  markerUnits?: "strokeWidth" | "userSpaceOnUse";
  /** PDF child nodes where supported by this primitive. */
  children?: React.ReactNode;
}
