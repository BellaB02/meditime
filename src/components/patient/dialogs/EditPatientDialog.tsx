
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

type EditPatientDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patientFullName: string;
  onConfirm: () => void;
};

const EditPatientDialog: React.FC<EditPatientDialogProps> = ({
  isOpen,
  onOpenChange,
  patientFullName,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Modifier les informations du patient
          </DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de modifier les informations de {patientFullName}.
            Les modifications seront enregistrées dans le dossier du patient.
            Êtes-vous sûr de vouloir continuer ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onConfirm}>
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientDialog;
