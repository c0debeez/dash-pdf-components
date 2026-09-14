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
export interface ImageProps extends NodeIdentity {
  /** Enables debug mode on page bounding box.  */
  debug?: boolean;
  /** Renderer cache property.  */
  cache?: boolean;
  /** A comma-separated list of image sources with width descriptors.
Works like the HTML img srcSet attribute.  */
  srcSet?: string;
  /** The intended display width of the image, used to select the best source
from srcSet. Accepts a number (in points) or a string.
Works like the HTML img sizes attribute.  */
  sizes?: string | number;
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
  /** Renderer src property. URL/data URL, request dictionary, {data: base64, format}, byte list or named (possibly async) source function. */
  src?: ImageSource | FunctionProps;
  /** Renderer source property. URL/data URL, request dictionary, {data: base64, format}, byte list or named (possibly async) source function. */
  source?: ImageSource | FunctionProps;
  /** PDF child nodes where supported by this primitive. */
  children?: React.ReactNode;
  /** SVG image coordinate, supported by the browser implementation. */
  x?: string | number;
  /** SVG image coordinate, supported by the browser implementation. */
  y?: string | number;
}
