
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PrescriptionsTab from "./PrescriptionsTab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePatientsService } from "@/hooks/usePatientsService";
import { CareDocument } from "@/integrations/supabase/services/types";

interface DocumentsTabProps {
  patientId: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ patientId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documents, setDocuments] = useState<CareDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Utiliser le hook pour les documents du patient
  const { usePatientDocuments, useUploadPatientDocument } = usePatientsService();
  const { data: patientDocuments, isLoading: isLoadingDocuments } = usePatientDocuments(patientId);
  const { mutateAsync: uploadDocument, isLoading: isUploading } = useUploadPatientDocument();
  
  // Types de documents disponibles
  const documentTypes = [
    "Résultat d'analyse",
    "Imagerie",
    "Compte-rendu médical",
    "Ordonnance",
    "Document administratif",
    "Autre"
  ];
  
  // Synchroniser les documents quand ils sont chargés
  useEffect(() => {
    if (patientDocuments) {
      setDocuments(patientDocuments);
    }
  }, [patientDocuments]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    
    if (!documentTitle.trim()) {
      toast.error("Veuillez entrer un titre pour le document");
      return;
    }
    
    if (!documentType) {
      toast.error("Veuillez sélectionner un type de document");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Utiliser le service Supabase pour téléverser le document
      await uploadDocument({
        patientId,
        file: selectedFile,
        metadata: {
          document_type: documentType,
          title: documentTitle,
          description: `Document ajouté le ${new Date().toLocaleDateString('fr-FR')}`
        }
      });
      
      // Réinitialiser le formulaire et fermer le dialog
      toast.success(`Document "${documentTitle}" ajouté avec succès`);
      setSelectedFile(null);
      setDocumentTitle("");
      setDocumentType("");
      setIsDialogOpen(false);
      
    } catch (error) {
      console.error("Erreur lors du téléversement:", error);
      toast.error("Erreur lors de l'ajout du document");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = (documentId: string, filePath: string) => {
    try {
      // Créer un lien pour télécharger le fichier PDF
      const link = window.document.createElement('a');
      link.href = filePath;
      
      // Définir un nom de fichier basé sur le titre du document
      const docToDownload = documents.find(doc => doc.id === documentId);
      const fileName = docToDownload ? 
        `${docToDownload.title.replace(/\s+/g, '_').toLowerCase()}.pdf` : 
        'document.pdf';
        
      link.setAttribute('download', fileName);
      
      // Ajouter le lien au document, cliquer dessus, puis le supprimer
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast.success(`Téléchargement du document: ${docToDownload?.title || "Document"}`);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement du document");
    }
  };
  
  return (
    <div className="space-y-6">
      <PrescriptionsTab prescriptions={[
        {
          id: "pre-1",
          title: "Ordonnance de renouvellement",
          date: "15/04/2025",
          doctor: "Dr. Martin",
          file: "/documents/aide_memoire_cotation_ngap.pdf"
        }
      ]} patientName="Patient" />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Documents</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
            <Upload size={16} className="mr-2" />
            Ajouter un document
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingDocuments ? (
            <div className="text-center py-6">
              Chargement des documents...
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">{doc.title}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div>Date: {new Date(doc.created_at || "").toLocaleDateString('fr-FR')}</div>
                      <div>Type: {doc.document_type}</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownload(doc.id, doc.storage_path || "")}
                    disabled={!doc.storage_path}
                  >
                    <Download size={16} className="mr-2" />
                    Télécharger
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Aucun document enregistré
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un document</DialogTitle>
            <DialogDescription>
              Téléversez un fichier pour ce patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="documentTitle">Titre du document</Label>
              <Input 
                id="documentTitle" 
                placeholder="Ex: Résultats d'analyse" 
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="documentType">Type de document</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="documentType">
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
            
            <div>
              <Label htmlFor="documentFile">Fichier</Label>
              <div className="mt-2 border-2 border-dashed rounded-md p-6 text-center">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                {selectedFile ? (
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Glissez-déposez un fichier ou cliquez pour parcourir
                  </p>
                )}
                <Input 
                  id="documentFile" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => window.document.getElementById('documentFile')?.click()}
                >
                  Sélectionner un fichier
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button onClick={handleUpload} disabled={isLoading}>
              {isLoading ? "Téléversement..." : "Téléverser"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsTab;
