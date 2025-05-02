
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { PatientStatusToggle } from "@/components/patient/PatientStatusToggle";
import ExportDataButton from "@/components/patient/ExportDataButton";
import { PatientDetails } from "@/hooks/usePatientDetails";
import { Skeleton } from "@/components/ui/skeleton";

interface PatientHeaderProps {
  patientId: string;
  patientDetails: PatientDetails | null;
  isLoading: boolean;
  handleStatusChange: (newStatus: "active" | "inactive" | "urgent") => Promise<void>;
  onEditClick: () => void;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({
  patientId,
  patientDetails,
  isLoading,
  handleStatusChange,
  onEditClick,
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold">Fiche patient</h1>
        <p className="text-muted-foreground">
          Consultez et gérez les informations du patient
        </p>
      </div>
      
      <div className="flex gap-2">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </>
        ) : patientDetails && (
          <>
            <PatientStatusToggle 
              patientId={patientId}
              initialStatus={patientDetails.status || "active"}
              onStatusChange={handleStatusChange}
            />
            <ExportDataButton patient={{
              id: patientDetails.id,
              name: patientDetails.lastName,
              firstName: patientDetails.firstName,
              address: patientDetails.address,
              phoneNumber: patientDetails.phone,
              socialSecurityNumber: patientDetails.socialSecurityNumber,
              dateOfBirth: patientDetails.dateOfBirth,
              email: patientDetails.email,
              doctor: patientDetails.doctor,
              medicalNotes: patientDetails.medicalNotes,
              insurance: patientDetails.insurance,
              status: patientDetails.status
            }} />
            <Button variant="outline" onClick={onEditClick}>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientHeader;
