
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, FileText, Pencil } from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";
import PatientInfo from "@/components/patient/PatientInfo";
import VitalSignsTab from "@/components/patient/VitalSignsTab";
import VisitsTab from "@/components/patient/VisitsTab";
import PrescriptionsTab from "@/components/patient/PrescriptionsTab";
import EditPatientDialog from "@/components/patient/dialogs/EditPatientDialog";
import { toast } from "sonner";

const PatientFile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState("info");
  
  // Utilisation du hook personnalisé pour gérer les données patient
  const {
    patientInfo,
    isEditingPatient,
    setIsEditingPatient,
    isEditModeDialogOpen,
    setIsEditModeDialogOpen,
    vitalSigns,
    prescriptions,
    visits,
    patientForm,
    handleCallPatient,
    handleNavigateToAddress,
    handleSavePatientInfo,
    handleCancelEdit
  } = usePatientData(id);
  
  const handleAddAppointment = () => {
    if (patientInfo) {
      toast.success(`Rendez-vous ajouté pour ${patientInfo.firstName} ${patientInfo.name}`);
    }
  };
  
  const handleGenerateReport = () => {
    if (patientInfo) {
      toast.success(`Génération du bilan pour ${patientInfo.firstName} ${patientInfo.name}`);
      
      setTimeout(() => {
        toast.success("Bilan généré avec succès");
      }, 1500);
    }
  };

  if (!patientInfo) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Patient non trouvé</h2>
        <p className="text-muted-foreground">Le patient demandé n'existe pas ou a été supprimé.</p>
        <Button className="mt-4" asChild>
          <a href="/patients">Retour à la liste</a>
        </Button>
      </div>
    );
  }

  const patientFullName = `${patientInfo.firstName || ""} ${patientInfo.name}`.trim();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            {patientFullName}
          </h1>
          <p className="text-sm text-muted-foreground">Dossier patient</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddAppointment}>
            <Calendar className="mr-2 h-4 w-4" />
            Ajouter RDV
          </Button>
          <Button onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Générer bilan
          </Button>
          <Button variant="secondary" onClick={() => setIsEditModeDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="info">
            Informations
          </TabsTrigger>
          <TabsTrigger value="vitals">
            Constantes
          </TabsTrigger>
          <TabsTrigger value="visits">
            Visites
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            Ordonnances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <PatientInfo 
            patientInfo={patientInfo}
            isEditingPatient={isEditingPatient}
            patientForm={patientForm}
            handleSavePatientInfo={handleSavePatientInfo}
            handleCancelEdit={handleCancelEdit}
            handleCallPatient={handleCallPatient}
            handleNavigateToAddress={handleNavigateToAddress}
          />
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <VitalSignsTab vitalSigns={vitalSigns} />
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          <VisitsTab visits={visits} patientInfo={patientInfo} />
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-4">
          <PrescriptionsTab 
            prescriptions={prescriptions} 
            patientName={patientInfo.name}
          />
        </TabsContent>
      </Tabs>
      
      {/* Modal de confirmation pour l'édition du patient */}
      <EditPatientDialog 
        isOpen={isEditModeDialogOpen}
        onOpenChange={setIsEditModeDialogOpen}
        patientFullName={patientFullName}
        onConfirm={() => {
          setIsEditingPatient(true);
          setIsEditModeDialogOpen(false);
        }}
      />
    </div>
  );
};

export default PatientFile;
