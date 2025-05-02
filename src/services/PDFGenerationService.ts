
import { jsPDF } from "jspdf";
import { PatientInfo, PatientService } from "./PatientService";
import { CareInfo, InvoiceInfo, PrescriptionInfo } from "./PDFTypes";

/**
 * Service pour la génération de PDFs
 */
export const PDFGenerationService = {
  /**
   * Génère un PDF pré-rempli pour une feuille de soins
   */
  generatePrefilledPDF: async (
    patientId?: string, 
    careInfo?: CareInfo,
    prescriptions?: PrescriptionInfo[]
  ): Promise<jsPDF> => {
    const doc = new jsPDF();
    
    try {
      // Récupérer les informations du patient si un ID est fourni
      let patientInfo: PatientInfo | null = null;
      if (patientId) {
        patientInfo = await PatientService.getPatientInfo(patientId);
      }
      
      // Ajouter l'en-tête
      doc.setFontSize(22);
      doc.text("Feuille de Soins", 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.text("Date: " + (careInfo?.date || new Date().toLocaleDateString("fr-FR")), 20, 35);
      
      // Informations du patient
      if (patientInfo) {
        doc.setFontSize(14);
        doc.text("Informations du patient", 20, 50);
        doc.setFontSize(12);
        doc.text(`Nom: ${patientInfo.name || ""}`, 25, 60);
        doc.text(`Prénom: ${patientInfo.firstName || ""}`, 25, 67);
        doc.text(`Date de naissance: ${patientInfo.dateOfBirth || ""}`, 25, 74);
        doc.text(`Numéro de sécurité sociale: ${patientInfo.socialSecurityNumber || ""}`, 25, 81);
        doc.text(`Adresse: ${patientInfo.address || ""}`, 25, 88);
      }
      
      // Informations de soins
      if (careInfo) {
        doc.setFontSize(14);
        doc.text("Acte de soins", 20, 105);
        doc.setFontSize(12);
        doc.text(`Type: ${careInfo.type || ""}`, 25, 115);
        doc.text(`Code NGAP: ${careInfo.code || ""}`, 25, 122);
        doc.text(`Description: ${careInfo.description || ""}`, 25, 129);
        doc.text(`Date: ${careInfo.date || ""}`, 25, 136);
        doc.text(`Heure: ${careInfo.time || ""}`, 25, 143);
      }
      
      // Prescriptions si fournies
      if (prescriptions && prescriptions.length > 0) {
        doc.setFontSize(14);
        doc.text("Prescriptions", 20, 160);
        doc.setFontSize(12);
        
        prescriptions.forEach((prescription, index) => {
          const yPos = 170 + index * 20;
          doc.text(`- ${prescription.name}: ${prescription.dosage} (${prescription.frequency})`, 25, yPos);
        });
      }
      
      // Zone de signature
      doc.setFontSize(14);
      doc.text("Signature du praticien", 20, 240);
      doc.rect(25, 245, 60, 30);
      
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      // Continuer avec un PDF minimal en cas d'erreur
    }
    
    return doc;
  },
  
  /**
   * Génère un PDF de facture
   */
  generateInvoicePDF: (invoiceInfo: InvoiceInfo): jsPDF => {
    const doc = new jsPDF();
    
    try {
      // Ajouter l'en-tête
      doc.setFontSize(22);
      doc.text("Facture", 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.text("Numéro de facture: " + (invoiceInfo.invoiceNumber || ""), 20, 35);
      doc.text("Date: " + (invoiceInfo.date || new Date().toLocaleDateString("fr-FR")), 20, 42);
      
      // Informations du patient
      if (invoiceInfo.patient) {
        doc.setFontSize(14);
        doc.text("Patient", 20, 55);
        doc.setFontSize(12);
        doc.text(`${invoiceInfo.patient.name || ""} ${invoiceInfo.patient.firstName || ""}`, 25, 65);
        if (invoiceInfo.patient.address) {
          doc.text(invoiceInfo.patient.address, 25, 72);
        }
      }
      
      // Détails de la facture
      doc.setFontSize(14);
      doc.text("Détails", 20, 90);
      doc.setFontSize(12);
      
      // En-têtes du tableau
      doc.text("Description", 25, 100);
      doc.text("Qté", 120, 100);
      doc.text("Prix unitaire", 140, 100);
      doc.text("Total", 175, 100);
      
      // Ligne de séparation
      doc.line(20, 105, 190, 105);
      
      // Contenu du tableau
      let yPos = 115;
      let total = 0;
      
      if (invoiceInfo.items && invoiceInfo.items.length > 0) {
        invoiceInfo.items.forEach((item, index) => {
          const itemTotal = item.quantity * item.unitPrice;
          total += itemTotal;
          
          doc.text(item.description, 25, yPos);
          doc.text(item.quantity.toString(), 120, yPos);
          doc.text(item.unitPrice.toFixed(2) + " €", 140, yPos);
          doc.text(itemTotal.toFixed(2) + " €", 175, yPos);
          
          yPos += 10;
        });
      }
      
      // Ligne de séparation avant le total
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
      
      // Total
      doc.setFontSize(14);
      doc.text("Total:", 140, yPos);
      doc.text(total.toFixed(2) + " €", 175, yPos);
      
    } catch (error) {
      console.error("Erreur lors de la génération de la facture:", error);
      // Continuer avec un PDF minimal en cas d'erreur
    }
    
    return doc;
  },
  
  /**
   * Sauvegarde le PDF avec un nom de fichier spécifique
   */
  savePDF: (doc: jsPDF, fileName: string): void => {
    doc.save(fileName);
  },

  /**
   * Sauvegarde le PDF de facture
   */
  saveInvoicePDF: (doc: jsPDF, invoiceNumber: string): void => {
    doc.save(`facture_${invoiceNumber}_${new Date().toISOString().split('T')[0]}.pdf`);
  },
  
  /**
   * Prépare le PDF pour impression
   */
  preparePDFForPrint: (doc: jsPDF): void => {
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl, '_blank');
    
    if (printWindow) {
      printWindow.onload = function() {
        printWindow.print();
      };
    } else {
      console.error("Impossible d'ouvrir la fenêtre d'impression");
    }
  }
};
