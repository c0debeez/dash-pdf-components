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
export interface SvgProps extends NodeIdentity {
  /** Enables debug mode on page bounding box.  */
  debug?: boolean;
  /** Renderer width property.  */
  width?: string | number;
  /** Renderer height property.  */
  height?: string | number;
  /** Renderer viewBox property.  */
  viewBox?: string;
  /** Renderer preserveAspectRatio property.  */
  preserveAspectRatio?: string;
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
  /** Renderer fill property.  */
  fill?: string;
  /** Renderer color property.  */
  color?: string;
  /** Renderer stroke property.  */
  stroke?: string;
  /** Renderer transform property.  */
  transform?: string;
  /** Renderer strokeDasharray property.  */
  strokeDasharray?: string;
  /** Renderer opacity property.  */
  opacity?: string | number;
  /** Renderer strokeWidth property.  */
  strokeWidth?: string | number;
  /** Renderer fillOpacity property.  */
  fillOpacity?: string | number;
  /** Renderer fillRule property.  */
  fillRule?: "nonzero" | "evenodd";
  /** Renderer strokeOpacity property.  */
  strokeOpacity?: string | number;
  /** Renderer textAnchor property.  */
  textAnchor?: "start" | "middle" | "end";
  /** Renderer strokeLinecap property.  */
  strokeLinecap?: "butt" | "round" | "square";
  /** Renderer strokeLinejoin property.  */
  strokeLinejoin?: "butt" | "round" | "square" | "miter" | "bevel";
  /** Renderer visibility property.  */
  visibility?: "visible" | "hidden" | "collapse";
  /** Renderer clipPath property.  */
  clipPath?: string;
  /** Renderer markerStart property.  */
  markerStart?: string;
  /** Renderer markerMid property.  */
  markerMid?: string;
  /** Renderer markerEnd property.  */
  markerEnd?: string;
  /** Renderer dominantBaseline property.  */
  dominantBaseline?:
    | "middle"
    | "auto"
    | "central"
    | "hanging"
    | "mathematical"
    | "text-after-edge"
    | "text-before-edge";
  /** PDF child nodes where supported by this primitive. */
  children?: React.ReactNode;
}
