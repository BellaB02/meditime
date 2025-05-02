
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, ListChecks, HeartPulse, FileText, MessageSquare } from "lucide-react";
import VitalSignsTab from "@/components/patient/VitalSignsTab";
import CareSheetsTab from "@/components/patient/CareSheetsTab";
import AppointmentsTab from "@/components/patient/AppointmentsTab";
import DocumentsTab from "@/components/patient/DocumentsTab";
import MessagingTab from "@/components/patient/MessagingTab";
import PhotosTab from "@/components/patient/PhotosTab";
import SignatureTab from "@/components/patient/SignatureTab";
import VitalSignsAlerts from "@/components/patient/VitalSignsAlerts";
import CareChecklist from "@/components/care/CareChecklist";
import { PatientDetails } from "@/hooks/usePatientDetails";
import PatientProfileTab from "@/components/patient/PatientProfileTab";

interface PatientTabsProps {
  patientId: string;
  patientDetails: PatientDetails | null;
  vitalSigns: any[];
}

const PatientTabs: React.FC<PatientTabsProps> = ({ patientId, patientDetails, vitalSigns }) => {
  return (
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
  );
};

export default PatientTabs;
