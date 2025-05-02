
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { PDFGenerationService } from "@/services/PDFGenerationService";

interface SignedDocument {
  id: string;
  title: string;
  type: string;
  date: string;
  signatureDataUrl: string;
  pdfUrl?: string;
}

export const useSignatureTab = (patientId: string) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [signedDocuments, setSignedDocuments] = useState<SignedDocument[]>([
    {
      id: "sig-1",
      title: "Consentement aux soins",
      type: "Consentement",
      date: "15/04/2025",
      signatureDataUrl: "/placeholder.svg",
      pdfUrl: "/documents/aide_memoire_cotation_ngap.pdf"
    }
  ]);

  const handleCreateDocument = (title: string, type: string, signatureDataUrl: string) => {
    // Créer le PDF
    const signedDocument: SignedDocument = {
      id: `sig-${Date.now()}`,
      title: title,
      type: type,
      date: format(new Date(), "dd/MM/yyyy"),
      signatureDataUrl: signatureDataUrl
    };

    setSignedDocuments([signedDocument, ...signedDocuments]);
    
    // Réinitialiser le formulaire et fermer le dialog
    toast.success("Document signé et enregistré");
    setIsDialogOpen(false);
  };

  const handleDownload = async (document: SignedDocument) => {
    try {
      // Utiliser PDFGenerationService pour générer le PDF avec signature
      const doc = await PDFGenerationService.generatePrefilledPDF(
        patientId,
        { 
          type: document.type,
          date: document.date,
          time: format(new Date(), "HH:mm"),
          description: document.title
        }
      );
      
      if (doc) {
        // Ajouter la signature au PDF
        if (document.signatureDataUrl) {
          doc.addImage(
            document.signatureDataUrl, 
            "PNG", 
            15, 
            190, 
            70, 
            40
          );
        }
        
        // Télécharger le PDF
        const fileName = `${document.type.toLowerCase()}_${document.title.replace(/\s+/g, '_').toLowerCase()}_${patientId}.pdf`;
        doc.save(fileName);
        toast.success("Document téléchargé avec succès");
      } else {
        toast.error("Erreur lors de la génération du document");
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement du document");
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    signedDocuments,
    handleCreateDocument,
    handleDownload
  };
};
