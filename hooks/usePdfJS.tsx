"use client";
import {useEffect, useState} from "react";
import * as PDFJS from "pdfjs-dist/types/src/pdf";

export const usePDFJS = (onLoad: (pdfjs: typeof PDFJS) => Promise<void>, deps: (string | number | boolean | undefined | null)[] = []) => {
  
  const [pdfjs, setPDFJS] = useState<typeof PDFJS | undefined>(undefined);
  
  // load the library once on mount (the webpack import automatically sets-up the worker)
  useEffect(() => {
    import("pdfjs-dist/webpack.mjs").then(setPDFJS)
  }, []);

  // execute the callback function whenever PDFJS loads (or a custom dependency-array updates)
  useEffect(() => {
    if(!pdfjs) return;
    (async () => await onLoad(pdfjs))();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ pdfjs, ...deps]);
}