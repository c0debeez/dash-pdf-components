import { createContext } from "react";

export interface RegisteredPDFPage {
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  scrollIntoView: () => void;
}

export interface PDFNavigationContextValue {
  registerPage: (key: symbol, page: RegisteredPDFPage) => () => void;
}

export const PDFNavigationContext =
  createContext<PDFNavigationContextValue | null>(null);
