
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { usePatientDetails } from "@/hooks/usePatientDetails";
import { usePatientVitalSigns } from "@/hooks/usePatientVitalSigns";
import PatientHeader from "@/components/patient/PatientHeader";
import PatientTabs from "@/components/patient/PatientTabs";
import PatientEditDialog from "@/components/patient/PatientEditDialog";
import PatientLoading from "@/components/patient/PatientLoading";

const PatientFile = () => {
  const { id } = useParams<{ id: string }>();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const patientId = id || "";
  
  // Get patient details using our hook
  const { patientDetails, isLoading, updatePatient } = usePatientDetails(patientId);
  
  // Get patient vital signs using another hook
  const { vitalSigns } = usePatientVitalSigns(patientId);
  
  // Handle status change
  const handleStatusChange = async (newStatus: "active" | "inactive" | "urgent") => {
    await updatePatient({ status: newStatus });
  };
  
  // Handle edit success
  const handleEditSuccess = () => {
    setOpenEditDialog(false);
  };

  return (
    <div className="space-y-6">
      <PatientHeader 
        patientId={patientId}
        patientDetails={patientDetails}
        isLoading={isLoading}
        handleStatusChange={handleStatusChange}
        onEditClick={() => setOpenEditDialog(true)}
      />
      
      {isLoading ? (
        <PatientLoading />
      ) : (
        <PatientTabs 
          patientId={patientId}
          patientDetails={patientDetails}
          vitalSigns={vitalSigns || []}
        />
      )}
      
      <PatientEditDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        patientId={patientId}
        patientDetails={patientDetails}
        onSuccess={handleEditSuccess}
        onUpdatePatient={updatePatient}
      />
    </div>
  );
};

export default PatientFile;
