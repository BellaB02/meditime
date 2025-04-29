import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, User, Calendar, ListChecks, HeartPulse, FileText, MessageSquare } from "lucide-react";
import { PatientInfoService, PatientInfo } from "@/services/PatientInfoService";
import { VitalSignsService, VitalSign } from "@/services/VitalSignsService";
import { VitalSignsTab } from "@/components/patient/VitalSignsTab";
import { CareSheetsTab } from "@/components/patient/CareSheetsTab";
import { AppointmentsTab } from "@/components/patient/AppointmentsTab";
import { DocumentsTab } from "@/components/patient/DocumentsTab";
import { MessagingTab } from "@/components/patient/MessagingTab";
import ExportDataButton from "@/components/patient/ExportDataButton";

interface PatientFileProps {
  patientId?: string;
}

const PatientFile = () => {
  const { id } = useParams<{ id: string }>();
  const [patientInfo, setPatientInfo] = useState<PatientInfo | undefined>(undefined);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [socialSecurityNumber, setSocialSecurityNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [doctor, setDoctor] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [insurance, setInsurance] = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "urgent">("active");
  
  useEffect(() => {
    if (id) {
      const patient = PatientInfoService.getPatientInfo(id);
      setPatientInfo(patient);
      
      if (patient) {
        setName(patient.name);
        setFirstName(patient.firstName || "");
        setAddress(patient.address || "");
        setPhoneNumber(patient.phoneNumber || "");
        setSocialSecurityNumber(patient.socialSecurityNumber || "");
        setDateOfBirth(patient.dateOfBirth || "");
        setEmail(patient.email || "");
        setDoctor(patient.doctor || "");
        setMedicalNotes(patient.medicalNotes || "");
        setInsurance(patient.insurance || "");
        setStatus(patient.status || "active");
      }
      
      const signs = VitalSignsService.getVitalSigns(id);
      setVitalSigns(signs);
    }
  }, [id]);
  
  const handleSave = () => {
    if (id) {
      PatientInfoService.updatePatient(id, {
        name,
        firstName,
        address,
        phoneNumber,
        socialSecurityNumber,
        dateOfBirth,
        email,
        doctor,
        medicalNotes,
        insurance,
        status
      });
      setPatientInfo(PatientInfoService.getPatientInfo(id));
      setOpenEditDialog(false);
    }
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
          {patientInfo && (
            <ExportDataButton patient={patientInfo} />
          )}
          <Button variant="outline" onClick={() => setOpenEditDialog(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" /> Profil</TabsTrigger>
          <TabsTrigger value="appointments"><Calendar className="h-4 w-4 mr-2" /> Rendez-vous</TabsTrigger>
          <TabsTrigger value="caresheets"><ListChecks className="h-4 w-4 mr-2" /> Feuilles de soins</TabsTrigger>
          <TabsTrigger value="vitalsigns"><HeartPulse className="h-4 w-4 mr-2" /> Signes vitaux</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="h-4 w-4 mr-2" /> Documents</TabsTrigger>
          <TabsTrigger value="messaging"><MessageSquare className="h-4 w-4 mr-2" /> Messages</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations du patient</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nom</Label>
                <p className="text-sm font-medium">{patientInfo?.name}</p>
              </div>
              <div>
                <Label>Prénom</Label>
                <p className="text-sm font-medium">{patientInfo?.firstName}</p>
              </div>
              <div>
                <Label>Adresse</Label>
                <p className="text-sm font-medium">{patientInfo?.address}</p>
              </div>
              <div>
                <Label>Téléphone</Label>
                <p className="text-sm font-medium">{patientInfo?.phoneNumber}</p>
              </div>
              <div>
                <Label>Numéro de sécurité sociale</Label>
                <p className="text-sm font-medium">{patientInfo?.socialSecurityNumber}</p>
              </div>
              <div>
                <Label>Date de naissance</Label>
                <p className="text-sm font-medium">{patientInfo?.dateOfBirth}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm font-medium">{patientInfo?.email}</p>
              </div>
              <div>
                <Label>Médecin traitant</Label>
                <p className="text-sm font-medium">{patientInfo?.doctor}</p>
              </div>
              <div>
                <Label>Notes médicales</Label>
                <p className="text-sm font-medium">{patientInfo?.medicalNotes}</p>
              </div>
              <div>
                <Label>Assurance</Label>
                <p className="text-sm font-medium">{patientInfo?.insurance}</p>
              </div>
              <div>
                <Label>Statut</Label>
                <p className="text-sm font-medium">{patientInfo?.status}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments">
          <AppointmentsTab patientId={id || ""}/>
        </TabsContent>
        <TabsContent value="caresheets">
          <CareSheetsTab patientId={id || ""}/>
        </TabsContent>
        <TabsContent value="vitalsigns">
          <VitalSignsTab patientId={id || ""}/>
        </TabsContent>
        <TabsContent value="documents">
          <DocumentsTab patientId={id || ""}/>
        </TabsContent>
        <TabsContent value="messaging">
          <MessagingTab />
        </TabsContent>
      </Tabs>
      
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier les informations du patient</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations personnelles du patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                Prénom
              </Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Adresse
              </Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Téléphone
              </Label>
              <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="socialSecurityNumber" className="text-right">
                Numéro de sécurité sociale
              </Label>
              <Input id="socialSecurityNumber" value={socialSecurityNumber} onChange={(e) => setSocialSecurityNumber(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateOfBirth" className="text-right">
                Date de naissance
              </Label>
              <Input id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doctor" className="text-right">
                Médecin traitant
              </Label>
              <Input id="doctor" value={doctor} onChange={(e) => setDoctor(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medicalNotes" className="text-right">
                Notes médicales
              </Label>
              <Input id="medicalNotes" value={medicalNotes} onChange={(e) => setMedicalNotes(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="insurance" className="text-right">
                Assurance
              </Label>
              <Input id="insurance" value={insurance} onChange={(e) => setInsurance(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as "active" | "inactive" | "urgent")} className="col-span-3 rounded-md border-gray-200 shadow-sm focus:border-primary focus:ring-primary">
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientFile;
