import React from "react";
import PDFView from "fragments/PDF";
import type { PDFProps } from "props/PDF";

/** Renders the current page, all pages, or selected PDF pages with automatic sizing and navigation. */
const PDF = (props: PDFProps) => <PDFView {...props} />;

export default PDF;
