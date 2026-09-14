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
export interface PageProps extends NodeIdentity {
  /** Enable page wrapping for this page.  */
  wrap?: boolean;
  /** A template component rendered around every page this Page produces.
Where it renders `children` is where page content flows; everything
else repeats as page chrome with its space reserved. Like render
props, layout components may not use hooks. Implies
`experimentalPagination`. Named registry function, original arguments followed by options and context. */
  layout?: FunctionProps;
  /** Opt the document into the new pagination engine: content is measured
once and packed into pages, dramatically faster on long documents.
Any page opting in switches the whole document. Implied by `layout`.  */
  experimentalPagination?: boolean;
  /** Enables debug mode on page bounding box.  */
  debug?: boolean;
  /** Renderer size property.  */
  size?:
    | string
    | (string | number)[]
    | { width: string | number; height?: string | number };
  /** Renderer orientation property.  */
  orientation?: "portrait" | "landscape";
  /** Renderer dpi property.  */
  dpi?: number;
  /** Renderer bookmark property.  */
  bookmark?: string | Bookmark;
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
}
