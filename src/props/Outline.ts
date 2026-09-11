import type { DashBaseProps } from "props/shared/dash";
import type { PDFErrorData, PDFItemClickData } from "props/shared/pdf";

export interface PDFOutlineItem {
  /** Outline title. */
  title: string;
  /** Whether the title uses bold text. */
  bold: boolean;
  /** Whether the title uses italic text. */
  italic: boolean;
  /** External URL associated with the item, when available. */
  url?: string | null;
  /** Nested outline items with the same JSON-safe structure. */
  items: unknown[];
}

export interface OutlineProps extends DashBaseProps {
  /** Serialized table of contents. Read-only. */
  outlineData?: PDFOutlineItem[] | null;
  /** Latest outline item click. Read-only. */
  itemClickData?: PDFItemClickData | null;
  /** Latest outline loading error. Read-only. */
  errorData?: PDFErrorData | null;
}
