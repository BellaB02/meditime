
import { supabase } from "@/integrations/supabase/client";
import { billingService } from "@/integrations/supabase/services/billingService";
import { PDFGenerationService, InvoiceInfo } from "./PDFGenerationService";
import { format } from "date-fns";
import { toast } from "sonner";

export const BillingService = {
  /**
   * Récupère les détails complets d'une facturation avec les informations patient
   */
  getBillingDetails: async (recordId: string) => {
    try {
      console.log("BillingService: Récupération des détails de facturation pour", recordId);
      const billingDetails = await billingService.getBillingDetails(recordId);
      return billingDetails;
    } catch (error) {
      console.error("BillingService: Erreur lors de la récupération des détails de facturation", error);
      toast.error("Erreur lors de la récupération des détails de facturation");
      throw error;
    }
  },
  
  /**
   * Génère une facture PDF complète avec les informations patient
   */
  generateInvoicePDF: async (recordId: string): Promise<{ pdfDoc: any, patientName: string }> => {
    try {
      // Récupérer les détails complets depuis le service Supabase
      const billingDetails = await BillingService.getBillingDetails(recordId);
      console.log("BillingService: Détails complets récupérés pour génération PDF:", billingDetails);
      
      if (!billingDetails) {
        throw new Error("Détails de facturation non trouvés");
      }
      
      const patientName = billingDetails.patients ? 
        `${billingDetails.patients.first_name || ""} ${billingDetails.patients.last_name || ""}`.trim() : 
        "Patient";
      
      // Préparer les détails pour la facture
      const invoiceInfo: InvoiceInfo = {
        id: recordId.substring(0, 8),
        date: format(new Date(billingDetails.created_at), "dd/MM/yyyy"),
        amount: parseFloat(billingDetails.total_amount || 0),
        details: [
          {
            description: `${billingDetails.care_code} - Acte de soins`,
            quantity: billingDetails.quantity || 1,
            unitPrice: parseFloat(billingDetails.base_amount || 0),
            total: parseFloat(billingDetails.base_amount || 0)
          },
          ...(billingDetails.majorations || []).map((maj: any) => ({
            description: `${maj.code} - ${maj.description}`,
            quantity: 1,
            unitPrice: parseFloat(maj.rate || 0),
            total: parseFloat(maj.rate || 0)
          }))
        ],
        patientId: billingDetails.patient_id,
        patientDetails: billingDetails.patients,
        paid: billingDetails.payment_status === "paid",
        totalAmount: parseFloat(billingDetails.total_amount || 0),
        majorations: billingDetails.majorations,
        careCode: billingDetails.care_code
      };
      
      // Générer le PDF
      const pdfDoc = PDFGenerationService.generateInvoicePDF(invoiceInfo);
      
      if (!pdfDoc) {
        throw new Error("Erreur lors de la génération du PDF");
      }
      
      return { pdfDoc, patientName };
    } catch (error) {
      console.error("BillingService: Erreur lors de la génération de la facture", error);
      toast.error("Erreur lors de la génération de la facture");
      throw error;
    }
  },
  
  /**
   * Télécharge une facture au format PDF
   */
  downloadInvoice: async (recordId: string): Promise<void> => {
    try {
      const { pdfDoc, patientName } = await BillingService.generateInvoicePDF(recordId);
      PDFGenerationService.saveInvoicePDF(pdfDoc, recordId.substring(0, 8));
      toast.success(`Téléchargement de la facture pour ${patientName}`);
    } catch (error) {
      console.error("BillingService: Erreur lors du téléchargement de la facture", error);
      toast.error("Erreur lors du téléchargement de la facture");
    }
  },
  
  /**
   * Imprime une facture PDF
   */
  printInvoice: async (recordId: string): Promise<void> => {
    try {
      const { pdfDoc, patientName } = await BillingService.generateInvoicePDF(recordId);
      const pdfUrl = PDFGenerationService.preparePDFForPrint(pdfDoc);
      
      if (!pdfUrl) {
        throw new Error("Erreur lors de la préparation du PDF pour impression");
      }
      
      const printWindow = window.open(pdfUrl, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
        toast.success(`Impression de la facture pour ${patientName}`);
      } else {
        toast.error("Impossible d'ouvrir la fenêtre d'impression");
      }
    } catch (error) {
      console.error("BillingService: Erreur lors de l'impression de la facture", error);
      toast.error("Erreur lors de l'impression de la facture");
    }
  }
};
