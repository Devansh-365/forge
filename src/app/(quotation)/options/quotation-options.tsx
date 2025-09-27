import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Download,
  Eye,
  FileDown,
  ImageDown,
  Save,
} from "lucide-react";
import { QuotationDownloadManagerInstance } from "~/lib/quotation-download-manager";
import { type ZodcreateQuotationSchema } from "~/zod-schemas/quotation/create-quotation";
// import InvoiceErrorsModal from "./invoice-errors-modal";
import { Button } from "~/components/ui/button";
import { type UseFormReturn } from "react-hook-form";

type InvoiceOptionsProps =
  | "view-pdf"
  | "download-pdf"
  | "download-png"
  | "save-invoice-to-database";
type Params = {
  type?: string;
  id?: string;
};

const InvoiceOptions = ({
  form,
}: {
  form: UseFormReturn<ZodcreateQuotationSchema>;
}) => {
  const formValues = form.getValues();

  const handleDropDownAction = async (action: InvoiceOptionsProps) => {
    await QuotationDownloadManagerInstance.initialize(formValues);

    switch (action) {
      case "view-pdf":
        QuotationDownloadManagerInstance.previewPdf();
        break;
      case "download-pdf":
        QuotationDownloadManagerInstance.downloadPdf();

        break;
      case "download-png":
        QuotationDownloadManagerInstance.downloadPng();

        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-12 shrink-0 flex-row items-center justify-between gap-2 border-b px-2">
      <div className="flex flex-row items-center gap-2">
        {/* <InvoiceErrorsModal /> */}
      </div>
      <div className="flex flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">
              <Download />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleDropDownAction("save-invoice-to-database")}
            >
              <Save />
              <span>Save Invoice</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDropDownAction("view-pdf")}>
              <Eye />
              <span>View PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDropDownAction("download-pdf")}
            >
              <FileDown />
              <span>Download PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDropDownAction("download-png")}
            >
              <ImageDown />
              <span>Download PNG</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default InvoiceOptions;
