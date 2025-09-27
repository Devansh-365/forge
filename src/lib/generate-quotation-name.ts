import { type ZodcreateQuotationSchema } from "~/zod-schemas/quotation/create-quotation";

interface GenerateQuotationNameProps {
  invoiceData: ZodcreateQuotationSchema;
  extension: "pdf" | "png";
}

export const generateQuotationName = ({ invoiceData, extension }: GenerateQuotationNameProps) => {
  return `Invoice-${invoiceData.invoiceDetails.prefix}${invoiceData.invoiceDetails.serialNumber}.${extension}`;
};
