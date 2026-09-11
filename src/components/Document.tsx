import React from "react";
import DocumentView from "fragments/Document";
import type { DocumentProps } from "props/Document";

/** Loads a PDF and provides React-PDF document context to Page, Thumbnail, and Outline children. */
const Document = (props: DocumentProps) => <DocumentView {...props} />;

export default Document;
