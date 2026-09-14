import React, { useCallback, useEffect, useRef, useState } from "react";
import type { PDFProps } from "props/PDF";
import Document from "./Document";
import Page from "./Page";
import { DashContainer, useStableValue } from "./shared";
import { selectPages, useContainerSize } from "./viewer";

type PropUpdates = Record<string, unknown>;

const PDF = ({
  children,
  file = null,
  pageNumber = 1,
  pages,
  fit,
  style,
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
  error,
  noData,
  loading_state,
  setProps,
  ...baseProps
}: Omit<PDFProps, "file"> & { file?: PDFProps["file"] | Blob }) => {
  const stableFile = useStableValue(file);
  const selection = useStableValue(
    pages ?? (pageNumber === "all" ? "all" : undefined),
  );
  const [currentPage, setCurrentPage] = useState(
    typeof pageNumber === "number" ? pageNumber : 1,
  );
  const [pageCount, setPageCount] = useState(0);
  const container = useRef<HTMLDivElement | null>(null);
  const pendingPage = useRef<number | null>(null);
  const observedPage = useRef<number | null>(null);
  const readyPages = useRef(new Set<number>());
  const suppressScrollUntil = useRef(0);
  const size = useContainerSize(container, Boolean(fit));
  const renderedPages = selectPages(selection, currentPage, pageCount);

  const scrollToPage = useCallback((number: number) => {
    const root = container.current;
    const target = root?.querySelector<HTMLElement>(
      `.react-pdf__Page[data-page-number="${number}"]`,
    );
    if (!root || !target) return false;
    const mounted = Array.from(
      root.querySelectorAll<HTMLElement>(".react-pdf__Page[data-page-number]"),
    );
    const targetIndex = mounted.indexOf(target);
    if (
      targetIndex < 0 ||
      !mounted
        .slice(0, targetIndex + 1)
        .every((element) =>
          readyPages.current.has(Number(element.dataset.pageNumber)),
        )
    )
      return false;
    suppressScrollUntil.current = Date.now() + 250;
    root.scrollTop +=
      target.getBoundingClientRect().top -
      root.getBoundingClientRect().top -
      root.clientTop;
    return true;
  }, []);

  useEffect(() => {
    if (typeof pageNumber !== "number") return;
    if (observedPage.current === pageNumber) {
      observedPage.current = null;
      return;
    }
    setCurrentPage(pageNumber);
    pendingPage.current = selection ? pageNumber : null;
    if (selection && scrollToPage(pageNumber)) pendingPage.current = null;
  }, [pageNumber, selection, scrollToPage]);
  useEffect(() => {
    readyPages.current.clear();
    setPageCount(0);
  }, [stableFile]);
  useEffect(() => {
    if (pendingPage.current !== null && scrollToPage(pendingPage.current))
      pendingPage.current = null;
  }, [currentPage, pageCount, selection, scrollToPage]);

  const updatePageNumber = useCallback(
    (value: unknown) => {
      if (
        typeof value !== "number" ||
        !Number.isInteger(value) ||
        value < 1 ||
        (pageCount > 0 && value > pageCount)
      )
        return;
      if (
        selection &&
        !selectPages(selection, value, pageCount).includes(value)
      )
        return;
      pendingPage.current = selection && !scrollToPage(value) ? value : null;
      setCurrentPage(value);
      if (pageNumber !== "all") setProps?.({ pageNumber: value });
    },
    [setProps, pageNumber, pageCount, selection, scrollToPage],
  );

  const updateDocumentProps = useCallback(
    (updates: PropUpdates) => {
      const { itemClickData, ...documentUpdates } = updates;
      const nextUpdates: PropUpdates = { ...documentUpdates };
      if (typeof documentUpdates.numPages === "number") {
        setPageCount(documentUpdates.numPages);
      } else if (documentUpdates.numPages === null) {
        setPageCount(0);
        Object.assign(nextUpdates, {
          pageData: null,
          renderData: null,
          annotationsData: null,
          textData: null,
        });
      }

      if (itemClickData !== undefined) {
        nextUpdates.itemClickData = itemClickData;
      }
      if (Object.keys(nextUpdates).length > 0) setProps?.(nextUpdates);
    },
    [setProps],
  );

  const updatePageProps = useCallback(
    (updates: PropUpdates) => {
      const { pageNumber: nextPageNumber, ...pageUpdates } = updates;
      if (pageUpdates.renderData) {
        readyPages.current.add(
          (pageUpdates.renderData as { pageNumber: number }).pageNumber,
        );
        if (pendingPage.current !== null && scrollToPage(pendingPage.current))
          pendingPage.current = null;
      }
      if (nextPageNumber !== undefined) updatePageNumber(nextPageNumber);
      if (Object.keys(pageUpdates).length > 0) setProps?.(pageUpdates);
    },
    [setProps, updatePageNumber, scrollToPage],
  );

  return (
    <DashContainer
      {...baseProps}
      loading_state={loading_state}
      setProps={setProps}
      containerRef={container}
      style={{ maxWidth: "100%", overflow: "auto", ...style }}
      onScroll={() => {
        const root = container.current;
        if (
          !root ||
          !selection ||
          pageNumber === "all" ||
          Date.now() < suppressScrollUntil.current
        )
          return;
        const top = root.getBoundingClientRect().top + root.clientTop;
        const candidates = Array.from(
          root.querySelectorAll<HTMLElement>(
            ".react-pdf__Page[data-page-number]",
          ),
        );
        const visible = candidates.filter(
          (element) =>
            element.getBoundingClientRect().bottom > top &&
            element.getBoundingClientRect().top < top + root.clientHeight,
        );
        const target = visible.reduce<HTMLElement | null>(
          (best, element) =>
            !best ||
            Math.abs(element.getBoundingClientRect().top - top) <
              Math.abs(best.getBoundingClientRect().top - top)
              ? element
              : best,
          null,
        );
        const number = Number(target?.dataset.pageNumber);
        if (number && number !== currentPage) {
          observedPage.current = number;
          setCurrentPage(number);
          setProps?.({ pageNumber: number });
        }
      }}
    >
      <Document
        file={stableFile}
        navigate={updatePageNumber}
        options={options}
        assetBaseUrl={assetBaseUrl}
        workerSrc={workerSrc}
        imageResourcesPath={imageResourcesPath}
        externalLinkRel={externalLinkRel}
        externalLinkTarget={externalLinkTarget}
        renderMode={renderMode}
        password={password}
        error={error}
        noData={noData}
        loading_state={loading_state}
        setProps={updateDocumentProps}
      >
        {renderedPages.map((number) => (
          <Page
            key={number}
            pageNumber={number}
            width={width}
            fit={fit}
            fitSize={size}
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
            error={error}
            noData={noData}
            setProps={updatePageProps}
          >
            {children}
          </Page>
        ))}
      </Document>
    </DashContainer>
  );
};

export default PDF;
