
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
import { Search, UserPlus, Phone, Clock } from "lucide-react";

// Données fictives pour la démo
const patientsData = [
  {
    id: "p1",
    name: "Jean Dupont",
    phone: "06 12 34 56 78",
    address: "12 rue des Lilas, 75010 Paris",
    lastVisit: "Aujourd'hui",
    nextVisit: "Demain, 10:15",
    status: "regular"
  },
  {
    id: "p2",
    name: "Marie Martin",
    phone: "06 23 45 67 89",
    address: "5 avenue Victor Hugo, 75016 Paris",
    lastVisit: "Hier",
    nextVisit: "Dans 2 jours",
    status: "urgent"
  },
  {
    id: "p3",
    name: "Robert Petit",
    phone: "06 34 56 78 90",
    address: "8 rue du Commerce, 75015 Paris",
    lastVisit: "Il y a 3 jours",
    nextVisit: "Aujourd'hui, 14:00",
    status: "regular"
  },
  {
    id: "p4",
    name: "Sophie Leroy",
    phone: "06 45 67 89 01",
    address: "25 rue des Martyrs, 75009 Paris",
    lastVisit: "Il y a 1 semaine",
    nextVisit: "Demain, 09:00",
    status: "regular"
  },
  {
    id: "p5",
    name: "Pierre Bernard",
    phone: "06 56 78 90 12",
    address: "14 boulevard Haussmann, 75008 Paris",
    lastVisit: "Il y a 2 semaines",
    nextVisit: "Demain, 11:30",
    status: "inactive"
  }
];

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrer les patients en fonction de la recherche
  const filteredPatients = patientsData.filter(
    (patient) => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <h1 className="text-2xl font-bold">Liste des patients</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Nouveau patient
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher un patient par nom ou adresse..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Adresse</TableHead>
                <TableHead className="hidden sm:table-cell">Dernière visite</TableHead>
                <TableHead>Prochaine visite</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      {patient.phone}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{patient.address}</TableCell>
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
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/patients/${patient.id}`}>
                        Voir fiche
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              Aucun patient ne correspond à votre recherche
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Patients;
