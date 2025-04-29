
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { toast } from "sonner";
import { Prescription } from "@/services/PatientService";
import { AddPrescriptionDialog } from "./dialogs/AddPrescriptionDialog";

type PrescriptionsTabProps = {
  prescriptions: Prescription[];
  patientName: string;
};

const PrescriptionsTab: React.FC<PrescriptionsTabProps> = ({ prescriptions, patientName }) => {
  const [isAddPrescriptionDialogOpen, setIsAddPrescriptionDialogOpen] = useState(false);
  
  const handleUploadPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Ordonnance ajoutée avec succès");
    setIsAddPrescriptionDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Ordonnances</CardTitle>
        <AddPrescriptionDialog
          isOpen={isAddPrescriptionDialogOpen}
          onOpenChange={setIsAddPrescriptionDialogOpen}
          onUploadPrescription={handleUploadPrescription}
        />
      </CardHeader>
      <CardContent>
        {prescriptions.length > 0 ? (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">{prescription.title}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    <div>Date: {prescription.date}</div>
                    <div>Médecin: {prescription.doctor}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success("Téléchargement de l'ordonnance")}>
                  <Download size={16} className="mr-2" />
                  Télécharger
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Aucune ordonnance enregistrée pour ce patient
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrescriptionsTab;
