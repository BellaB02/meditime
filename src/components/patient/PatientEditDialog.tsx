
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditPatientForm from "@/components/patient/EditPatientForm";
import { PatientDetails } from "@/hooks/usePatientDetails";

interface PatientEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  patientDetails: PatientDetails | null;
  onSuccess: () => void;
  onUpdatePatient: (updates: Partial<PatientDetails>) => Promise<boolean>;
}

const PatientEditDialog: React.FC<PatientEditDialogProps> = ({
  open,
  onOpenChange,
  patientId,
  patientDetails,
  onSuccess,
  onUpdatePatient
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier les informations du patient</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations personnelles du patient.
          </DialogDescription>
        </DialogHeader>
        {patientDetails && (
          <EditPatientForm 
            patientId={patientId}
            initialData={patientDetails}
            onSuccess={onSuccess}
            onUpdatePatient={onUpdatePatient}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PatientEditDialog;
