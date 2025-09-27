import { type ZodcreateQuotationSchema } from "~/zod-schemas/quotation/create-quotation";

export const getSubTotalValue = (data: ZodcreateQuotationSchema) => {
  return data.items.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0);
};

export const getTotalValue = (data: ZodcreateQuotationSchema) => {
  const subtotal = getSubTotalValue(data);

  const billingRates = data.invoiceDetails.billingDetails;

  // Calculate the total value based of fixed/percentage billing rates also value can be positive or negative
  let total = subtotal;

  billingRates.forEach((rate: any) => {
    if (rate.type === "fixed") {
      // Add or subtract the fixed amount directly
      total += rate.value;
    } else if (rate.type === "percentage") {
      // Calculate percentage of subtotal and add/subtract
      const percentageValue = (subtotal * rate.value) / 100;
      total += percentageValue;
    }
  });

  return total;
};
