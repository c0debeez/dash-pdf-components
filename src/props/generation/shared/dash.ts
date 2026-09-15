import type * as Renderer from "@react-pdf/renderer";
export type PDFStyle = Renderer.Styles[string] & Record<string, any>;
export interface FunctionProps {
  /** Own function path in window.dashPdfComponentsFunctions. */
  function: string;
  /** JSON options appended after the original callback arguments. */
  options?: Record<string, any>;
}
export interface Permissions {
  printing?: "lowResolution" | "highResolution";
  modifying?: boolean;
  copying?: boolean;
  annotating?: boolean;
  fillingForms?: boolean;
  contentAccessibility?: boolean;
  documentAssembly?: boolean;
}
export interface Bookmark {
  title: string;
  top?: number;
  left?: number;
  zoom?: number;
  fit?: boolean;
  expanded?: boolean;
}
export type ImageSource =
  | string
  | number[]
  | {
      uri?: string;
      method?: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";
      body?: any;
      headers?: Record<string, string>;
      credentials?: "omit" | "same-origin" | "include";
      data?: string | number[];
      format?: "png" | "jpg";
    };
export interface DashBaseProps {
  /** Dash callback identity. */
  id?: string | Record<string, any>;
  /** React key for reconciliation. */
  key?: string | number;
  /** Updates JSON-safe Dash properties. */
  setProps?: (props: Record<string, any>) => void;
}
export interface NodeIdentity extends DashBaseProps {
  /** PDF destination or SVG identifier; overrides string id. Object Dash IDs are not PDF identifiers. */
  pdfId?: string;
}
