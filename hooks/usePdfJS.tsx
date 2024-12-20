"use client";
import { useEffect, useState } from "react";
import * as PDFJS from "pdfjs-dist/types/src/pdf";

export const usePDFJS = (
  onLoad: (pdfjs: typeof PDFJS) => Promise<void>,
  deps: Array<string | number | boolean | undefined | null> = []
) => {
  const [pdfjs, setPDFJS] = useState<typeof PDFJS | undefined>(undefined);

  // load the library once on mount (the webpack import automatically sets-up the worker)
  useEffect(() => {
    import("pdfjs-dist/webpack.mjs").then(setPDFJS);
  }, []);

  // execute the callback function whenever PDFJS loads (or a custom dependency-array updates)
  useEffect(() => {
    if (!pdfjs) return;
    (async () => await onLoad(pdfjs))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfjs, ...deps]);
};


// "use client";

// import { useEffect, useState } from "react";
// import * as PDFJS from "pdfjs-dist/types/src/pdf";

// export const usePDFJS = (
//   onLoad: (pdfjs: typeof PDFJS) => Promise<void>,
//   deps: Array<string | number | boolean | undefined | null> = []
// ) => {
//   const [pdfjs, setPDFJS] = useState<typeof PDFJS | undefined>(undefined);
//   const [error, setError] = useState<Error | null>(null);

//   // Load the library once on mount
//   useEffect(() => {
//     const loadPDFJS = async () => {
//       try {
//         const pdfjsModule = await import("pdfjs-dist/webpack.mjs");
//         setPDFJS(pdfjsModule);
//       } catch (err) {
//         console.error("Failed to load PDF.js library:", err);
//         setError(err instanceof Error ? err : new Error("Unknown error"));
//       }
//     };

//     loadPDFJS();
//   }, []);

//   // Execute the callback function whenever PDFJS loads or dependencies change
//   useEffect(() => {
//     if (!pdfjs) return;

//     const executeOnLoad = async () => {
//       try {
//         await onLoad(pdfjs);
//       } catch (err) {
//         console.error("Error in usePDFJS onLoad callback:", err);
//       }
//     };

//     executeOnLoad();

//   }, [pdfjs, onLoad, deps]);

//   // Optionally return the error state for external handling
//   return { error };
// };