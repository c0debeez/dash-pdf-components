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
export interface LinearGradientProps extends NodeIdentity {
  /** Renderer id property. Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. */
  id?: string | Record<string, any>;
  /** Renderer x1 property.  */
  x1?: string | number;
  /** Renderer x2 property.  */
  x2?: string | number;
  /** Renderer y1 property.  */
  y1?: string | number;
  /** Renderer y2 property.  */
  y2?: string | number;
  /** Renderer xlinkHref property.  */
  xlinkHref?: string;
  /** Renderer gradientTransform property.  */
  gradientTransform?: string;
  /** Renderer gradientUnits property.  */
  gradientUnits?: "userSpaceOnUse" | "objectBoundingBox";
  /** PDF child nodes where supported by this primitive. */
  children?: React.ReactNode;
}
