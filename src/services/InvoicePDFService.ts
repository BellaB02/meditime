
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { DateFormatService } from "./DateFormatService";
import { InvoiceInfo } from "./PDFTypes";

/**
 * Service for generating invoice PDFs
 */
export const InvoicePDFService = {
  /**
   * Génère une facture en PDF
   */
  generateInvoicePDF: (invoiceInfo: InvoiceInfo): jsPDF | null => {
    try {
      console.log("Génération de facture PDF avec les données:", invoiceInfo);
      
      // Créer un nouveau document PDF
      const doc = new jsPDF();
      
      // En-tête
      doc.setFontSize(18);
      doc.text("FACTURE", 105, 15, { align: "center" });
      
      // Numéro de facture et date
      doc.setFontSize(10);
      doc.text(`Facture n° ${invoiceInfo.id}`, 15, 25);
      doc.text(`Date: ${invoiceInfo.date}`, 15, 30);
      
      // Informations patient si disponibles
      let yPosition = 40; // Position de départ pour les informations patient
      
      if (invoiceInfo.patientDetails) {
        console.log("Données patient disponibles:", invoiceInfo.patientDetails);
        doc.setFontSize(12);
        doc.text("INFORMATIONS PATIENT", 15, yPosition);
        doc.setFontSize(10);
        
        const patientDetails = invoiceInfo.patientDetails;
        const fullName = `${patientDetails.first_name || ""} ${patientDetails.last_name || ""}`.trim();
        
        yPosition += 10;
        doc.text(`Nom et Prénom: ${fullName || "Non renseigné"}`, 15, yPosition);
        
        yPosition += 5;
        doc.text(`Adresse: ${patientDetails.address || "Non renseignée"}`, 15, yPosition);
        
        yPosition += 5;
        const cityAndPostal = [
          patientDetails.postal_code, 
          patientDetails.city
        ].filter(Boolean).join(' ');
        if (cityAndPostal) {
          doc.text(`Code postal et ville: ${cityAndPostal}`, 15, yPosition);
          yPosition += 5;
        }
        
        doc.text(`N° Sécurité Sociale: ${patientDetails.social_security_number || "Non renseigné"}`, 15, yPosition);
        
        yPosition += 5;
        if (patientDetails.insurance) {
          doc.text(`Assurance: ${patientDetails.insurance}`, 15, yPosition);
          yPosition += 5;
        }
        
        if (patientDetails.phone) {
          doc.text(`Téléphone: ${patientDetails.phone}`, 15, yPosition);
          yPosition += 5;
        }
        
        if (patientDetails.doctor) {
          doc.text(`Médecin traitant: ${patientDetails.doctor}`, 15, yPosition);
          yPosition += 5;
        }
        
        yPosition += 5; // Espace supplémentaire avant les détails
      } else {
        console.log("Pas d'information patient disponible dans invoiceInfo.patientDetails");
        
        if (invoiceInfo.patientId) {
          console.log("patientId fourni, mais pas de patientDetails:", invoiceInfo.patientId);
          doc.setFontSize(12);
          doc.text("INFORMATIONS PATIENT", 15, yPosition);
          doc.setFontSize(10);
          
          yPosition += 10;
          doc.text("Patient ID: " + invoiceInfo.patientId, 15, yPosition);
          yPosition += 5;
          doc.text("(Détails patient non disponibles)", 15, yPosition);
          
          yPosition += 10;
        }
      }
      
      // Type de soin si disponible
      if (invoiceInfo.careCode) {
        doc.text(`Type de soin: ${invoiceInfo.careCode}`, 15, yPosition);
        yPosition += 8;
      }
      
      // Détails de la facture
      doc.setFontSize(12);
      doc.text("DÉTAILS", 15, yPosition);
      
      // En-tête du tableau
      yPosition += 10;
      doc.setFontSize(10);
      doc.text("Description", 15, yPosition);
      doc.text("Quantité", 100, yPosition);
      doc.text("Prix unitaire", 130, yPosition);
      doc.text("Total", 175, yPosition);
      
      yPosition += 2;
      doc.line(15, yPosition, 195, yPosition);
      
      // Contenu du tableau
      yPosition += 8;
      invoiceInfo.details.forEach(detail => {
        doc.text(detail.description, 15, yPosition);
        doc.text(detail.quantity.toString(), 100, yPosition);
        doc.text(`${detail.unitPrice.toFixed(2)} €`, 130, yPosition);
        doc.text(`${detail.total.toFixed(2)} €`, 175, yPosition);
        yPosition += 8;
      });
      
      // Ajouter les majorations si présentes
      if (invoiceInfo.majorations && invoiceInfo.majorations.length > 0) {
        invoiceInfo.majorations.forEach(majoration => {
          const description = `${majoration.code} - ${majoration.description || 'Majoration'}`;
          doc.text(description, 15, yPosition);
          doc.text("1", 100, yPosition);
          doc.text(`${parseFloat(majoration.rate).toFixed(2)} €`, 130, yPosition);
          doc.text(`${parseFloat(majoration.rate).toFixed(2)} €`, 175, yPosition);
          yPosition += 8;
        });
      }
      
      // Ligne de séparation
      doc.line(15, yPosition, 195, yPosition);
      yPosition += 8;
      
      // Total
      const totalAmount = invoiceInfo.totalAmount || invoiceInfo.details.reduce((sum, detail) => sum + detail.total, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Total:", 130, yPosition);
      doc.text(`${totalAmount.toFixed(2)} €`, 175, yPosition);
      
      // Statut de paiement
      yPosition += 12;
      if (invoiceInfo.paid) {
        doc.setTextColor(0, 128, 0); // Green color
        doc.text("PAYÉ", 175, yPosition);
      } else {
        doc.setTextColor(255, 0, 0); // Red color
        doc.text("À PAYER", 175, yPosition);
      }
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      return doc;
    } catch (error) {
      console.error("Erreur lors de la génération de la facture:", error);
      toast.error("Erreur lors de la génération de la facture");
      return null;
    }
  },
  
  /**
   * Sauvegarde une facture PDF
   */
  saveInvoicePDF: (doc: jsPDF, invoiceId: string): void => {
    const fileName = `facture_${invoiceId}_${DateFormatService.formatCurrentDate().replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  }
};
