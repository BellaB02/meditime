
import React, { useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, FileText } from "lucide-react";

interface AddPrescriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadPrescription: (e: React.FormEvent) => void;
}

export const AddPrescriptionDialog: React.FC<AddPrescriptionDialogProps> = ({
  isOpen,
  onOpenChange,
  onUploadPrescription,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prescriptionDate, setPrescriptionDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [doctorName, setDoctorName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUploadPrescription(e);
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Ajouter une ordonnance</DialogTitle>
          <DialogDescription>
            Téléversez une nouvelle ordonnance pour le patient
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="prescriptionFile">Fichier de l'ordonnance</Label>
            <div className="mt-2 border-2 border-dashed rounded-md p-6 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              {selectedFile ? (
                <p className="text-sm font-medium">{selectedFile.name}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Glissez-déposez un fichier PDF ou cliquez pour parcourir
                </p>
              )}
              <Input
                id="prescriptionFile"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() =>
                  document.getElementById("prescriptionFile")?.click()
                }
              >
                Sélectionner un fichier
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prescriptionDate">Date de l'ordonnance</Label>
              <Input
                id="prescriptionDate"
                type="date"
                value={prescriptionDate}
                onChange={(e) => setPrescriptionDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorName">Nom du médecin</Label>
              <Input
                id="doctorName"
                placeholder="Dr. Dupont"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit">
            <FileUp className="mr-2 h-4 w-4" />
            Téléverser
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
