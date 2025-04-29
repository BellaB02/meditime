
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from "@/components/ui/dialog";
import {
  User,
  Phone,
  Calendar,
  Clock,
  FileText,
  Thermometer,
  Heart,
  Activity,
  Save,
  Plus,
  MapPin,
  Upload,
  Download,
  FileUp,
  Edit,
  Pencil
} from "lucide-react";
import { toast } from "sonner";
import { DocumentService } from "@/services/DocumentService";
import { PatientService, PatientInfo, VitalSign, Prescription } from "@/services/PatientService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Schema pour la validation du formulaire de modification patient
const patientFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  firstName: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères" }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Veuillez saisir un email valide" }).optional().or(z.literal("")),
  address: z.string().optional(),
  birthdate: z.string().optional(),
  insurance: z.string().optional(),
  doctor: z.string().optional(),
  notes: z.string().optional()
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

// Interface for visit type
interface Visit {
  id: string;
  date: string;
  time: string;
  care: string;
  notes: string;
}

const PatientFile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // États
  const [activeTab, setActiveTab] = useState("info");
  const [isAddVisitDialogOpen, setIsAddVisitDialogOpen] = useState(false);
  const [isAddPrescriptionDialogOpen, setIsAddPrescriptionDialogOpen] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isEditModeDialogOpen, setIsEditModeDialogOpen] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicalNotes, setMedicalNotes] = useState("");
  // Ajouter un state pour les visites
  const [visits, setVisits] = useState<Visit[]>([
    {
      id: "v1",
      date: "21/05/2025",
      time: "09:30",
      care: "Pansement",
      notes: "Changement de pansement suite à une plaie au niveau du pied droit"
    },
    {
      id: "v2",
      date: "23/05/2025",
      time: "14:00",
      care: "Injection",
      notes: "Administration d'insuline suite à un changement de traitement"
    }
  ]);
  
  // Recupérer les données du patient
  useEffect(() => {
    if (id) {
      const patient = PatientService.getPatientInfo(id);
      if (patient) {
        setPatientInfo(patient);
        setMedicalNotes(patient.medicalNotes || "");
        setVitalSigns(PatientService.getVitalSigns(id));
        setPrescriptions(PatientService.getPrescriptions(id));
      }
    }
  }, [id]);

  // Configuration du formulaire
  const patientForm = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: patientInfo?.name || "",
      firstName: patientInfo?.firstName || "",
      phone: patientInfo?.phoneNumber || "",
      email: patientInfo?.email || "",
      address: patientInfo?.address || "",
      birthdate: patientInfo?.dateOfBirth || "",
      insurance: patientInfo?.insurance || "",
      doctor: patientInfo?.doctor || "",
      notes: patientInfo?.medicalNotes || ""
    },
  });

  // Mettre à jour les valeurs du formulaire lorsque les infos patient changent
  useEffect(() => {
    if (patientInfo) {
      patientForm.reset({
        name: patientInfo.name,
        firstName: patientInfo.firstName || "",
        phone: patientInfo.phoneNumber || "",
        email: patientInfo.email || "",
        address: patientInfo.address || "",
        birthdate: patientInfo.dateOfBirth || "",
        insurance: patientInfo.insurance || "",
        doctor: patientInfo.doctor || "",
        notes: patientInfo.medicalNotes || ""
      });
    }
  }, [patientInfo]);
  
  const handleCallPatient = () => {
    if (patientInfo?.phoneNumber) {
      window.location.href = `tel:${patientInfo.phoneNumber.replace(/\s/g, '')}`;
      toast.info(`Appel vers ${patientInfo.firstName} ${patientInfo.name}`);
    }
  };
  
  const handleNavigateToAddress = () => {
    if (patientInfo?.address) {
      const encodedAddress = encodeURIComponent(patientInfo.address);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
      toast.info(`Navigation vers : ${patientInfo.address}`);
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
  
  const handleAddAppointment = () => {
    if (patientInfo) {
      toast.success(`Rendez-vous ajouté pour ${patientInfo.firstName} ${patientInfo.name}`);
    }
  };
  
  const handleSavePatientInfo = (data: PatientFormValues) => {
    if (id && patientInfo) {
      // Mise à jour des informations patient (simulation)
      const updatedPatient: PatientInfo = {
        ...patientInfo,
        name: data.name,
        firstName: data.firstName,
        phoneNumber: data.phone,
        email: data.email,
        address: data.address,
        dateOfBirth: data.birthdate,
        insurance: data.insurance,
        doctor: data.doctor,
        medicalNotes: data.notes
      };
      
      setPatientInfo(updatedPatient);
      setMedicalNotes(data.notes || "");
      setIsEditingPatient(false);
      toast.success("Informations patient mises à jour avec succès");
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditingPatient(false);
    patientForm.reset({
      name: patientInfo?.name || "",
      firstName: patientInfo?.firstName || "",
      phone: patientInfo?.phoneNumber || "",
      email: patientInfo?.email || "",
      address: patientInfo?.address || "",
      birthdate: patientInfo?.dateOfBirth || "",
      insurance: patientInfo?.insurance || "",
      doctor: patientInfo?.doctor || ""
    });
  };
  
  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Visite ajoutée avec succès");
    setIsAddVisitDialogOpen(false);
  };
  
  const handleMarkVisitComplete = (visit: Visit) => {
    toast.success(`Soin "${visit.care}" marqué comme terminé`);
    
    // Générer une feuille de soins
    if (patientInfo) {
      DocumentService.generateCareSheet("care-" + Date.now(), `${patientInfo.firstName} ${patientInfo.name}`);
    }
  };
  
  const handleMarkVisitCanceled = (visit: Visit) => {
    toast.info(`Soin "${visit.care}" marqué comme annulé`);
  };
  
  const handleUploadPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Ordonnance ajoutée avec succès");
    setIsAddPrescriptionDialogOpen(false);
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Informations personnelles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...patientForm}>
                <form onSubmit={patientForm.handleSubmit(handleSavePatientInfo)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={patientForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={!isEditingPatient} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={patientForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={!isEditingPatient} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={patientForm.control}
                      name="birthdate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={!isEditingPatient} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={patientForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <div className="flex items-center">
                            <FormControl>
                              <Input {...field} readOnly={!isEditingPatient} />
                            </FormControl>
                            {!isEditingPatient && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="ml-2"
                                onClick={handleCallPatient}
                                type="button"
                              >
                                <Phone size={18} />
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={patientForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={!isEditingPatient} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={patientForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <div className="flex items-center">
                            <FormControl>
                              <Input {...field} readOnly={!isEditingPatient} />
                            </FormControl>
                            {!isEditingPatient && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="ml-2" 
                                onClick={handleNavigateToAddress}
                                type="button"
                              >
                                <MapPin size={18} />
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={patientForm.control}
                      name="insurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assurance</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={!isEditingPatient} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={patientForm.control}
                      name="doctor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Médecin traitant</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={!isEditingPatient} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={patientForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes médicales</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            className="w-full min-h-[100px] p-3 border rounded-md"
                            placeholder="Ajouter des notes médicales importantes..."
                            readOnly={!isEditingPatient}
                          ></textarea>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {isEditingPatient && (
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" type="button" onClick={handleCancelEdit}>
                        Annuler
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Suivi des constantes</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter mesure
              </Button>
            </CardHeader>
            <CardContent>
              {vitalSigns.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Thermometer size={14} /> Température
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Heart size={14} /> Pouls
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Activity size={14} /> Tension
                        </div>
                      </TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vitalSigns.map((sign, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{sign.date}</TableCell>
                        <TableCell>{sign.temperature}</TableCell>
                        <TableCell>{sign.heartRate}</TableCell>
                        <TableCell>{sign.bloodPressure}</TableCell>
                        <TableCell>{sign.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Aucune constante enregistrée pour ce patient
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Historique des visites</CardTitle>
              <Dialog open={isAddVisitDialogOpen} onOpenChange={setIsAddVisitDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Ajouter visite
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une visite</DialogTitle>
                    <DialogDescription>
                      Programmez une nouvelle visite pour {patientInfo.name}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddVisit} className="space-y-4 py-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="visitDate">Date</Label>
                          <Input id="visitDate" type="date" required />
                        </div>
                        <div>
                          <Label htmlFor="visitTime">Heure</Label>
                          <Input id="visitTime" type="time" required />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="visitCare">Type de soin</Label>
                        <select 
                          id="visitCare" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          required
                        >
                          <option value="">Sélectionner un soin</option>
                          <option value="Prise de sang">Prise de sang</option>
                          <option value="Pansement">Pansement</option>
                          <option value="Injection">Injection</option>
                          <option value="Perfusion">Perfusion</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="visitNotes">Notes</Label>
                        <textarea
                          id="visitNotes"
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[80px]"
                          placeholder="Détails supplémentaires..."
                        ></textarea>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Ajouter</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {visits.length > 0 ? (
                <div className="space-y-4">
                  {visits.map((visit, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-3">
                          <div className="bg-accent p-2 rounded-full">
                            <Calendar size={20} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{visit.date}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock size={14} />
                              <span>{visit.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                          {visit.care}
                        </div>
                      </div>
                      <div className="mt-2 bg-accent/50 p-3 rounded-md">
                        <p className="text-sm">{visit.notes}</p>
                      </div>
                      <div className="mt-3 flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkVisitComplete(visit)}
                        >
                          Marquer comme fait
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-destructive text-destructive hover:bg-destructive/10"
                          onClick={() => handleMarkVisitCanceled(visit)}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Aucune visite enregistrée pour ce patient
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Ordonnances</CardTitle>
              <Dialog open={isAddPrescriptionDialogOpen} onOpenChange={setIsAddPrescriptionDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Ajouter ordonnance
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une ordonnance</DialogTitle>
                    <DialogDescription>
                      Téléversez un fichier PDF contenant l'ordonnance
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUploadPrescription} className="space-y-4 py-4">
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="prescriptionTitle">Titre</Label>
                        <Input id="prescriptionTitle" placeholder="Ex: Renouvellement traitement" required />
                      </div>
                      <div>
                        <Label htmlFor="prescriptionDate">Date de l'ordonnance</Label>
                        <Input id="prescriptionDate" type="date" required />
                      </div>
                      <div>
                        <Label htmlFor="prescriptionDoctor">Médecin prescripteur</Label>
                        <Input id="prescriptionDoctor" placeholder="Dr. Nom" required />
                      </div>
                      <div>
                        <Label htmlFor="prescriptionFile" className="block mb-2">Fichier PDF</Label>
                        <div className="border-2 border-dashed rounded-md p-6 text-center">
                          <FileUp size={24} className="mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Cliquez pour téléverser ou glissez-déposez
                          </p>
                          <Input id="prescriptionFile" type="file" accept=".pdf" className="hidden" />
                          <Button type="button" variant="outline" onClick={() => document.getElementById('prescriptionFile')?.click()}>
                            Sélectionner un fichier
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Ajouter</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
        </TabsContent>
      </Tabs>
      
      {/* Modal de confirmation pour l'édition du patient */}
      <Dialog open={isEditModeDialogOpen} onOpenChange={setIsEditModeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les informations du patient</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de modifier les informations de {patientFullName}.
              Êtes-vous sûr de vouloir continuer ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setIsEditModeDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => {
              setIsEditingPatient(true);
              setIsEditModeDialogOpen(false);
            }}>
              Continuer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientFile;

