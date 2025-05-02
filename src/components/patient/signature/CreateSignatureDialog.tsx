
import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Signature } from "@/components/ui/signature";
import { toast } from "sonner";

interface CreateSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, type: string, signatureDataUrl: string) => void;
  patientName: string;
}

// Types de documents disponibles
const documentTypes = [
  "Consentement",
  "Décharge de responsabilité",
  "Autorisation de soins",
  "Attestation de présence",
  "Fiche de liaison",
  "Autre"
];

export const CreateSignatureDialog: React.FC<CreateSignatureDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  patientName 
}) => {
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  const handleSignatureChange = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl);
  };

  const handleSave = () => {
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

    onSave(documentTitle, documentType, signatureDataUrl);
    resetForm();
  };

  const resetForm = () => {
    setDocumentTitle("");
    setDocumentType("");
    setSignatureDataUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer le document signé
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
