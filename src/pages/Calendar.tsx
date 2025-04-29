
import { useState, useCallback } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, User, Plus, Calendar as CalendarIcon, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { DocumentService } from "@/services/DocumentService";

// Types
interface Appointment {
  id: string;
  date: Date;
  time: string;
  completed?: boolean;
  patient: {
    id: string;
    name: string;
    address: string;
    care: string;
  }
}

// Données fictives
const appointmentsData: Appointment[] = [
  {
    id: "1",
    date: new Date(),
    time: "08:30",
    patient: {
      id: "p1",
      name: "Jean Dupont",
      address: "12 rue des Lilas, 75010 Paris",
      care: "Prise de sang"
    }
  },
  {
    id: "2",
    date: new Date(),
    time: "10:15",
    patient: {
      id: "p2",
      name: "Marie Martin",
      address: "5 avenue Victor Hugo, 75016 Paris",
      care: "Changement pansement"
    }
  },
  {
    id: "3",
    date: new Date(),
    time: "14:00",
    patient: {
      id: "p3",
      name: "Robert Petit",
      address: "8 rue du Commerce, 75015 Paris",
      care: "Injection insuline"
    }
  },
  {
    id: "4",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: "09:00",
    patient: {
      id: "p4",
      name: "Sophie Leroy",
      address: "25 rue des Martyrs, 75009 Paris",
      care: "Soins post-opératoires"
    }
  },
  {
    id: "5",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: "11:30",
    patient: {
      id: "p5",
      name: "Pierre Bernard",
      address: "14 boulevard Haussmann, 75008 Paris",
      care: "Perfusion"
    }
  }
];

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsData);
  
  // Filtrer les rendez-vous pour la date sélectionnée
  const filteredAppointments = date ? appointments.filter(appointment => 
    appointment.date.toDateString() === date.toDateString()
  ) : [];
  
  // Trier les rendez-vous par heure
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
  
  // Formater la date pour l'affichage
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Aucune date";
    
    return new Intl.DateTimeFormat('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Fonction pour marquer un rendez-vous comme terminé
  const handleMarkAsCompleted = useCallback((appointmentId: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, completed: true } 
          : appointment
      )
    );
    
    // Trouver le rendez-vous pour obtenir les informations du patient
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      // Générer une feuille de soins
      const careSheet = DocumentService.generateCareSheet(
        appointmentId, 
        appointment.patient.name,
        appointment.patient.id
      );
      
      toast.success(`Rendez-vous marqué comme terminé`);
      toast.success(`Feuille de soins générée pour ${appointment.patient.name}`);
    }
  }, [appointments]);
  
  // Fonction pour télécharger la feuille de soins
  const handleDownloadCareSheet = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      DocumentService.downloadDocument(
        "feuille_de_soins", 
        appointment.patient.id,
        {
          type: appointment.patient.care,
          date: appointment.date.toLocaleDateString("fr-FR"),
          time: appointment.time
        }
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Planning des tournées</h1>
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
            <TabsList>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
              <TabsTrigger value="list">Liste</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter RDV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              classNames={{
                day_today: "bg-primary text-primary-foreground"
              }}
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">{formatDate(date)}</h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {sortedAppointments.length} rendez-vous
                </span>
              </div>

              {sortedAppointments.length > 0 ? (
                <div className="space-y-4">
                  {sortedAppointments.map(appointment => (
                    <div 
                      key={appointment.id} 
                      className={`border rounded-md p-4 ${appointment.completed ? "bg-green-50 border-green-200" : "card-hover"}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {appointment.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-primary" />
                          )}
                          <span className="font-semibold">{appointment.time}</span>
                          {appointment.completed && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Terminé</span>}
                        </div>
                        <div className="flex gap-2">
                          {appointment.completed && (
                            <Button variant="outline" size="sm" onClick={() => handleDownloadCareSheet(appointment.id)}>
                              <Download size={14} className="mr-1" />
                              Feuille de soins
                            </Button>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/patients/${appointment.patient.id}`}>
                              Voir fiche
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.patient.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{appointment.patient.address}</span>
                        </div>
                        <div className="mt-2 bg-accent inline-block px-2 py-1 rounded-full text-xs">
                          {appointment.patient.care}
                        </div>
                      </div>
                      
                      {!appointment.completed && (
                        <div className="mt-4">
                          <Button 
                            size="sm" 
                            onClick={() => handleMarkAsCompleted(appointment.id)}
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Marquer comme terminé
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun rendez-vous prévu pour cette date
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
