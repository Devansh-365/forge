import { type ZodcreateQuotationSchema } from "~/zod-schemas/quotation/create-quotation";
import { createBlobUrl, revokeBlobUrl } from "~/lib/create-blob-url";
import { generateQuotationName } from "~/lib/generate-quotation-name";
import { createPdfToImage } from "~/lib/create-pdf-to-image";
import { createPdfBlob } from "~/lib/create-pdf-blob";
import { downloadFile } from "~/lib/download-file";
import { ERROR_MESSAGES } from "~/constants/issues";
import { toast } from "sonner";

export class QuotationDownloadManager {
  private invoiceData: ZodcreateQuotationSchema | undefined;
  private invoiceName: string | undefined;
  private blob: Blob | undefined;

  // Initialize the invoice data
  public async initialize(invoice: ZodcreateQuotationSchema): Promise<void> {
    // Cleanup resources
    this.cleanup();

    // Initialize the invoice data
    this.invoiceData = invoice;
    this.invoiceName = generateQuotationName({ invoiceData: invoice, extension: "pdf" });

    const invoiceData = this.isInvoiceDataInitialized();
    this.blob = await createPdfBlob({ invoiceData, template: invoiceData.invoiceDetails.theme.template as any });
  }

  // Preview the PDF - we dont save data on preview
  public async previewPdf() {
    const url = createBlobUrl({ blob: this.isBlobInitialized() });
    window.open(url, "_blank");
    revokeBlobUrl({ url });
  }

  // Download PNG
  public async downloadPng() {
    const blob = await createPdfToImage({ pdfBlob: this.isBlobInitialized(), scale: 2 });
    const url = createBlobUrl({ blob });
    // we need name with png extension
    const fileName = generateQuotationName({ invoiceData: this.isInvoiceDataInitialized(), extension: "png" });
    downloadFile({ url, fileName });
    revokeBlobUrl({ url });
  }

  // Download the PDF
  public async downloadPdf() {
    const url = createBlobUrl({ blob: this.isBlobInitialized() });
    downloadFile({ url, fileName: this.isInvoiceNameInitialized() });
    revokeBlobUrl({ url });
  }

  // Cleanup resources
  public cleanup(): void {
    // Reset class properties
    this.invoiceData = undefined;
    this.invoiceName = undefined;
    this.blob = undefined;
  }

  //   Error Handling
  private isBlobInitialized(): Blob {
    if (!this.blob) {
      toast.error(ERROR_MESSAGES.BLOB_NOT_INITIALIZED);
      throw new Error(ERROR_MESSAGES.BLOB_NOT_INITIALIZED);
    }
    return this.blob;
  }

  private isInvoiceDataInitialized(): ZodcreateQuotationSchema {
    if (!this.invoiceData) {
      toast.error(ERROR_MESSAGES.INVOICE_DATA_NOT_INITIALIZED);
      throw new Error(ERROR_MESSAGES.INVOICE_DATA_NOT_INITIALIZED);
    }
    return this.invoiceData;
  }

  private isInvoiceNameInitialized(): string {
    if (!this.invoiceName) {
      toast.error(ERROR_MESSAGES.INVOICE_NAME_NOT_INITIALIZED);
      throw new Error(ERROR_MESSAGES.INVOICE_NAME_NOT_INITIALIZED);
    }
    return this.invoiceName;
  }
}

export const QuotationDownloadManagerInstance = new QuotationDownloadManager();
