import React, { useState } from "react";
import type { PDFPageProxy } from "pdfjs-dist";
import { fitPageWidth } from "./viewer";
import { Page as ReactPDFPage } from "react-pdf";
import type { PageProps } from "props/PageView";
import { DashContainer, errorData, pageData } from "./shared";

const Page = ({
  children,
  canvasBackground,
  devicePixelRatio,
  height,
  imageResourcesPath,
  error,
  noData,
  pageColors,
  pageIndex,
  pageNumber,
  renderAnnotationLayer = true,
  renderForms = false,
  renderMode = "canvas",
  renderTextLayer = true,
  rotate,
  scale = 1,
  width,
  pageData: _pageData,
  renderData: _renderData,
  errorData: _errorData,
  annotationsData: _annotationsData,
  textData: _textData,
  setProps,
  fit,
  fitSize,
  ...baseProps
}: PageProps & {
  fit?: "width" | "page";
  fitSize?: { width: number; height: number };
}) => {
  const [loadedPage, setLoadedPage] = useState<PDFPageProxy | null>(null);
  const viewport = loadedPage?.getViewport({
    scale: 1,
    rotation: rotate ?? loadedPage.rotate,
  });
  const fittedWidth = fitPageWidth(
    fit,
    fitSize?.width ?? 0,
    fitSize?.height ?? 0,
    viewport?.width ?? 0,
    viewport?.height ?? 0,
  );
  const effectivePageNumber = pageNumber ?? (pageIndex ?? 0) + 1;

  return (
    <DashContainer {...baseProps} setProps={setProps}>
      <ReactPDFPage
        canvasBackground={canvasBackground}
        devicePixelRatio={devicePixelRatio}
        height={fit ? undefined : height}
        imageResourcesPath={imageResourcesPath}
        loading={null}
        error={error}
        noData={noData}
        pageColors={pageColors}
        pageIndex={pageIndex}
        pageNumber={pageNumber}
        renderAnnotationLayer={renderAnnotationLayer}
        renderForms={renderForms}
        renderMode={renderMode}
        renderTextLayer={renderTextLayer}
        rotate={rotate}
        scale={scale}
        width={fit ? fittedWidth : width}
        onLoadSuccess={(value) => {
          setLoadedPage(value);
          setProps?.({
            pageData: pageData(value),
            errorData: null,
          });
        }}
        onLoadError={(value) =>
          setProps?.({ errorData: errorData("page-load", value) })
        }
        onRenderSuccess={(value) =>
          setProps?.({ renderData: pageData(value), errorData: null })
        }
        onRenderError={(value) =>
          setProps?.({ errorData: errorData("page-render", value) })
        }
        onGetAnnotationsSuccess={(items) =>
          setProps?.({
            annotationsData: {
              pageNumber: effectivePageNumber,
              layer: "annotations",
              count: items.length,
            },
          })
        }
        onGetAnnotationsError={(value) =>
          setProps?.({ errorData: errorData("annotations-load", value) })
        }
        onRenderAnnotationLayerError={(value) =>
          setProps?.({ errorData: errorData("annotations-render", value) })
        }
        onGetTextSuccess={(value) =>
          setProps?.({
            textData: {
              pageNumber: effectivePageNumber,
              layer: "text",
              count: value.items.length,
            },
          })
        }
        onGetTextError={(value) =>
          setProps?.({ errorData: errorData("text-load", value) })
        }
        onRenderTextLayerError={(value) =>
          setProps?.({ errorData: errorData("text-render", value) })
        }
      >
        {children}
      </ReactPDFPage>
    </DashContainer>
  );
};

export default Page;
