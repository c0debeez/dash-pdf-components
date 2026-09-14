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
export interface StopProps extends NodeIdentity {
  /** Renderer offset property.  */
  offset?: string | number;
  /** Renderer stopColor property.  */
  stopColor?: string;
  /** Renderer stopOpacity property.  */
  stopOpacity?: string | number;
  /** PDF child nodes where supported by this primitive. */
  children?: React.ReactNode;
}
