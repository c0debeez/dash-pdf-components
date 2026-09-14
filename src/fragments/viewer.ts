import { useEffect, useState, type RefObject } from "react";

export const selectPages = (
  selection: "all" | number[] | undefined,
  currentPage: number,
  pageCount: number,
): number[] => {
  if (selection === "all")
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (!selection) return [currentPage];
  return [...new Set(selection)].filter(
    (page) => Number.isInteger(page) && page >= 1 && page <= pageCount,
  );
};

export const fitPageWidth = (
  fit: "width" | "page" | undefined,
  width: number,
  height: number,
  pageWidth: number,
  pageHeight: number,
) => {
  if (!fit || width <= 0) return undefined;
  if (fit === "page" && height > 0 && pageWidth > 0 && pageHeight > 0)
    return Math.min(width, (height * pageWidth) / pageHeight);
  return width;
};

export const useContainerSize = (
  ref: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    const measure = () => {
      const style = getComputedStyle(element);
      const width =
        element.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      const height =
        element.clientHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom);
      setSize((previous) =>
        previous.width === width && previous.height === height
          ? previous
          : { width, height },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, enabled]);
  return size;
};
