import { Thumbnail as ReactPDFThumbnail } from "react-pdf";
import type { ThumbnailProps } from "props/Thumbnail";
import { DashContainer, errorData, itemClickData, pageData } from "./shared";

const Thumbnail = ({
  canvasBackground,
  devicePixelRatio,
  height,
  error,
  noData,
  pageColors,
  pageIndex,
  pageNumber,
  renderMode = "canvas",
  rotate,
  scale = 1,
  width,
  loadData: _loadData,
  pageData: _pageData,
  renderData: _renderData,
  errorData: _errorData,
  itemClickData: _itemClickData,
  setProps,
  ...baseProps
}: ThumbnailProps) => (
  <DashContainer {...baseProps} setProps={setProps}>
    <ReactPDFThumbnail
      canvasBackground={canvasBackground}
      devicePixelRatio={devicePixelRatio}
      height={height}
      loading={null}
      error={error}
      noData={noData}
      pageColors={pageColors}
      pageIndex={pageIndex}
      pageNumber={pageNumber}
      renderMode={renderMode}
      rotate={rotate}
      scale={scale}
      width={width}
      onItemClick={({ pageIndex, pageNumber }) =>
        setProps?.({ itemClickData: itemClickData(pageIndex, pageNumber) })
      }
      onLoadSuccess={(value) =>
        setProps?.({
          loadData: pageData(value),
          pageData: pageData(value),
          errorData: null,
        })
      }
      onLoadError={(value) =>
        setProps?.({ errorData: errorData("thumbnail-load", value) })
      }
      onRenderSuccess={(value) =>
        setProps?.({ renderData: pageData(value), errorData: null })
      }
      onRenderError={(value) =>
        setProps?.({ errorData: errorData("thumbnail-render", value) })
      }
    />
  </DashContainer>
);

export default Thumbnail;
