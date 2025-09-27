"use client";

import {
  createQuotationSchema,
  createQuotationSchemaDefaultValues,
  type ZodcreateQuotationSchema,
} from "~/zod-schemas/quotation/create-quotation";
import { createBlobUrl, revokeBlobUrl } from "~/lib/create-blob-url";
import { parseCatchError } from "~/lib/neverthrow";
import { quotationErrorAtom } from "~/lib/atoms";
import { useMounted, useResizeObserver } from "@mantine/hooks";
import { createPdfBlob } from "~/lib/create-pdf-blob";
import PDFLoading from "~/components/pdf/pdf-loading";
import React, { useEffect, useRef, useState } from "react";
import PDFError from "~/components/pdf/pdf-error";
import { cloneDeep, debounce, isEqual } from "lodash";
import { ERROR_MESSAGES } from "~/constants/issues";
import { type UseFormReturn } from "react-hook-form";
import { Document, Page } from "react-pdf";
import { useSetAtom } from "jotai";

const PDF_VIEWER_PADDING = 18;

// Custom PDF viewer component that handles displaying a PDF document
const PDFViewer = ({ url, width }: { url: string | null; width: number }) => {
  const [error, setError] = useState<Error | null>(null);

  if (width === 0) {
    // setting width to 600px Because the container is not mounted yet
    width = 600;
  }

  // Show empty state if the url is not loaded
  if (!url) {
    return null;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Document
        file={url}
        loading={null}
        onLoadError={(error) => {
          console.error("[ERROR]: Error loading PDF:", error);
          setError(error);

          // retry converting the pdf to blob
        }}
        className="scroll-bar-hidden dark:bg-background flex h-full max-h-full w-full items-center justify-center overflow-y-scroll py-[18px] sm:items-start"
      >
        {!error && (
          <Page
            pageNumber={1}
            width={width > 600 ? 600 - PDF_VIEWER_PADDING : width - PDF_VIEWER_PADDING}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        )}
      </Document>
    </div>
  );
};

const QuotationPreview = ({ form }: { form: UseFormReturn<ZodcreateQuotationSchema> }) => {
  const isClient = useMounted();
  const [resizeRef, container] = useResizeObserver();
  const setQuotationError = useSetAtom(quotationErrorAtom);
  const [data, setData] = useState(form.getValues());
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const lastProcessedValueRef = useRef<ZodcreateQuotationSchema>(createQuotationSchemaDefaultValues);

  // Watch for form changes, debounce input, validate, and then update data/errors
  useEffect(() => {
    const processFormValue = (value: ZodcreateQuotationSchema) => {
      if (isEqual(value, lastProcessedValueRef.current)) return; // skip unnecessary updates
      lastProcessedValueRef.current = cloneDeep(value);

      // First verify the data if it matches the schema
      const isDataValid = createQuotationSchema.safeParse(value);
      // If the data is valid, set the data to invoice and clear the errors
      if (isDataValid.success) {
        setData(value);
        setQuotationError([]);
      } else {
        setQuotationError(isDataValid.error.issues);
      }
    };

    // Create a debounced version of the processing function
    const debouncedProcessFormValue = debounce(processFormValue, 1000);

    const subscription = form.watch((value) => {
      // Ensure the watched value is cast correctly, matching the original logic
      debouncedProcessFormValue(value as ZodcreateQuotationSchema);
    });

    return () => {
      // Cleanup subscription and cancel any pending debounced calls
      subscription.unsubscribe();
      debouncedProcessFormValue.cancel();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Effect to generate PDF when data changes
  useEffect(() => {
    setPdfError(null);

    (async () => {
      try {
        const blob = await createPdfBlob({ invoiceData: data, template: form.watch("invoiceDetails.theme.template") });
        const newUrl = createBlobUrl({ blob });

        setGeneratedPdfUrl(newUrl);
      } catch (err) {
        setPdfError(parseCatchError(err, ERROR_MESSAGES.FAILED_TO_GENERATE_PDF));
        if (generatedPdfUrl) {
          revokeBlobUrl({ url: generatedPdfUrl });
        }
      }
    })();

    // Cleanup on component unmount or when data changes again (before new generation)
    return () => {
      if (generatedPdfUrl) {
        revokeBlobUrl({ url: generatedPdfUrl });
      }
    };

    // Dont Include generatedPdfUrl in the dependency array as it will cause infinite re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // If there is an error loading the PDF, show an error message
  if (pdfError) {
    return (
      <div className="h-full w-full">
        <PDFError message={pdfError} />
      </div>
    );
  }

  return (
    <div ref={resizeRef} className="scroll-bar-hidden bg-sidebar h-full w-full overflow-y-auto">
      {!isClient || !generatedPdfUrl ? (
        <div className="h-full w-full">
          <PDFLoading />
        </div>
      ) : (
        <PDFViewer url={generatedPdfUrl} width={container.width} />
      )}
    </div>
  );
};

export default QuotationPreview;
