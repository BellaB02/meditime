import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Phone, Clock, Calendar, FileText, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddPatientForm from "@/components/patients/AddPatientForm";
import { toast } from "sonner";
import { PatientInfo, PatientService } from "@/services/PatientService";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: string;
  name: string;
  firstName: string;
  phone: string;
  address: string;
  lastVisit: string;
  nextVisit: string;
  status: "regular" | "urgent" | "inactive";
}

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>(() => {
    // Convertir les données du PatientService en format compatible
    return PatientService.getAllPatients().map(patientInfo => ({
      id: patientInfo.id,
      name: patientInfo.name,
      firstName: patientInfo.firstName || "",
      phone: patientInfo.phoneNumber || "",
      address: patientInfo.address || "",
      lastVisit: ["Aujourd'hui", "Hier", "Il y a 3 jours"][Math.floor(Math.random() * 3)],
      nextVisit: ["Demain, 10:15", "Dans 2 jours", "Aujourd'hui, 14:00"][Math.floor(Math.random() * 3)],
      status: ["regular", "urgent", "inactive"][Math.floor(Math.random() * 3)] as "regular" | "urgent" | "inactive"
    }));
  });
  
  // Simuler le chargement des données
  const loadPatients = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const patientInfos = PatientService.getAllPatients();
      setPatients(patientInfos.map(patientInfo => ({
        id: patientInfo.id,
        name: patientInfo.name,
        firstName: patientInfo.firstName || "",
        phone: patientInfo.phoneNumber || "",
        address: patientInfo.address || "",
        lastVisit: ["Aujourd'hui", "Hier", "Il y a 3 jours"][Math.floor(Math.random() * 3)],
        nextVisit: ["Demain, 10:15", "Dans 2 jours", "Aujourd'hui, 14:00"][Math.floor(Math.random() * 3)],
        status: ["regular", "urgent", "inactive"][Math.floor(Math.random() * 3)] as "regular" | "urgent" | "inactive"
      })));
      setIsLoading(false);
    }, 1000);
  };
  
  // Filtrer les patients en fonction de la recherche
  const filteredPatients = patients.filter(
    (patient) => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Fonction pour appeler un patient
  const handleCallPatient = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
    toast.info(`Appel vers ${phone}`);
  };
  
  // Fonction pour naviguer vers l'adresse d'un patient
  const handleNavigateToAddress = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    toast.info(`Navigation vers : ${address}`);
  };

  // Gérer l'ajout d'un nouveau patient
  const handleAddPatient = () => {
    setIsAddPatientOpen(true);
  };

  // Fonction pour gérer le succès de l'ajout d'un patient
  const handleAddPatientSuccess = () => {
    setIsAddPatientOpen(false);
    toast.success("Patient ajouté avec succès");
    loadPatients(); // Recharger la liste des patients
  };
  
  // Fonction pour déterminer la couleur du badge de statut
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'destructive';
      case 'inactive':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Fonction pour afficher le texte du statut
  const getStatusText = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'Urgent';
      case 'inactive':
        return 'Inactif';
      default:
        return 'Régulier';
    }
  };

  // Fonction pour voir le dossier du patient
  const handleViewPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <h1 className="text-2xl font-bold">Liste des patients</h1>
        <Button onClick={handleAddPatient}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nouveau patient
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher un patient par nom, prénom ou adresse..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Adresse</TableHead>
                  <TableHead className="hidden sm:table-cell">Dernière visite</TableHead>
                  <TableHead>Prochaine visite</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.firstName} {patient.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <button 
                        className="flex items-center gap-2 hover:text-primary hover:underline"
                        onClick={() => handleCallPatient(patient.phone)}
                        title="Appeler ce patient"
                      >
                        <Phone size={14} />
                        {patient.phone}
                      </button>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <button 
                        className="flex items-center gap-2 hover:text-primary hover:underline"
                        onClick={() => handleNavigateToAddress(patient.address)}
                        title="Naviguer vers cette adresse"
                      >
                        <MapPin size={14} />
                        {patient.address}
                      </button>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{patient.lastVisit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        {patient.nextVisit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(patient.status)}>
                        {getStatusText(patient.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewPatient(patient.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          RDV
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!isLoading && filteredPatients.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              Aucun patient ne correspond à votre recherche
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau patient</DialogTitle>
            <DialogDescription>
              Remplissez les informations du patient ci-dessous. Les champs marqués avec * sont obligatoires.
            </DialogDescription>
          </DialogHeader>
          <AddPatientForm onSuccess={handleAddPatientSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;
