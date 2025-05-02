
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { DateFormatService } from "./DateFormatService";
import { CareInfo, PrescriptionInfo } from "./PDFTypes";
import { PatientService } from './PatientService';

/**
 * Service for generating care sheet PDFs
 */
export const CareSheetPDFService = {
  /**
   * Génère un PDF pré-rempli avec les informations patient et soins
   */
  generatePrefilledPDF: async (patientId?: string, careInfo?: CareInfo, prescriptions?: PrescriptionInfo[]): Promise<jsPDF | null> => {
    try {
      // Récupérer les infos patient
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
   * Sauvegarde un document PDF
   */
  savePDF: (doc: jsPDF, patientId: string): void => {
    const fileName = `feuille_de_soins_${patientId}_${DateFormatService.formatCurrentDate().replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  }
};
