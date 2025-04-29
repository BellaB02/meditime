
import { toast } from "sonner";
import { PatientService } from "./PatientService";
import { PDFGenerationService, CareInfo } from "./PDFGenerationService";
import { StaticDocumentService } from "./StaticDocumentService";
import { DateFormatService } from "./DateFormatService";

export type DocumentType = 
  | "invoice" 
  | "careSheet" 
  | "ngapGuide" 
  | "prescription";

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  date: string;
  url?: string;
  patientId?: string;
  patientName?: string;
  patientInfo?: {
    name: string;
    address?: string;
    phoneNumber?: string;
    socialSecurityNumber?: string;
    dateOfBirth?: string;
  };
  careInfo?: CareInfo;
}

export const DocumentService = {
  downloadDocument: (documentKey: string, patientId?: string, careInfo?: any, preFilled: boolean = false) => {
    // Si preFilled est true, générer un PDF pré-rempli personnalisé
    if (preFilled && patientId) {
      const doc = PDFGenerationService.generatePrefilledPDF(patientId, careInfo);
      
      if (doc) {
        PDFGenerationService.savePDF(doc, patientId);
        
        const patientInfo = PatientService.getPatientInfo(patientId);
        
        if (patientInfo) {
          // Notification détaillée
          toast.success(`Feuille de soins générée et téléchargée pour ${patientInfo.name}`, {
            description: `Le document a été pré-rempli avec toutes les informations patient et soins`,
            duration: 5000
          });
        }
        
        return true;
      }
      return false;
    }
    
    // Comportement par défaut pour les documents non personnalisés
    const documentUrl = StaticDocumentService.getDocumentUrl(documentKey);
    
    if (!documentUrl) {
      return false;
    }

    // Dans une vraie application, cela génèrerait un PDF dynamique avec les informations du patient
    // Pour la simulation, nous affichons simplement un message pour indiquer quelles informations seraient incluses
    
    let patientInfo = null;
    
    if (patientId) {
      patientInfo = PatientService.getPatientInfo(patientId);
      
      if (patientInfo) {
        // Affiche les informations qui seraient incluses dans le document
        console.log("Informations pré-remplies:", {
          patient: patientInfo,
          care: careInfo,
          date: DateFormatService.formatCurrentDate()
        });

        // Notification explicite des informations pré-remplies
        toast.info(`Feuille de soins pré-remplie avec les données suivantes:`, {
          description: `
            Patient: ${patientInfo.name}
            Adresse: ${patientInfo.address}
            Numéro SS: ${patientInfo.socialSecurityNumber}
            Type de soin: ${careInfo?.type || 'Non spécifié'}
            Date: ${careInfo?.date || DateFormatService.formatCurrentDate()}
          `,
          duration: 5000
        });
      }
    }
    
    return StaticDocumentService.downloadStaticDocument(documentKey, patientId);
  },
  
  printDocument: (documentKey: string, patientId?: string, careInfo?: any, preFilled: boolean = false) => {
    // Si preFilled est true, générer un PDF pré-rempli pour impression
    if (preFilled && patientId) {
      const doc = PDFGenerationService.generatePrefilledPDF(patientId, careInfo);
      
      if (doc) {
        // Ouvrir le PDF dans une nouvelle fenêtre pour impression
        const url = PDFGenerationService.preparePDFForPrint(doc);
        
        if (url) {
          const printWindow = window.open(url, '_blank');
          
          if (printWindow) {
            printWindow.addEventListener('load', () => {
              printWindow.print();
              URL.revokeObjectURL(url);
            });
          } else {
            toast.error("Impossible d'ouvrir la fenêtre d'impression. Vérifiez les paramètres de votre navigateur.");
          }
          
          const patientInfo = PatientService.getPatientInfo(patientId);
          
          if (patientInfo) {
            toast.success(`Feuille de soins pré-remplie prête pour impression pour ${patientInfo.name}`);
          }
          
          return true;
        }
      }
      return false;
    }
    
    // Comportement par défaut pour les impressions non personnalisées
    if (patientId) {
      const patientInfo = PatientService.getPatientInfo(patientId);
      if (patientInfo) {
        // Notification détaillée des informations utilisées
        toast.info(`Document pré-rempli pour impression avec les données de ${patientInfo.name}`, {
          description: `
            Adresse: ${patientInfo.address}
            Numéro SS: ${patientInfo.socialSecurityNumber}
            Type de soin: ${careInfo?.type || 'Non spécifié'}
            Date: ${careInfo?.date || DateFormatService.formatCurrentDate()}
          `,
          duration: 5000
        });
      }
    }
    
    window.print();
    toast.success("Impression en cours");
    return true;
  },
  
  generateCareSheet: (careId: string, patientName: string, patientId?: string) => {
    // Récupérer les informations du patient si l'ID est fourni
    const patientInfo = patientId ? PatientService.getPatientInfo(patientId) : undefined;
    
    // Notification plus détaillée des informations utilisées pour la feuille de soins
    if (patientInfo) {
      toast.success(`Feuille de soins générée pour ${patientName}`, {
        description: `Avec informations complètes: adresse, n° sécurité sociale, etc.`,
        duration: 4000
      });
    } else {
      toast.success(`Feuille de soins générée pour ${patientName}`);
    }
    
    return {
      id: `CS-${Date.now().toString(36)}`,
      name: `Feuille de soins - ${patientName}`,
      type: "careSheet" as DocumentType,
      date: DateFormatService.formatCurrentDate(),
      patientName,
      patientId,
      patientInfo: patientInfo || { name: patientName },
      careInfo: {
        type: "Soin infirmier",
        date: DateFormatService.formatCurrentDate(),
        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      }
    };
  },
  
  generateInvoice: (data: any) => {
    toast.success("Facture générée avec succès");
    
    return {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `Facture ${data.patient}`,
      type: "invoice" as DocumentType,
      date: DateFormatService.formatCurrentDate(),
      patientName: data.patient
    };
  }
};
