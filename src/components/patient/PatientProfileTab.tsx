
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientDetails } from "@/hooks/usePatientDetails";

interface PatientProfileTabProps {
  patientDetails: PatientDetails | null;
}

const PatientProfileTab: React.FC<PatientProfileTabProps> = ({ patientDetails }) => {
  if (!patientDetails) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du patient</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Nom</p>
          <p className="text-base">{patientDetails.lastName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Prénom</p>
          <p className="text-base">{patientDetails.firstName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Adresse</p>
          <p className="text-base">{patientDetails.address || "Non renseignée"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
          <p className="text-base">{patientDetails.phone || "Non renseigné"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Numéro de sécurité sociale</p>
          <p className="text-base">{patientDetails.socialSecurityNumber || "Non renseigné"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
          <p className="text-base">{patientDetails.dateOfBirth || "Non renseignée"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="text-base">{patientDetails.email || "Non renseigné"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Médecin traitant</p>
          <p className="text-base">{patientDetails.doctor || "Non renseigné"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-muted-foreground">Notes médicales</p>
          <p className="text-base whitespace-pre-wrap">{patientDetails.medicalNotes || "Aucune note médicale"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Assurance</p>
          <p className="text-base">{patientDetails.insurance || "Non renseignée"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Statut</p>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              patientDetails.status === 'active' ? 'bg-green-500' :
              patientDetails.status === 'urgent' ? 'bg-red-500' :
              'bg-gray-500'
            }`}></div>
            <p className="text-base">
              {patientDetails.status === 'active' ? 'Actif' :
               patientDetails.status === 'urgent' ? 'Urgent' :
               patientDetails.status === 'inactive' ? 'Inactif' : 'Non défini'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientProfileTab;
