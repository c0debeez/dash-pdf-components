import React from "react";
import PDFController from "fragments/PDFController";
import type { PDFProps } from "props/PDF";

/** Displays an existing PDF or generates one from a Document description, with optional download or Blob output. */
const PDF = (props: PDFProps) => <PDFController {...props} />;
export default PDF;
