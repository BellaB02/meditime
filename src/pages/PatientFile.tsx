
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User,
  Phone,
  Calendar,
  Clock,
  FileText,
  Thermometer,
  Heart,
  Activity,
  Save,
  Plus
} from "lucide-react";

// Types
interface PatientDetails {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  birthdate: string;
  insurance: string;
  doctor: string;
}

interface VitalSigns {
  date: string;
  temperature: string;
  heartRate: string;
  bloodPressure: string;
  notes: string;
}

interface Visit {
  date: string;
  time: string;
  care: string;
  notes: string;
}

// Données fictives
const patientsMap: Record<string, PatientDetails> = {
  "p1": {
    id: "p1",
    name: "Jean Dupont",
    phone: "06 12 34 56 78",
    email: "jean.dupont@email.com",
    address: "12 rue des Lilas, 75010 Paris",
    birthdate: "15/05/1958",
    insurance: "Carte vitale n°12345678901234",
    doctor: "Dr. Martin (Généraliste)"
  },
  "p2": {
    id: "p2",
    name: "Marie Martin",
    phone: "06 23 45 67 89",
    email: "marie.martin@email.com",
    address: "5 avenue Victor Hugo, 75016 Paris",
    birthdate: "22/11/1945",
    insurance: "Carte vitale n°23456789012345",
    doctor: "Dr. Dubois (Cardiologue)"
  },
  "p3": {
    id: "p3",
    name: "Robert Petit",
    phone: "06 34 56 78 90",
    email: "robert.petit@email.com",
    address: "8 rue du Commerce, 75015 Paris",
    birthdate: "03/07/1970",
    insurance: "Carte vitale n°34567890123456",
    doctor: "Dr. Leroy (Diabétologue)"
  }
};

const vitalSignsData: Record<string, VitalSigns[]> = {
  "p1": [
    {
      date: "Aujourd'hui",
      temperature: "37.2°C",
      heartRate: "72 bpm",
      bloodPressure: "130/85",
      notes: "Patient stable"
    },
    {
      date: "Hier",
      temperature: "37.0°C",
      heartRate: "75 bpm",
      bloodPressure: "132/86",
      notes: "Légère fatigue"
    }
  ],
  "p2": [
    {
      date: "Il y a 2 jours",
      temperature: "37.4°C",
      heartRate: "80 bpm",
      bloodPressure: "145/90",
      notes: "Tension élevée, à surveiller"
    }
  ],
  "p3": [
    {
      date: "Aujourd'hui",
      temperature: "36.8°C",
      heartRate: "70 bpm",
      bloodPressure: "128/82",
      notes: "Glycémie: 1.25 g/l"
    }
  ]
};

const visitsData: Record<string, Visit[]> = {
  "p1": [
    {
      date: "Aujourd'hui",
      time: "08:30",
      care: "Prise de sang",
      notes: "Bilan trimestriel"
    },
    {
      date: "Il y a 3 jours",
      time: "09:15",
      care: "Pansement",
      notes: "Cicatrisation en cours"
    }
  ],
  "p2": [
    {
      date: "Hier",
      time: "10:15",
      care: "Changement pansement",
      notes: "Cicatrisation difficile"
    }
  ],
  "p3": [
    {
      date: "Aujourd'hui",
      time: "14:00",
      care: "Injection insuline",
      notes: "Insuline lente: 18 unités"
    }
  ]
};

const PatientFile = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("info");
  
  // Récupérer les infos du patient depuis l'id
  const patient = id ? patientsMap[id] : null;
  const vitalSigns = id && vitalSignsData[id] ? vitalSignsData[id] : [];
  const visits = id && visitsData[id] ? visitsData[id] : [];
  
  if (!patient) {
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

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            {patient.name}
          </h1>
          <p className="text-sm text-muted-foreground">Dossier patient</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Ajouter RDV
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Générer bilan
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full sm:w-auto">
          <TabsTrigger value="info">
            Informations
          </TabsTrigger>
          <TabsTrigger value="vitals">
            Constantes
          </TabsTrigger>
          <TabsTrigger value="visits">
            Visites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" value={patient.name} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="birthdate">Date de naissance</Label>
                    <Input id="birthdate" value={patient.birthdate} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="flex items-center">
                      <Input id="phone" value={patient.phone} readOnly />
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Phone size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={patient.email} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" value={patient.address} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="insurance">Assurance</Label>
                    <Input id="insurance" value={patient.insurance} readOnly />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <Label htmlFor="doctor">Médecin traitant</Label>
                  <Input id="doctor" value={patient.doctor} readOnly />
                </div>
                <div>
                  <Label htmlFor="notes">Notes importantes</Label>
                  <textarea
                    id="notes"
                    className="w-full min-h-[100px] p-3 border rounded-md"
                    placeholder="Ajouter des notes médicales importantes..."
                  ></textarea>
                </div>
              </div>
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les modifications
              </Button>
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
              <Button size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Ajouter visite
              </Button>
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
      </Tabs>
    </div>
  );
};

export default PatientFile;
