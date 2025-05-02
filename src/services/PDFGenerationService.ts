
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { DateFormatService } from "./DateFormatService";
import { PatientService } from './PatientService';

// Types pour les informations nécessaires à la génération des PDF
export interface CareInfo {
  type: string;
  date: string;
  time: string;
  code?: string;
  description?: string;
}

export interface PrescriptionInfo {
  title: string;
  date: string;
  doctor: string;
}

export interface InvoiceInfo {
  invoiceNumber: string;
  date: string;
  patientName: string;
  acts: Array<{
    code: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
}

/**
 * Service pour la génération de PDF
 */
export const PDFGenerationService = {
  /**
   * Génère un PDF pré-rempli avec les informations patient et soins
   */
  generatePrefilledPDF: async (patientId?: string, careInfo?: CareInfo, prescriptions?: PrescriptionInfo[]): Promise<jsPDF | null> => {
    try {
      // Créer un nouveau document PDF
      const doc = new jsPDF();
      
      // En-tête
      doc.setFontSize(18);
      doc.text("FEUILLE DE SOINS", 105, 15, { align: "center" });
      
      // Informations patient
      let patientInfo = null;
      if (patientId) {
        try {
          patientInfo = await PatientService.getPatientInfo(patientId);
        } catch (error) {
          console.warn("Impossible de récupérer les informations patient:", error);
          // Continue sans les informations patient
        }
      }
      
      doc.setFontSize(12);
      doc.text("INFORMATIONS PATIENT", 15, 30);
      doc.setFontSize(10);
      
      if (patientInfo) {
        const fullName = `${patientInfo.firstName || ""} ${patientInfo.name}`.trim();
        doc.text(`Nom et Prénom: ${fullName}`, 15, 40);
        doc.text(`Adresse: ${patientInfo.address || "Non renseignée"}`, 15, 47);
        doc.text(`N° Sécurité Sociale: ${patientInfo.socialSecurityNumber || "Non renseigné"}`, 15, 54);
        doc.text(`Date de naissance: ${patientInfo.dateOfBirth || "Non renseignée"}`, 15, 61);
        doc.text(`Téléphone: ${patientInfo.phoneNumber || "Non renseigné"}`, 15, 68);
        doc.text(`Email: ${patientInfo.email || "Non renseigné"}`, 15, 75);
        doc.text(`Médecin traitant: ${patientInfo.doctor || "Non renseigné"}`, 15, 82);
      } else {
        doc.text("Nom et Prénom: ________________________________", 15, 40);
        doc.text("Adresse: ________________________________", 15, 47);
        doc.text("N° Sécurité Sociale: ________________________________", 15, 54);
        doc.text("Date de naissance: ________________________________", 15, 61);
        doc.text("Téléphone: ________________________________", 15, 68);
        doc.text("Email: ________________________________", 15, 75);
        doc.text("Médecin traitant: ________________________________", 15, 82);
      }
      
      // Informations du soin
      doc.setFontSize(12);
      doc.text("INFORMATIONS DU SOIN", 15, 95);
      doc.setFontSize(10);
      doc.text(`Type de soin: ${careInfo?.type || "________________________________"}`, 15, 105);
      doc.text(`Code NGAP: ${careInfo?.code || "________________________________"}`, 15, 112);
      doc.text(`Date: ${careInfo?.date || DateFormatService.formatCurrentDate()}`, 15, 119);
      doc.text(`Heure: ${careInfo?.time || DateFormatService.formatTime()}`, 15, 126);
      doc.text(`Description: ${careInfo?.description || "________________________________"}`, 15, 133);
      
      // Ordonnances associées
      if (prescriptions && prescriptions.length > 0) {
        let yPosition = 150;
        
        doc.setFontSize(12);
        doc.text("ORDONNANCES ASSOCIÉES", 15, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        prescriptions.forEach((prescription, index) => {
          doc.text(`${index + 1}. ${prescription.title}`, 15, yPosition);
          yPosition += 5;
          doc.text(`   Date: ${prescription.date} - Dr. ${prescription.doctor}`, 15, yPosition);
          yPosition += 8;
        });
      }
      
      // Signature
      doc.setFontSize(12);
      doc.text("SIGNATURE DU PRATICIEN", 15, 220);
      doc.line(15, 235, 80, 235);
      
      return doc;
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
      return null;
    }
  },
  
  /**
   * Génère une facture en PDF
   */
  generateInvoicePDF: (invoiceInfo: InvoiceInfo): jsPDF | null => {
    try {
      // Créer un nouveau document PDF
      const doc = new jsPDF();
      
      // En-tête
      doc.setFontSize(18);
      doc.text("FACTURE", 105, 15, { align: "center" });
      
      // Informations facture
      doc.setFontSize(12);
      doc.text("INFORMATIONS FACTURE", 15, 30);
      doc.setFontSize(10);
      doc.text(`N° Facture: ${invoiceInfo.invoiceNumber}`, 15, 40);
      doc.text(`Date: ${invoiceInfo.date}`, 15, 47);
      doc.text(`Patient: ${invoiceInfo.patientName}`, 15, 54);
      
      // Tableau des actes
      let yPosition = 70;
      doc.setFontSize(12);
      doc.text("DÉTAIL DES ACTES", 15, yPosition);
      yPosition += 10;
      
      // En-têtes du tableau
      doc.setFontSize(10);
      doc.text("Code", 15, yPosition);
      doc.text("Description", 45, yPosition);
      doc.text("Quantité", 120, yPosition);
      doc.text("Prix unitaire", 150, yPosition);
      doc.text("Total", 180, yPosition);
      
      yPosition += 7;
      doc.line(15, yPosition - 5, 195, yPosition - 5); // Ligne après les en-têtes
      
      // Lignes du tableau
      invoiceInfo.acts.forEach(act => {
        doc.text(act.code, 15, yPosition);
        doc.text(act.description, 45, yPosition);
        doc.text(act.quantity.toString(), 125, yPosition);
        doc.text(`${act.unitPrice.toFixed(2)} €`, 155, yPosition);
        doc.text(`${(act.quantity * act.unitPrice).toFixed(2)} €`, 180, yPosition);
        yPosition += 7;
      });
      
      // Total
      yPosition += 5;
      doc.line(15, yPosition - 5, 195, yPosition - 5);
      doc.setFontSize(11);
      doc.text("Total:", 150, yPosition);
      doc.text(`${invoiceInfo.totalAmount.toFixed(2)} €`, 180, yPosition);
      
      return doc;
    } catch (error) {
      console.error("Erreur lors de la génération de la facture:", error);
      toast.error("Erreur lors de la génération de la facture");
      return null;
    }
  },
  
  /**
   * Sauvegarde un document PDF
   */
  savePDF: (doc: jsPDF, fileName: string): void => {
    doc.save(fileName);
  }
};
