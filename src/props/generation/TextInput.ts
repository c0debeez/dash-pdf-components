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
export interface TextInputProps extends NodeIdentity {
  /** Renderer align property.  */
  align?: "left" | "center" | "right";
  /** Renderer multiline property.  */
  multiline?: boolean;
  /** The text will be masked (e.g. with asterisks).  */
  password?: boolean;
  /** If set, text entered in the field is not spell-checked  */
  noSpell?: boolean;
  /** Renderer format property.  */
  format?: {
    type:
      | "number"
      | "date"
      | "time"
      | "percent"
      | "zip"
      | "zipPlus4"
      | "phone"
      | "ssn";
    param?: string;
    nDec?: number;
    sepComma?: boolean;
    negStyle?: "MinusBlack" | "Red" | "ParensBlack" | "ParensRed";
    currency?: string;
    currencyPrepend?: boolean;
  };
  /** Sets the fontSize (default or 0 means auto sizing)  */
  fontSize?: number;
  /** Sets the maximum length (characters) of the text in the field  */
  maxLength?: number;
  /** Renderer name property.  */
  name?: string;
  /** Renderer required property.  */
  required?: boolean;
  /** Renderer noExport property.  */
  noExport?: boolean;
  /** Renderer readOnly property.  */
  readOnly?: boolean;
  /** Renderer value property.  */
  value?: string | number;
  /** Renderer defaultValue property.  */
  defaultValue?: string | number;
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
