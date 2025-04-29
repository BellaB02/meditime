
import { toast } from "sonner";

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
}

// Simulation de documents téléchargeables
const documents: Record<string, string> = {
  "feuille_de_soins": "/documents/feuille_de_soins_vierge.pdf",
  "aide_memoire_ngap": "/documents/aide_memoire_cotation_ngap.pdf",
  "guide_incompatibilites": "/documents/guide_incompatibilites.pdf"
};

export const DocumentService = {
  downloadDocument: (documentKey: string) => {
    const documentUrl = documents[documentKey];
    
    if (!documentUrl) {
      toast.error("Document non trouvé");
      return false;
    }
    
    // Simulation de téléchargement (dans une application réelle, cela pointerait vers un fichier réel)
    const link = document.createElement('a');
    link.href = documentUrl;
    link.setAttribute('download', `${documentKey}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Téléchargement démarré");
    return true;
  },
  
  printDocument: (documentKey: string) => {
    window.print();
    toast.success("Impression en cours");
    return true;
  },
  
  generateCareSheet: (careId: string, patientName: string) => {
    // Dans une vraie application, cela générerait une feuille de soins réelle
    toast.success(`Feuille de soins générée pour ${patientName}`);
    
    return {
      id: `CS-${Date.now().toString(36)}`,
      name: `Feuille de soins - ${patientName}`,
      type: "careSheet" as DocumentType,
      date: new Date().toLocaleDateString("fr-FR"),
      patientName
    };
  },
  
  generateInvoice: (data: any) => {
    // Dans une vraie application, cela générerait une facture réelle
    toast.success("Facture générée avec succès");
    
    return {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `Facture ${data.patient}`,
      type: "invoice" as DocumentType,
      date: new Date().toLocaleDateString("fr-FR"),
      patientName: data.patient
    };
  }
};
