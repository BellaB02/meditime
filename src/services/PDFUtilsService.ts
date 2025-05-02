
import { jsPDF } from "jspdf";
import { toast } from "sonner";

/**
 * Utility service for PDF operations
 */
export const PDFUtilsService = {
  /**
   * Prépare un PDF pour impression
   */
  preparePDFForPrint: (doc: jsPDF): string | null => {
    try {
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      console.error("Erreur lors de la préparation du PDF pour impression:", error);
      return null;
    }
  }
};
