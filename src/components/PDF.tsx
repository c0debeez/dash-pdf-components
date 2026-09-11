import React from "react";
import PDFView from "fragments/PDF";
import type { PDFProps } from "props/PDF";

/** Renders a common single-page PDF viewer with document and page state exposed as one Dash component. */
const PDF = (props: PDFProps) => <PDFView {...props} />;

export default PDF;
