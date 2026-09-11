import React, { useContext, useEffect, useRef } from "react";
import { Page as ReactPDFPage } from "react-pdf";
import type { PageProps } from "props/Page";
import { DashContainer, errorData, pageData } from "./shared";
import { PDFNavigationContext } from "./navigation";

const Page = ({
  children,
  canvasBackground,
  devicePixelRatio,
  height,
  imageResourcesPath,
  loading,
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
  loadData: _loadData,
  renderData: _renderData,
  errorData: _errorData,
  annotationsData: _annotationsData,
  textData: _textData,
  setProps,
  ...baseProps
}: PageProps) => {
  const navigation = useContext(PDFNavigationContext);
  const pageElement = useRef<HTMLDivElement | null>(null);
  const registrationKey = useRef(Symbol("pdf-page"));
  const effectivePageNumber = pageNumber ?? (pageIndex ?? 0) + 1;

  useEffect(() => {
    if (!navigation) return;
    return navigation.registerPage(registrationKey.current, {
      pageNumber: effectivePageNumber,
      setPageNumber: (nextPageNumber) =>
        setProps?.({ pageNumber: nextPageNumber }),
      scrollIntoView: () => pageElement.current?.scrollIntoView(),
    });
  }, [effectivePageNumber, navigation, setProps]);

  return (
    <DashContainer {...baseProps} setProps={setProps}>
      <ReactPDFPage
        inputRef={pageElement}
        canvasBackground={canvasBackground}
        devicePixelRatio={devicePixelRatio}
        height={height}
        imageResourcesPath={imageResourcesPath}
        loading={loading}
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
        width={width}
        onLoadSuccess={(value) =>
          setProps?.({ loadData: pageData(value), errorData: null })
        }
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
            annotationsData: { layer: "annotations", count: items.length },
          })
        }
        onGetAnnotationsError={(value) =>
          setProps?.({ errorData: errorData("annotations-load", value) })
        }
        onRenderAnnotationLayerError={(value) =>
          setProps?.({ errorData: errorData("annotations-render", value) })
        }
        onGetTextSuccess={(value) =>
          setProps?.({ textData: { layer: "text", count: value.items.length } })
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
