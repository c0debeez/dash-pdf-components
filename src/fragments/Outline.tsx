import React from "react";
import { Outline as ReactPDFOutline } from "react-pdf";
import type { OutlineProps, PDFOutlineItem } from "props/Outline";
import { DashContainer, errorData, itemClickData } from "./shared";

interface SerializedPDFOutlineItem extends Omit<PDFOutlineItem, "items"> {
  items: SerializedPDFOutlineItem[];
}

const serializeOutline = (
  items: unknown,
): SerializedPDFOutlineItem[] | null => {
  if (!Array.isArray(items)) return null;
  return items.map((item) => {
    const value = item as Record<string, unknown>;
    return {
      title: typeof value.title === "string" ? value.title : "",
      bold: value.bold === true,
      italic: value.italic === true,
      url: typeof value.url === "string" ? value.url : null,
      items: serializeOutline(value.items) || [],
    };
  });
};

const Outline = ({
  outlineData: _outlineData,
  itemClickData: _itemClickData,
  errorData: _errorData,
  setProps,
  ...baseProps
}: OutlineProps) => (
  <DashContainer {...baseProps} setProps={setProps}>
    <ReactPDFOutline
      onItemClick={({ pageIndex, pageNumber }) =>
        setProps?.({ itemClickData: itemClickData(pageIndex, pageNumber) })
      }
      onLoadSuccess={(items) =>
        setProps?.({ outlineData: serializeOutline(items), errorData: null })
      }
      onLoadError={(value) =>
        setProps?.({ errorData: errorData("outline-load", value) })
      }
    />
  </DashContainer>
);

export default Outline;
