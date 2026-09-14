import React, { useEffect, useRef } from "react";
import { pdf, version } from "@react-pdf/renderer";
import type { PDFProps } from "props/PDF";
import { callbackContext, toPDFDocument, unwrapDocument } from "./document";
import { configureFonts, fontDiagnostics } from "./fonts";
import { resolveFunction } from "./functions";

let pending: Promise<unknown> = Promise.resolve();

export interface GeneratedResult {
  blob: Blob;
  diagnostics: Record<string, unknown>;
  version: string;
}

interface GeneratorProps {
  documentJSON: string;
  configJSON: string;
  autoGenerate: boolean;
  n_generate: number;
  id: PDFProps["id"];
  onStart: (generating: boolean) => void;
  onSuccess: (result: GeneratedResult) => void;
  onError: (error: unknown) => void;
}

/** Generation is independent of preview controls and PDF.js. */
const Generator = (props: GeneratorProps) => {
  const latest = useRef(props);
  latest.current = props;
  const previousTrigger = useRef(props.n_generate);
  const first = useRef(true);
  useEffect(() => {
    const manual = previousTrigger.current !== props.n_generate;
    previousTrigger.current = props.n_generate;
    const shouldGenerate =
      props.autoGenerate || manual || (first.current && props.n_generate !== 0);
    first.current = false;
    let cancelled = false;
    latest.current.onStart(shouldGenerate);
    if (!shouldGenerate) return;
    const job = async () => {
      if (cancelled) return;
      let restore: (() => void) | undefined;
      try {
        const document = unwrapDocument(JSON.parse(props.documentJSON));
        const config = JSON.parse(props.configJSON);
        const context = callbackContext({
          id: latest.current.id,
          mode: "generation",
        });
        const element = toPDFDocument(document, context);
        restore = await configureFonts(config, context);
        const blob = await pdf(element).toBlob();
        if (cancelled) return;
        if (document.props.onRender)
          resolveFunction(document.props.onRender, context)({ blob });
        latest.current.onSuccess({
          blob,
          diagnostics: fontDiagnostics(config.fontDescriptors),
          version,
        });
      } catch (error) {
        if (!cancelled) latest.current.onError(error);
      } finally {
        restore?.();
      }
    };
    pending = pending.then(job, job);
    return () => {
      cancelled = true;
    };
  }, [
    props.documentJSON,
    props.configJSON,
    props.autoGenerate,
    props.n_generate,
  ]);
  return null;
};
export default Generator;
