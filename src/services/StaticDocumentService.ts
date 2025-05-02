
import { toast } from "sonner";

/**
 * Service pour la gestion des documents statiques
 */
export const StaticDocumentService = {
  /**
   * Télécharge un document statique
   */
  downloadStaticDocument: (documentType: string): void => {
    try {
      let documentPath = "";
      
      switch (documentType) {
        case "feuille_de_soins":
          documentPath = "/documents/feuille_de_soins_vierge.pdf";
          break;
        case "guide_cotation":
          documentPath = "/documents/aide_memoire_cotation_ngap.pdf";
          break;
        case "incompatibilites":
          documentPath = "/documents/guide_incompatibilites.pdf";
          break;
        default:
          documentPath = "/documents/feuille_de_soins_vierge.pdf";
      }
      
      // Créer un lien pour déclencher le téléchargement
      const link = document.createElement('a');
      link.href = documentPath;
      link.download = `${documentType}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Document téléchargé avec succès");
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
      toast.error("Erreur lors du téléchargement du document");
    }
  }
};
