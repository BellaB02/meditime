
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Ajouter ordonnance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une ordonnance</DialogTitle>
          <DialogDescription>
            Téléversez un fichier PDF contenant l'ordonnance
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onUploadPrescription} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="prescriptionTitle">Titre</Label>
              <Input id="prescriptionTitle" placeholder="Ex: Renouvellement traitement" required />
            </div>
            <div>
              <Label htmlFor="prescriptionDate">Date de l'ordonnance</Label>
              <Input id="prescriptionDate" type="date" required />
            </div>
            <div>
              <Label htmlFor="prescriptionDoctor">Médecin prescripteur</Label>
              <Input id="prescriptionDoctor" placeholder="Dr. Nom" required />
            </div>
            <div>
              <Label htmlFor="prescriptionFile" className="block mb-2">Fichier PDF</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <FileUp size={24} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Cliquez pour téléverser ou glissez-déposez
                </p>
                <Input id="prescriptionFile" type="file" accept=".pdf" className="hidden" />
                <Button type="button" variant="outline" onClick={() => document.getElementById('prescriptionFile')?.click()}>
                  Sélectionner un fichier
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
