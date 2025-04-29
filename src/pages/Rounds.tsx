
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  MapPin, ChevronRight, Clock, CheckCircle, MapIcon, Calendar, 
  Edit, Trash, Play, CheckCircle2, RotateCw, ListChecks, Plus, User, Phone 
} from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Patient {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance?: string;
}

interface Care {
  id: string;
  time: string;
  description: string;
  completed: boolean;
}

interface Round {
  id: string;
  name: string;
  date: string;
  status: "pending" | "in_progress" | "completed";
  assignedTo: string;
  patients: Array<{
    patient: Patient;
    cares: Care[];
  }>;
}

// Données fictives pour les tournées
const dummyRounds: Round[] = [
  {
    id: "round-1",
    name: "Tournée du matin",
    date: "29/04/2025",
    status: "in_progress",
    assignedTo: "Marie Dupont",
    patients: [
      {
        patient: {
          id: "p1",
          name: "Jean Dupont",
          address: "12 rue des Lilas, 75010 Paris",
          phone: "06 12 34 56 78",
          distance: "2,3 km"
        },
        cares: [
          {
            id: "care-1",
            time: "08:30",
            description: "Injection d'insuline",
            completed: true
          }
        ]
      },
      {
        patient: {
          id: "p2",
          name: "Marie Martin",
          address: "45 avenue Victor Hugo, 75016 Paris",
          phone: "06 23 45 67 89",
          distance: "4,1 km"
        },
        cares: [
          {
            id: "care-2",
            time: "09:15",
            description: "Pansement",
            completed: false
          }
        ]
      },
      {
        patient: {
          id: "p3",
          name: "Robert Petit",
          address: "8 rue du Commerce, 75015 Paris",
          phone: "06 34 56 78 90",
          distance: "3,5 km"
        },
        cares: [
          {
            id: "care-3",
            time: "10:00",
            description: "Prise de sang",
            completed: false
          },
          {
            id: "care-4",
            time: "10:15",
            description: "Tension artérielle",
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: "round-2",
    name: "Tournée du soir",
    date: "29/04/2025",
    status: "pending",
    assignedTo: "Jean Martin",
    patients: [
      {
        patient: {
          id: "p4",
          name: "Sophie Leroy",
          address: "23 rue de Vaugirard, 75015 Paris",
          phone: "06 45 67 89 01",
          distance: "1,8 km"
        },
        cares: [
          {
            id: "care-5",
            time: "18:00",
            description: "Injection d'insuline",
            completed: false
          }
        ]
      },
      {
        patient: {
          id: "p1",
          name: "Jean Dupont",
          address: "12 rue des Lilas, 75010 Paris",
          phone: "06 12 34 56 78",
          distance: "5,2 km"
        },
        cares: [
          {
            id: "care-6",
            time: "19:30",
            description: "Injection d'insuline",
            completed: false
          }
        ]
      }
    ]
  }
];

export default function Rounds() {
  const [activeTab, setActiveTab] = useState("today");
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [rounds] = useState<Round[]>(dummyRounds);
  const { addNotification } = useNotifications();
  const [isNewRoundDialogOpen, setIsNewRoundDialogOpen] = useState(false);
  
  // Filtrer les tournées selon l'onglet actif
  const filteredRounds = rounds.filter(round => {
    if (activeTab === "today") {
      return round.date === "29/04/2025";
    } else if (activeTab === "upcoming") {
      return new Date(round.date.split("/").reverse().join("-")) > new Date();
    } else {
      return round.status === "completed";
    }
  });
  
  const getTotalCares = (round: Round) => {
    return round.patients.reduce((acc, patient) => acc + patient.cares.length, 0);
  };
  
  const getCompletedCares = (round: Round) => {
    return round.patients.reduce((acc, patient) => {
      return acc + patient.cares.filter(care => care.completed).length;
    }, 0);
  };
  
  const getRoundStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="flex items-center gap-1"><Clock size={12} /> En attente</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500 flex items-center gap-1"><Play size={12} /> En cours</Badge>;
      case "completed":
        return <Badge className="bg-green-500 flex items-center gap-1"><CheckCircle size={12} /> Terminée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const handleStartRound = (round: Round) => {
    // Logique pour démarrer une tournée
    toast.success(`Tournée "${round.name}" démarrée`);
    addNotification({
      title: "Tournée démarrée",
      message: `La tournée "${round.name}" a été démarrée`,
      type: "info"
    });
    
    // Simuler les notifications de soins
    round.patients.forEach((patientData, index) => {
      setTimeout(() => {
        patientData.cares.forEach((care, careIndex) => {
          addNotification({
            title: "Rappel de soin",
            message: `${care.time} - ${care.description} pour ${patientData.patient.name}`,
            type: "info"
          });
        });
      }, (index + 1) * 3000); // Décalage pour simulation
    });
  };
  
  const handleCompleteRound = (round: Round) => {
    // Logique pour terminer une tournée
    toast.success(`Tournée "${round.name}" terminée`);
    addNotification({
      title: "Tournée terminée",
      message: `La tournée "${round.name}" a été marquée comme terminée`,
      type: "success"
    });
  };
  
  const handleOpenGpsNavigation = (address: string) => {
    // Ouvrir l'application GPS avec l'adresse
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    toast.info(`Navigation vers : ${address}`);
  };
  
  const handleOpenGpsNavigationForRound = (round: Round) => {
    const firstPatientAddress = round.patients[0]?.patient.address;
    if (firstPatientAddress) {
      handleOpenGpsNavigation(firstPatientAddress);
      toast.info(`Navigation démarrée pour la tournée "${round.name}"`);
    }
  };
  
  const handleMarkCareAsCompleted = (roundId: string, patientId: string, careId: string) => {
    // Dans une vraie application, mettre à jour l'état du soin
    toast.success("Soin marqué comme terminé");
    
    // Générer une feuille de soins
    const patient = rounds.find(r => r.id === roundId)?.patients.find(p => p.patient.id === patientId);
    if (patient) {
      const careSheet = {
        id: `CS-${Date.now().toString(36)}`,
        name: `Feuille de soins - ${patient.patient.name}`,
        type: "careSheet",
        date: new Date().toLocaleDateString("fr-FR"),
        patientName: patient.patient.name
      };
      
      toast.success(`Feuille de soins générée pour ${patient.patient.name}`);
    }
  };
  
  const handleCreateNewRound = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Nouvelle tournée créée");
    setIsNewRoundDialogOpen(false);
  };
  
  const handleCallPatient = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tournées</h1>
          <p className="text-muted-foreground">Gérez vos tournées et suivez votre progression</p>
        </div>
        <Dialog open={isNewRoundDialogOpen} onOpenChange={setIsNewRoundDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle tournée
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tournée</DialogTitle>
              <DialogDescription>
                Définissez les détails de votre nouvelle tournée
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateNewRound} className="space-y-4 py-4">
              <div>
                <Label htmlFor="roundName">Nom de la tournée</Label>
                <Input id="roundName" placeholder="Tournée du matin" required />
              </div>
              <div>
                <Label htmlFor="roundDate">Date</Label>
                <Input id="roundDate" type="date" required />
              </div>
              <div>
                <Label htmlFor="roundAssignedTo">Assignée à</Label>
                <select id="roundAssignedTo" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                  <option value="">Sélectionnez un membre</option>
                  <option value="Marie Dupont">Marie Dupont</option>
                  <option value="Jean Martin">Jean Martin</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="submit">Créer la tournée</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {filteredRounds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRounds.map((round) => (
                <Card key={round.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">{round.name}</CardTitle>
                        <CardDescription>
                          {round.date} • {round.patients.length} patients • {getTotalCares(round)} soins
                        </CardDescription>
                      </div>
                      {getRoundStatusBadge(round.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User size={16} />
                        <span>Assignée à {round.assignedTo}</span>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-1">Progression</div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(getCompletedCares(round) / getTotalCares(round)) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {getCompletedCares(round)} sur {getTotalCares(round)} soins terminés
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <div className="text-sm font-medium mb-2">Patients</div>
                        <div className="space-y-2">
                          {round.patients.slice(0, 2).map((patientData) => (
                            <div key={patientData.patient.id} className="flex justify-between items-center rounded-md p-2 hover:bg-accent">
                              <div>
                                <div className="font-medium">{patientData.patient.name}</div>
                                <div className="text-xs flex items-center gap-1 text-muted-foreground">
                                  <MapPin size={12} />
                                  {patientData.patient.address}
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-muted-foreground" />
                            </div>
                          ))}
                          
                          {round.patients.length > 2 && (
                            <div className="text-sm text-center text-muted-foreground">
                              + {round.patients.length - 2} autres patients
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {round.status === "pending" && (
                          <Button onClick={() => handleStartRound(round)} size="sm">
                            <Play size={16} className="mr-2" />
                            Démarrer
                          </Button>
                        )}
                        
                        {round.status === "in_progress" && (
                          <Button onClick={() => handleCompleteRound(round)} size="sm">
                            <CheckCircle2 size={16} className="mr-2" />
                            Terminer
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm" onClick={() => handleOpenGpsNavigationForRound(round)}>
                          <MapIcon size={16} className="mr-2" />
                          Navigation
                        </Button>
                        
                        <Button variant="outline" size="sm" onClick={() => setSelectedRound(round)}>
                          <ListChecks size={16} className="mr-2" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Calendar size={48} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Aucune tournée aujourd'hui</h3>
              <p className="text-muted-foreground mt-1">Créez une nouvelle tournée pour commencer</p>
              <Button className="mt-4" onClick={() => setIsNewRoundDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Nouvelle tournée
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tournées à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Assignée à</TableHead>
                    <TableHead>Patients</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRounds.length > 0 ? (
                    filteredRounds.map((round) => (
                      <TableRow key={round.id}>
                        <TableCell className="font-medium">{round.name}</TableCell>
                        <TableCell>{round.date}</TableCell>
                        <TableCell>{round.assignedTo}</TableCell>
                        <TableCell>{round.patients.length}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit size={16} className="mr-2" />
                              Modifier
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash size={16} className="mr-2" />
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Aucune tournée à venir
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Tournées terminées</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredRounds.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Assignée à</TableHead>
                      <TableHead>Soins effectués</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRounds.map((round) => (
                      <TableRow key={round.id}>
                        <TableCell className="font-medium">{round.name}</TableCell>
                        <TableCell>{round.date}</TableCell>
                        <TableCell>{round.assignedTo}</TableCell>
                        <TableCell>{getCompletedCares(round)}/{getTotalCares(round)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune tournée terminée à afficher
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedRound && (
        <Dialog open={!!selectedRound} onOpenChange={() => setSelectedRound(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                {selectedRound.name}
              </DialogTitle>
              <DialogDescription>
                {selectedRound.date} • {getRoundStatusBadge(selectedRound.status)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {selectedRound.patients.map((patientData) => (
                <div key={patientData.patient.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{patientData.patient.name}</h3>
                      <div className="flex flex-col text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{patientData.patient.address}</span>
                          <Button 
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => handleOpenGpsNavigation(patientData.patient.address)}
                          >
                            <MapIcon size={14} />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={14} />
                          <span>Distance estimée: {patientData.patient.distance}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCallPatient(patientData.patient.phone)}
                    >
                      <Phone size={16} className="mr-2" />
                      Appeler
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {patientData.cares.map((care) => (
                      <div 
                        key={care.id} 
                        className={`flex justify-between items-center p-3 rounded-md border ${care.completed ? 'bg-green-50 border-green-200' : 'bg-background'}`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{care.time}</span>
                            <span>{care.description}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {care.completed ? (
                            <Badge className="bg-green-500">
                              <CheckCircle size={14} className="mr-1" />
                              Terminé
                            </Badge>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handleMarkCareAsCompleted(selectedRound.id, patientData.patient.id, care.id)}
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Marquer comme terminé
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              {selectedRound.status === "pending" && (
                <Button onClick={() => handleStartRound(selectedRound)}>
                  <Play size={16} className="mr-2" />
                  Démarrer la tournée
                </Button>
              )}
              {selectedRound.status === "in_progress" && (
                <Button onClick={() => handleCompleteRound(selectedRound)}>
                  <CheckCircle2 size={16} className="mr-2" />
                  Terminer la tournée
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
