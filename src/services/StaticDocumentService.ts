
import { toast } from "sonner";

// Simulation de documents téléchargeables
const documents: Record<string, string> = {
  "feuille_de_soins": "/documents/feuille_de_soins_vierge.pdf",
  "aide_memoire_ngap": "/documents/aide_memoire_cotation_ngap.pdf",
  "guide_incompatibilites": "/documents/guide_incompatibilites.pdf"
};

export const StaticDocumentService = {
  /**
   * Récupère l'URL d'un document statique
   */
  getDocumentUrl: (documentKey: string): string | null => {
    const documentUrl = documents[documentKey];
    
    if (!documentUrl) {
      toast.error("Document non trouvé");
      return null;
    }
    
    return documentUrl;
  },
  
  /**
   * Simule le téléchargement d'un document statique
   */
  downloadStaticDocument: (documentKey: string, patientId?: string): boolean => {
    const documentUrl = StaticDocumentService.getDocumentUrl(documentKey);
    
    if (!documentUrl) {
      return false;
    }
    
    const link = document.createElement('a');
    link.href = documentUrl;
    link.setAttribute('download', `${documentKey}${patientId ? `_${patientId}` : ''}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Téléchargement démarré");
    return true;
  }
};
