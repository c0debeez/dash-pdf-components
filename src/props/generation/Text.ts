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
export interface TextProps extends NodeIdentity {
  /** Renderer id property. Dash identity; string also defaults to PDF/SVG ID. pdfId overrides the PDF/SVG identity; object IDs never enter renderer. */
  id?: string | Record<string, any>;
  /** Enable/disable page wrapping for element.  */
  wrap?: boolean;
  /** Enables debug mode on page bounding box.  */
  debug?: boolean;
  /** Renderer render property. Named registry function, original arguments followed by options and context. */
  render?: FunctionProps;
  /** Override the default hyphenation-callback Named registry function, original arguments followed by options and context. */
  hyphenationCallback?: FunctionProps;
  /** Override the default hyphenation penalty
Defaults to 100 for justified text and 600 otherwise.  */
  hyphenationPenalty?: number;
  /** Specifies the minimum number of lines in a text element that must be shown at the bottom of a page or its container.  */
  orphans?: number;
  /** Specifies the minimum number of lines in a text element that must be shown at the top of a page or its container..  */
  widows?: number;
  /** Renderer style property. Typed PDF/SVG style dictionary or list; StyleSheet.create is represented by dictionaries. */
  style?: PDFStyle | PDFStyle[];
  /** Render component in all wrapped pages.  */
  fixed?: boolean;
  /** Force the wrapping algorithm to start a new page when rendering the
element.  */
  break?: boolean;
  /** Hint that no page wrapping should occur between all sibling elements following the element within n points  */
  minPresenceAhead?: number;
  /** Renderer x property.  */
  x?: string | number;
  /** Renderer y property.  */
  y?: string | number;
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
  /** Dynamic page text. Mutually exclusive with render. */
  renderTemplate?: string;
}
