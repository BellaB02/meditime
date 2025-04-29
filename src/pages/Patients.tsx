
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Type for the patient data structure
interface Patient {
  id: string;
  name: string;
  firstName: string;
  phone: string;
  address: string;
  lastVisit?: string;
  nextVisit?: string;
  status: "active" | "urgent" | "inactive";
}

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const { user } = useAuth();
  
  // Charger les patients au démarrage
  useEffect(() => {
    loadPatients();
  }, []);
  
  // Charger les données des patients depuis Supabase
  const loadPatients = async () => {
    setIsLoading(true);
    
    try {
      console.log("Chargement des patients...");
      
      // Vérifier si l'utilisateur est connecté pour les requêtes Supabase
      if (user) {
        console.log("Tentative de chargement depuis Supabase...");
        
        // Interroger directement Supabase pour les patients
        const { data: supabasePatients, error } = await supabase
          .from('patients')
          .select('id, first_name, last_name, phone, address, status, created_at')
          .order('last_name', { ascending: true });
        
        if (error) {
          console.error("Erreur Supabase:", error);
          throw error;
        }
        
        if (supabasePatients && supabasePatients.length > 0) {
          console.log("Patients Supabase chargés:", supabasePatients.length);
          
          // Récupérer les rendez-vous récents pour chaque patient
          const today = new Date().toISOString().split('T')[0];
          
          // Préparer les données d'appointments pour tous les patients
          const { data: appointments, error: appointmentsError } = await supabase
            .from('appointments')
            .select('patient_id, date, time')
            .order('date', { ascending: true });
            
          if (appointmentsError) {
            console.error("Erreur lors du chargement des rendez-vous:", appointmentsError);
          }
          
          // Map des rendez-vous par patient
          const appointmentsByPatient = appointments ? appointments.reduce((acc, appt) => {
            if (!acc[appt.patient_id]) {
              acc[appt.patient_id] = [];
            }
            acc[appt.patient_id].push(appt);
            return acc;
          }, {} as Record<string, any[]>) : {};
          
          // Transformer les données pour l'affichage
          const convertedPatients: Patient[] = supabasePatients.map(patient => {
            const patientAppointments = appointmentsByPatient[patient.id] || [];
            
            // Trouver le dernier et le prochain rendez-vous
            const pastAppointments = patientAppointments.filter(
              a => new Date(`${a.date}T${a.time}`).getTime() < Date.now()
            ).sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
            
            const futureAppointments = patientAppointments.filter(
              a => new Date(`${a.date}T${a.time}`).getTime() >= Date.now()
            ).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
            
            const lastVisit = pastAppointments.length > 0 ? 
              formatAppointmentDate(new Date(`${pastAppointments[0].date}T${pastAppointments[0].time}`)) : 
              undefined;
              
            const nextVisit = futureAppointments.length > 0 ? 
              `${formatAppointmentDate(new Date(`${futureAppointments[0].date}T${futureAppointments[0].time}`))}, ${futureAppointments[0].time.substring(0, 5)}` : 
              undefined;
            
            return {
              id: patient.id,
              name: patient.last_name || "",
              firstName: patient.first_name || "",
              phone: patient.phone || "",
              address: patient.address || "",
              lastVisit,
              nextVisit,
              status: (patient.status as "active" | "urgent" | "inactive") || "active"
            };
          });
          
          setPatients(convertedPatients);
        } else {
          console.log("Aucun patient trouvé dans Supabase");
          setPatients([]);
        }
      } else {
        console.log("Utilisateur non connecté");
        setPatients([]);
      }
    } catch (error) {
      console.error("Erreur globale du chargement des patients:", error);
      toast.error("Une erreur est survenue lors du chargement des patients");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Formater une date pour l'affichage
  const formatAppointmentDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Comparer les dates sans prendre en compte les heures
    if (date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear()) {
      return "Aujourd'hui";
    }
    
    if (date.getDate() === tomorrow.getDate() && 
        date.getMonth() === tomorrow.getMonth() && 
        date.getFullYear() === tomorrow.getFullYear()) {
      return "Demain";
    }
    
    // Si c'est dans le passé
    if (date < today) {
      const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) return "Hier";
      if (diffDays < 7) return `Il y a ${diffDays} jours`;
    }
    
    // Format standard
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  };
  
  // Filtrer les patients en fonction de la recherche
  const filteredPatients = patients.filter(
    (patient) => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.address && patient.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Fonction pour appeler un patient
  const handleCallPatient = (phone: string) => {
    if (!phone) {
      toast.warning("Aucun numéro de téléphone disponible");
      return;
    }
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
    toast.info(`Appel vers ${phone}`);
  };
  
  // Fonction pour naviguer vers l'adresse d'un patient
  const handleNavigateToAddress = (address: string) => {
    if (!address) {
      toast.warning("Aucune adresse disponible");
      return;
    }
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
        return 'Actif';
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
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.firstName} {patient.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {patient.phone ? (
                          <button 
                            className="flex items-center gap-2 hover:text-primary hover:underline"
                            onClick={() => handleCallPatient(patient.phone)}
                            title="Appeler ce patient"
                          >
                            <Phone size={14} />
                            {patient.phone}
                          </button>
                        ) : (
                          <span className="text-muted-foreground">Non renseigné</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {patient.address ? (
                          <button 
                            className="flex items-center gap-2 hover:text-primary hover:underline"
                            onClick={() => handleNavigateToAddress(patient.address)}
                            title="Naviguer vers cette adresse"
                          >
                            <MapPin size={14} />
                            {patient.address}
                          </button>
                        ) : (
                          <span className="text-muted-foreground">Non renseignée</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {patient.lastVisit || <span className="text-muted-foreground">Aucune</span>}
                      </TableCell>
                      <TableCell>
                        {patient.nextVisit ? (
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-primary" />
                            {patient.nextVisit}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Non planifié</span>
                        )}
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
                          <Button size="sm" variant="outline" onClick={() => navigate(`/calendar?patient=${patient.id}`)}>
                            <Calendar className="mr-2 h-4 w-4" />
                            RDV
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      {user ? "Aucun patient trouvé. Ajoutez votre premier patient avec le bouton \"Nouveau patient\"." : "Veuillez vous connecter pour voir vos patients."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
