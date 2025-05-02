
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { DateFormatService } from "./DateFormatService";

export interface CareInfo {
  type: string;
  date: string;
  time: string;
  code?: string;
  description?: string;
}

export interface PrescriptionInfo {
  id: string;
  title: string;
  date: string;
  doctor: string;
  file?: string;
  content?: string;
}

export interface InvoiceInfo {
  id: string;
  date: string;
  amount: number;
  details: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  patientId?: string;
  patientDetails?: {
    first_name?: string;
    last_name?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    social_security_number?: string;
    insurance?: string;
    phone?: string;
    email?: string;
    doctor?: string;
  };
  paid?: boolean;
  totalAmount?: number;
  majorations?: any[];
  careCode?: string;
}

export const PDFGenerationService = {
  /**
   * Génère un PDF pré-rempli avec les informations patient et soins
   */
  generatePrefilledPDF: async (patientId?: string, careInfo?: CareInfo, prescriptions?: PrescriptionInfo[]): Promise<jsPDF | null> => {
    try {
      // Change to async call
      const patientInfo = await PatientService.getPatientInfo(patientId);
      
      if (!patientInfo) {
        return null;
      }
      
      // Créer un nouveau document PDF
      const doc = new jsPDF();
      
      // En-tête
      doc.setFontSize(18);
      doc.text("FEUILLE DE SOINS", 105, 15, { align: "center" });
      
      // Informations patient
      doc.setFontSize(12);
      doc.text("INFORMATIONS PATIENT", 15, 30);
      doc.setFontSize(10);
      const fullName = `${patientInfo.firstName || ""} ${patientInfo.name}`.trim();
      doc.text(`Nom et Prénom: ${fullName}`, 15, 40);
      doc.text(`Adresse: ${patientInfo.address || "Non renseignée"}`, 15, 47);
      doc.text(`N° Sécurité Sociale: ${patientInfo.socialSecurityNumber || "Non renseigné"}`, 15, 54);
      doc.text(`Date de naissance: ${patientInfo.dateOfBirth || "Non renseignée"}`, 15, 61);
      doc.text(`Téléphone: ${patientInfo.phoneNumber || "Non renseigné"}`, 15, 68);
      doc.text(`Email: ${patientInfo.email || "Non renseigné"}`, 15, 75);
      doc.text(`Médecin traitant: ${patientInfo.doctor || "Non renseigné"}`, 15, 82);
      
      // Informations du soin
      doc.setFontSize(12);
      doc.text("INFORMATIONS DU SOIN", 15, 95);
      doc.setFontSize(10);
      doc.text(`Type de soin: ${careInfo?.type || "Non renseigné"}`, 15, 105);
      doc.text(`Code NGAP: ${careInfo?.code || "Non renseigné"}`, 15, 112);
      doc.text(`Date: ${careInfo?.date || DateFormatService.formatCurrentDate()}`, 15, 119);
      doc.text(`Heure: ${careInfo?.time || DateFormatService.formatTime()}`, 15, 126);
      doc.text(`Description: ${careInfo?.description || "Non renseignée"}`, 15, 133);
      
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
   * Sauvegarde un document PDF
   */
  savePDF: (doc: jsPDF, patientId: string): void => {
    const fileName = `feuille_de_soins_${patientId}_${DateFormatService.formatCurrentDate().replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  },
  
  /**
   * Sauvegarde une facture PDF
   */
  saveInvoicePDF: (doc: jsPDF, invoiceId: string): void => {
    const fileName = `facture_${invoiceId}_${DateFormatService.formatCurrentDate().replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  },
  
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
import { PatientService } from './PatientService';
