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
export interface RadialGradientProps extends NodeIdentity {
  /** Renderer id property. Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. */
  id?: string | Record<string, any>;
  /** Renderer cx property.  */
  cx?: string | number;
  /** Renderer cy property.  */
  cy?: string | number;
  /** Renderer r property.  */
  r?: string | number;
  /** Renderer fx property.  */
  fx?: string | number;
  /** Renderer fy property.  */
  fy?: string | number;
  /** Renderer xlinkHref property.  */
  xlinkHref?: string;
  /** Renderer gradientTransform property.  */
  gradientTransform?: string;
  /** Renderer gradientUnits property.  */
  gradientUnits?: "userSpaceOnUse" | "objectBoundingBox";
  /** PDF child nodes where supported by this primitive. */
  children?: React.ReactNode;
}
