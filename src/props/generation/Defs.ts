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
export interface DefsProps extends NodeIdentity {
  /** PDF child nodes where supported by this primitive. */
  children?: React.ReactNode;
}
