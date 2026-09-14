import React, { useEffect, useMemo, useRef } from "react";
import { Document as ReactPDFDocument, pdfjs } from "react-pdf";
import type { DocumentProps as ReactPDFDocumentProps } from "react-pdf";
import type { DocumentProps } from "props/DocumentView";
import {
  annotationImagesPath,
  configurePdfAssets,
  DashContainer,
  errorData,
  itemClickData,
  useStableValue,
} from "./shared";

const Document = ({
  children,
  file = null,
  options = {},
  assetBaseUrl,
  workerSrc,
  imageResourcesPath,
  externalLinkRel,
  externalLinkTarget,
  renderMode = "canvas",
  rotate,
  scale = 1,
  password,
  numPages: _numPages,
  documentData: _documentData,
  loadProgress: _loadProgress,
  sourceLoaded: _sourceLoaded,
  errorData: _errorData,
  passwordData: _passwordData,
  itemClickData: _itemClickData,
  error,
  noData,
  setProps,
  navigate,
  ...baseProps
}: Omit<DocumentProps, "file"> & {
  file?: DocumentProps["file"] | Blob;
  navigate?: (pageNumber: number) => void;
}) => {
  const navigationCallback = useRef(navigate);
  navigationCallback.current = navigate;
  const stableFile = useStableValue(file);
  const stableOptions = useStableValue(options);
  const documentOptions = useMemo(
    () => configurePdfAssets(stableOptions, assetBaseUrl, workerSrc),
    [stableOptions, assetBaseUrl, workerSrc],
  );
  const passwordCallback = useRef<((password: string | null) => void) | null>(
    null,
  );

  useEffect(() => {
    if (!password || !passwordCallback.current) return;
    passwordCallback.current(password);
    passwordCallback.current = null;
  }, [password]);

  useEffect(() => {
    setProps?.({
      numPages: null,
      documentData: null,
      loadProgress: null,
      sourceLoaded: false,
      errorData: null,
      passwordData: null,
    });
  }, [stableFile, stableOptions, assetBaseUrl, workerSrc]);

  const onLoadSuccess: NonNullable<ReactPDFDocumentProps["onLoadSuccess"]> = (
    pdf,
  ) => {
    setProps?.({
      numPages: pdf.numPages,
      documentData: {
        numPages: pdf.numPages,
        fingerprints: [...pdf.fingerprints],
      },
      errorData: null,
      passwordData: null,
    });
  };
  const onItemClick = ({
    pageIndex,
    pageNumber,
  }: {
    pageIndex: number;
    pageNumber: number;
  }) => {
    navigationCallback.current?.(pageNumber);

    setProps?.({ itemClickData: itemClickData(pageIndex, pageNumber) });
  };

  return (
    <DashContainer {...baseProps} setProps={setProps}>
      <ReactPDFDocument
        file={stableFile}
        options={documentOptions}
        imageResourcesPath={
          imageResourcesPath || annotationImagesPath(assetBaseUrl)
        }
        externalLinkRel={externalLinkRel}
        externalLinkTarget={externalLinkTarget}
        renderMode={renderMode}
        rotate={rotate}
        scale={scale}
        loading={null}
        error={error}
        noData={noData}
        onItemClick={onItemClick}
        onLoadProgress={(progress) => setProps?.({ loadProgress: progress })}
        onLoadSuccess={onLoadSuccess}
        onLoadError={(value) =>
          setProps?.({
            numPages: null,
            errorData: errorData("document", value),
          })
        }
        onSourceSuccess={() => setProps?.({ sourceLoaded: true })}
        onSourceError={(value) =>
          setProps?.({
            sourceLoaded: false,
            errorData: errorData("source", value),
          })
        }
        onPassword={(callback, reason) => {
          passwordCallback.current = callback;
          if (password && reason === pdfjs.PasswordResponses.NEED_PASSWORD) {
            callback(password);
            passwordCallback.current = null;
          } else {
            setProps?.({
              passwordData: {
                reason:
                  reason === pdfjs.PasswordResponses.INCORRECT_PASSWORD
                    ? "incorrect-password"
                    : "need-password",
              },
            });
          }
        }}
      >
        {children}
      </ReactPDFDocument>
    </DashContainer>
  );
};

export default Document;
