
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type AddPrescriptionDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadPrescription: (e: React.FormEvent) => void;
};

export const AddPrescriptionDialog: React.FC<AddPrescriptionDialogProps> = ({
  isOpen,
  onOpenChange,
  onUploadPrescription
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    
    // Appeler la fonction de téléversement fournie par le parent
    onUploadPrescription(e);
    
    // Réinitialiser le fichier sélectionné
    setSelectedFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une ordonnance</DialogTitle>
          <DialogDescription>
            Téléversez un fichier PDF contenant l'ordonnance
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="prescriptionTitle">Titre</Label>
              <Input id="prescriptionTitle" placeholder="Ex: Renouvellement traitement" required />
            </div>
            <div>
              <Label htmlFor="prescriptionDate">Date de l'ordonnance</Label>
              <Input 
                id="prescriptionDate" 
                type="date" 
                defaultValue={new Date().toISOString().substring(0, 10)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="prescriptionDoctor">Médecin prescripteur</Label>
              <Input id="prescriptionDoctor" placeholder="Dr. Nom" required />
            </div>
            <div>
              <Label htmlFor="prescriptionFile" className="block mb-2">Fichier PDF</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <FileUp size={24} className="mx-auto mb-2 text-muted-foreground" />
                {selectedFile ? (
                  <p className="text-sm font-medium mb-2">
                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} Ko)
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mb-2">
                    Cliquez pour téléverser ou glissez-déposez
                  </p>
                )}
                <Input 
                  id="prescriptionFile" 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('prescriptionFile')?.click()}
                >
                  Sélectionner un fichier
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
