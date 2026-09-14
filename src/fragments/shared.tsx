import React, { useRef } from "react";
import { pdfjs } from "react-pdf";
import defaultWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?asset";
import type { DashBaseProps } from "props/shared/dash";
import type {
  PDFDocumentOptions,
  PDFErrorData,
  PDFItemClickData,
  PDFPageData,
} from "props/shared/pdf";
import { getLoadingState } from "utils/dash";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

const localAssetBaseUrl = new URL("../", defaultWorkerSrc).toString();

const withTrailingSlash = (value: string) =>
  value.endsWith("/") ? value : `${value}/`;

const deepEqual = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) return true;
  if (!left || !right || typeof left !== "object" || typeof right !== "object")
    return false;
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => deepEqual(value, right[index]))
    );
  }
  const a = left as Record<string, unknown>;
  const b = right as Record<string, unknown>;
  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(b, key) &&
        deepEqual(a[key], b[key]),
    )
  );
};

export const useStableValue = <T,>(value: T): T => {
  const reference = useRef(value);
  if (!deepEqual(reference.current, value)) reference.current = value;
  return reference.current;
};

export const configurePdfAssets = (
  options: PDFDocumentOptions = {},
  assetBaseUrl?: string,
  workerSrc?: string,
) => {
  const base = withTrailingSlash(assetBaseUrl?.trim() || localAssetBaseUrl);
  pdfjs.GlobalWorkerOptions.workerSrc =
    workerSrc?.trim() ||
    (assetBaseUrl ? `${base}build/pdf.worker.min.mjs` : defaultWorkerSrc);
  return {
    cMapUrl: `${base}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${base}standard_fonts/`,
    wasmUrl: `${base}wasm/`,
    iccUrl: `${base}iccs/`,
    isEvalSupported: false,
    ...options,
  };
};

export const annotationImagesPath = (assetBaseUrl?: string) =>
  `${withTrailingSlash(assetBaseUrl?.trim() || localAssetBaseUrl)}web/images/`;

export const errorData = (stage: string, value: unknown): PDFErrorData => {
  const error = value instanceof Error ? value : new Error(String(value));
  return { stage, name: error.name, message: error.message };
};

let lastItemClickTimestamp = 0;

export const itemClickData = (
  pageIndex: number,
  pageNumber: number,
): PDFItemClickData => {
  lastItemClickTimestamp = Math.max(Date.now(), lastItemClickTimestamp + 1);
  return { pageIndex, pageNumber, timestamp: lastItemClickTimestamp };
};

export const pageData = (page: {
  pageNumber: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}): PDFPageData => ({
  pageNumber: page.pageNumber,
  width: page.width,
  height: page.height,
  originalWidth: page.originalWidth,
  originalHeight: page.originalHeight,
});

export const DashContainer = ({
  children,
  id,
  className,
  style,
  loading_state,
  containerRef,
  onScroll,
  setProps: _setProps,
  ...attributes
}: DashBaseProps & {
  children: React.ReactNode;
  containerRef?: React.Ref<HTMLDivElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}) => {
  const loading = getLoadingState(loading_state);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      {...attributes}
      id={id}
      className={className}
      style={style}
      data-dash-is-loading={loading || undefined}
    >
      {children}
    </div>
  );
};
