import { type ZodcreateQuotationSchema } from "~/zod-schemas/quotation/create-quotation";
import PDFTemplate from "~/components/pdf/pdf-template";
import { pdf } from "@react-pdf/renderer";

interface CreatePdfBlobProps {
  template: "default";
  invoiceData: ZodcreateQuotationSchema;
}

export const createPdfBlob = async ({ invoiceData, template }: CreatePdfBlobProps) => {
  const Template = getPdfTemplate(template);

  const pdfDocument = <Template data={invoiceData} />;
  const blob = await pdf(pdfDocument).toBlob();

  return blob;
};

const getPdfTemplate = (template: CreatePdfBlobProps["template"]) => {
  // if there is no template, fallback to default
  if (!template) {
    return PDFTemplate;
  }

  // else return the specified tempalte
  switch (template) {
    default:
      return PDFTemplate;
  }
};
