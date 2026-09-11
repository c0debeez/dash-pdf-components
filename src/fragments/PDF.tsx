import React, { useCallback, useEffect, useState } from "react";
import type { PDFProps } from "props/PDF";
import { getLoadingState } from "utils/dash";
import Document from "./Document";
import Page from "./Page";

type PropUpdates = Record<string, unknown>;

const PDF = ({
  children,
  file = null,
  pageNumber = 1,
  width,
  height,
  scale = 1,
  rotate = 0,
  renderTextLayer = true,
  renderAnnotationLayer = true,
  renderForms = false,
  renderMode = "canvas",
  canvasBackground,
  devicePixelRatio,
  pageColors,
  options = {},
  assetBaseUrl,
  workerSrc,
  imageResourcesPath,
  externalLinkRel,
  externalLinkTarget,
  password,
  numPages: _numPages,
  documentData: _documentData,
  loadProgress: _loadProgress,
  sourceLoaded: _sourceLoaded,
  errorData: _errorData,
  passwordData: _passwordData,
  itemClickData: _itemClickData,
  pageData: _pageData,
  renderData: _renderData,
  annotationsData: _annotationsData,
  textData: _textData,
  loading: loadingProp,
  error,
  noData,
  loading_state,
  setProps,
  ...baseProps
}: PDFProps) => {
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const loading = loadingProp ?? (getLoadingState(loading_state) || undefined);

  useEffect(() => setCurrentPage(pageNumber), [pageNumber]);

  const updatePageNumber = useCallback(
    (value: unknown) => {
      if (typeof value !== "number") return;
      setCurrentPage(value);
      setProps?.({ pageNumber: value });
    },
    [setProps],
  );

  const updateDocumentProps = useCallback(
    (updates: PropUpdates) => {
      const { loadData, itemClickData, ...documentUpdates } = updates;
      const nextUpdates: PropUpdates = { ...documentUpdates };

      if (loadData !== undefined) nextUpdates.documentData = loadData;
      if (itemClickData !== undefined) {
        nextUpdates.itemClickData = itemClickData;
        updatePageNumber(
          (itemClickData as { pageNumber?: unknown } | null)?.pageNumber,
        );
      }
      if (Object.keys(nextUpdates).length > 0) setProps?.(nextUpdates);
    },
    [setProps, updatePageNumber],
  );

  const updatePageProps = useCallback(
    (updates: PropUpdates) => {
      const { loadData, pageNumber: nextPageNumber, ...pageUpdates } = updates;
      if (loadData !== undefined) pageUpdates.pageData = loadData;
      if (nextPageNumber !== undefined) updatePageNumber(nextPageNumber);
      if (Object.keys(pageUpdates).length > 0) setProps?.(pageUpdates);
    },
    [setProps, updatePageNumber],
  );

  return (
    <Document
      {...baseProps}
      file={file}
      options={options}
      assetBaseUrl={assetBaseUrl}
      workerSrc={workerSrc}
      imageResourcesPath={imageResourcesPath}
      externalLinkRel={externalLinkRel}
      externalLinkTarget={externalLinkTarget}
      renderMode={renderMode}
      password={password}
      loading={loading}
      error={error}
      noData={noData}
      loading_state={loading_state}
      setProps={updateDocumentProps}
    >
      <Page
        pageNumber={currentPage}
        width={width}
        height={height}
        scale={scale}
        rotate={rotate}
        renderTextLayer={renderTextLayer}
        renderAnnotationLayer={renderAnnotationLayer}
        renderForms={renderForms}
        renderMode={renderMode}
        canvasBackground={canvasBackground}
        devicePixelRatio={devicePixelRatio}
        imageResourcesPath={imageResourcesPath}
        pageColors={pageColors}
        loading={loading}
        error={error}
        noData={noData}
        setProps={updatePageProps}
      >
        {children}
      </Page>
    </Document>
  );
};

export default PDF;
