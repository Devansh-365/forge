"use client";

import {
  createQuotationSchema,
  createQuotationSchemaDefaultValues,
  type ZodcreateQuotationSchema,
} from "~/zod-schemas/quotation/create-quotation";
import { ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import QuotationOptions from "./options/quotation-options";
import { type ImperativePanelHandle } from "react-resizable-panels";
import { quotationTabAtom } from "~/lib/atoms";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Invoice } from "~/types";
import { useIsMobile } from "~/hooks/use-mobile";
import React, { useEffect, useRef } from "react";
import { PdfWorkerProvider } from "~/providers";
import QuotationPreview from "./quotation-preview";
import { useForm } from "react-hook-form";
import QuotationForm from "./quotation-form";
import { cn } from "~/lib/utils";
import { useAtom } from "jotai";

const InvoicePage = ({
  defaultInvoice,
}: {
  defaultInvoice?: any;
}) => {
  const quotationFormPanelRef = useRef<ImperativePanelHandle>(null);
  const quotationPreviewPanelRef = useRef<ImperativePanelHandle>(null);
  const [quotationTab, setQuotationTab] = useAtom(quotationTabAtom);
  const isMobile = useIsMobile();

  // Form
  const form = useForm<ZodcreateQuotationSchema>({
    resolver: zodResolver(createQuotationSchema),
    defaultValues: defaultInvoice || createQuotationSchemaDefaultValues,
  });

  // Collapse or expand the panels based on the quotationTab value
  useEffect(() => {
    const invoicePanel = quotationFormPanelRef.current;
    const invoicePreviewPanel = quotationPreviewPanelRef.current;

    if (!invoicePanel || !invoicePreviewPanel) return;

    if (isMobile && quotationTab === "both") {
      setQuotationTab("form");
      return;
    }

    switch (quotationTab) {
      case "form":
        if (invoicePanel.isCollapsed()) {
          invoicePanel.expand();
        }
        invoicePreviewPanel.collapse();
        invoicePanel.resize(100);
        break;
      case "preview":
        if (invoicePreviewPanel.isCollapsed()) {
          invoicePreviewPanel.expand();
        }
        invoicePanel.collapse();
        invoicePreviewPanel.resize(100);
        break;
      case "both":
        // Ensure both panels are expanded
        if (invoicePanel.isCollapsed()) {
          invoicePanel.expand();
        }
        if (invoicePreviewPanel.isCollapsed()) {
          invoicePreviewPanel.expand();
        }
        // Explicitly set sizes for "both" view
        invoicePanel.resize(50);
        invoicePreviewPanel.resize(50);
        break;
    }
  }, [quotationTab, isMobile, setQuotationTab]);

  return (
    <div className="flex h-full flex-col">
      <QuotationOptions form={form} />
      <ResizablePanelGroup direction="horizontal" className="divide-x">
        <ResizablePanel
          collapsible={true}
          defaultSize={50}
          ref={quotationFormPanelRef}
        >
          <QuotationForm form={form} />
        </ResizablePanel>
        <ResizablePanel
          className={cn(quotationTab === "both" ? "hidden md:flex" : "flex")}
          collapsible={true}
          defaultSize={50}
          ref={quotationPreviewPanelRef}
        >
          <PdfWorkerProvider>
            <QuotationPreview form={form} />
          </PdfWorkerProvider>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default InvoicePage;
