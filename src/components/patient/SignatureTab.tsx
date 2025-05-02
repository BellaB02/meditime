
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileSignature, File, Download, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Signature } from "@/components/ui/signature";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PDFGenerationService } from "@/services/PDFGenerationService";

interface SignatureTabProps {
  patientId: string;
  patientName: string;
}

interface SignedDocument {
  id: string;
  title: string;
  type: string;
  date: string;
  signatureDataUrl: string;
  pdfUrl?: string;
}

const SignatureTab: React.FC<SignatureTabProps> = ({ patientId, patientName }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
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

  // Types de documents disponibles
  const documentTypes = [
    "Consentement",
    "Décharge de responsabilité",
    "Autorisation de soins",
    "Attestation de présence",
    "Fiche de liaison",
    "Autre"
  ];

  const handleSignatureChange = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl);
  };

  const handleCreateDocument = () => {
    if (!documentTitle) {
      toast.error("Veuillez entrer un titre de document");
      return;
    }

    if (!documentType) {
      toast.error("Veuillez sélectionner un type de document");
      return;
    }

    if (!signatureDataUrl) {
      toast.error("Veuillez signer le document");
      return;
    }

    // Créer le PDF
    const signedDocument: SignedDocument = {
      id: `sig-${Date.now()}`,
      title: documentTitle,
      type: documentType,
      date: format(new Date(), "dd/MM/yyyy"),
      signatureDataUrl: signatureDataUrl
    };

    setSignedDocuments([signedDocument, ...signedDocuments]);
    
    // Réinitialiser le formulaire et fermer le dialog
    toast.success("Document signé et enregistré");
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setDocumentTitle("");
    setDocumentType("");
    setSignatureDataUrl(null);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Documents signés</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
            <FileSignature size={16} className="mr-2" />
            Nouveau document à signer
          </Button>
        </CardHeader>
        <CardContent>
          {signedDocuments.length > 0 ? (
            <div className="space-y-4">
              {signedDocuments.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">{doc.title}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div>Type: {doc.type}</div>
                      <div>Date: {doc.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="border rounded w-16 h-10 overflow-hidden">
                      <img 
                        src={doc.signatureDataUrl} 
                        alt="Signature" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(doc)}
                    >
                      <Download size={16} className="mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <FileSignature className="mx-auto h-8 w-8 mb-2" />
              <p>Aucun document signé</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouveau document avec signature</DialogTitle>
            <DialogDescription>
              Créez un document à faire signer par le patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentTitle">Titre du document</Label>
                <Input 
                  id="documentTitle" 
                  placeholder="Ex: Consentement aux soins" 
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentType">Type de document</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label>Signature</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Demandez au patient de signer ci-dessous
              </p>
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="text-center mb-2">
                  <p className="font-medium">{patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
                <Signature
                  width={550}
                  height={200}
                  onSave={handleSignatureChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateDocument}>
              Enregistrer le document signé
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignatureTab;
