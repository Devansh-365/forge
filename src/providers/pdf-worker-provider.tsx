"use client";

import { pdfjs } from "react-pdf";
import React from "react";

if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
}

const PdfWorkerProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export { PdfWorkerProvider };
