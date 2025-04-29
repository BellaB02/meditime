
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, User, Calendar, ListChecks, HeartPulse, FileText, MessageSquare } from "lucide-react";
import { PatientStatusToggle } from "@/components/patient/PatientStatusToggle";
import VitalSignsTab from "@/components/patient/VitalSignsTab";
import CareSheetsTab from "@/components/patient/CareSheetsTab";
import AppointmentsTab from "@/components/patient/AppointmentsTab";
import DocumentsTab from "@/components/patient/DocumentsTab";
import MessagingTab from "@/components/patient/MessagingTab";
import ExportDataButton from "@/components/patient/ExportDataButton";
import PhotosTab from "@/components/patient/PhotosTab";
import SignatureTab from "@/components/patient/SignatureTab";
import VitalSignsAlerts from "@/components/patient/VitalSignsAlerts";
import CareChecklist from "@/components/care/CareChecklist";
import { usePatientDetails, PatientDetails } from "@/hooks/usePatientDetails";
import { usePatientVitalSigns } from "@/hooks/usePatientVitalSigns";
import EditPatientForm from "@/components/patient/EditPatientForm";
import { Skeleton } from "@/components/ui/skeleton";

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
              <Button variant="outline" onClick={() => setOpenEditDialog(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="mb-6">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" /> Profil</TabsTrigger>
            <TabsTrigger value="appointments"><Calendar className="h-4 w-4 mr-2" /> Rendez-vous</TabsTrigger>
            <TabsTrigger value="caresheets"><ListChecks className="h-4 w-4 mr-2" /> Feuilles de soins</TabsTrigger>
            <TabsTrigger value="vitalsigns"><HeartPulse className="h-4 w-4 mr-2" /> Signes vitaux</TabsTrigger>
            <TabsTrigger value="documents"><FileText className="h-4 w-4 mr-2" /> Documents</TabsTrigger>
            <TabsTrigger value="messaging"><MessageSquare className="h-4 w-4 mr-2" /> Messages</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="signatures">Signatures</TabsTrigger>
            <TabsTrigger value="vitalAlerts">Alertes</TabsTrigger>
            <TabsTrigger value="checklists">Checklists</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-2">
            <PatientProfileTab patientDetails={patientDetails} />
          </TabsContent>
          
          <TabsContent value="appointments">
            <AppointmentsTab patientId={patientId}/>
          </TabsContent>
          
          <TabsContent value="caresheets">
            <CareSheetsTab patientId={patientId}/>
          </TabsContent>
          
          <TabsContent value="vitalsigns">
            <VitalSignsTab patientId={patientId} vitalSigns={vitalSigns || []} />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsTab patientId={patientId}/>
          </TabsContent>
          
          <TabsContent value="messaging">
            <MessagingTab />
          </TabsContent>
          
          <TabsContent value="photos">
            <PhotosTab patientId={patientId} />
          </TabsContent>
          
          <TabsContent value="signatures">
            <SignatureTab 
              patientId={patientId} 
              patientName={patientDetails ? `${patientDetails.firstName} ${patientDetails.lastName}` : "Patient"} 
            />
          </TabsContent>
          
          <TabsContent value="vitalAlerts">
            <VitalSignsAlerts patientId={patientId} />
          </TabsContent>
          
          <TabsContent value="checklists">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Checklists de soins</h2>
              <CareChecklist patientId={patientId} />
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
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
              onSuccess={handleEditSuccess}
              onUpdatePatient={updatePatient}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Separate component for patient profile tab
const PatientProfileTab = ({ patientDetails }: { patientDetails: PatientDetails | null }) => {
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

export default PatientFile;
