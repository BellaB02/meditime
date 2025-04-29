
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { PatientService, PatientInfo } from "./PatientService";
import { DateFormatService } from "./DateFormatService";

export interface CareInfo {
  type: string;
  date: string;
  time: string;
  code?: string;
  description?: string;
}

export const PDFGenerationService = {
  /**
   * Génère un PDF pré-rempli avec les informations patient et soins
   */
  generatePrefilledPDF: (patientId?: string, careInfo?: CareInfo): jsPDF | null => {
    try {
      const patientInfo = PatientService.validatePatientInfo(patientId);
      
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
      doc.text(`Nom et Prénom: ${patientInfo.name}`, 15, 40);
      doc.text(`Adresse: ${patientInfo.address || "Non renseignée"}`, 15, 47);
      doc.text(`N° Sécurité Sociale: ${patientInfo.socialSecurityNumber || "Non renseigné"}`, 15, 54);
      doc.text(`Date de naissance: ${patientInfo.dateOfBirth || "Non renseignée"}`, 15, 61);
      doc.text(`Téléphone: ${patientInfo.phoneNumber || "Non renseigné"}`, 15, 68);
      
      // Informations du soin
      doc.setFontSize(12);
      doc.text("INFORMATIONS DU SOIN", 15, 85);
      doc.setFontSize(10);
      doc.text(`Type de soin: ${careInfo?.type || "Non renseigné"}`, 15, 95);
      doc.text(`Code NGAP: ${careInfo?.code || "Non renseigné"}`, 15, 102);
      doc.text(`Date: ${careInfo?.date || DateFormatService.formatCurrentDate()}`, 15, 109);
      doc.text(`Heure: ${careInfo?.time || DateFormatService.formatTime()}`, 15, 116);
      doc.text(`Description: ${careInfo?.description || "Non renseignée"}`, 15, 123);
      
      // Signature
      doc.setFontSize(12);
      doc.text("SIGNATURE DU PRATICIEN", 15, 150);
      doc.line(15, 165, 80, 165);
      
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
