
import { jsPDF } from "jspdf";
import { CareSheetPDFService } from "./CareSheetPDFService";
import { InvoicePDFService } from "./InvoicePDFService";
import { PDFUtilsService } from "./PDFUtilsService";
import type { CareInfo, PrescriptionInfo, InvoiceInfo } from "./PDFTypes";

// Re-export types for backward compatibility
export type { CareInfo, PrescriptionInfo, InvoiceInfo };

/**
 * Facade service for PDF generation operations
 */
export const PDFGenerationService = {
  /**
   * Génère un PDF pré-rempli avec les informations patient et soins
   */
  generatePrefilledPDF: async (patientId?: string, careInfo?: CareInfo, prescriptions?: PrescriptionInfo[]): Promise<jsPDF | null> => {
    return CareSheetPDFService.generatePrefilledPDF(patientId, careInfo, prescriptions);
  },
  
  /**
   * Génère une facture en PDF
   */
  generateInvoicePDF: (invoiceInfo: InvoiceInfo): jsPDF | null => {
    return InvoicePDFService.generateInvoicePDF(invoiceInfo);
  },
  
  /**
   * Sauvegarde un document PDF
   */
  savePDF: (doc: jsPDF, patientId: string): void => {
    CareSheetPDFService.savePDF(doc, patientId);
  },
  
  /**
   * Sauvegarde une facture PDF
   */
  saveInvoicePDF: (doc: jsPDF, invoiceId: string): void => {
    InvoicePDFService.saveInvoicePDF(doc, invoiceId);
  },
  
  /**
   * Prépare un PDF pour impression
   */
  preparePDFForPrint: (doc: jsPDF): string | null => {
    return PDFUtilsService.preparePDFForPrint(doc);
  }
};
