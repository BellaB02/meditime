
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, MapPin, Clock, ChevronRight, CheckCircle2, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  // Sample data for appointments
  const [todayAppointments, setTodayAppointments] = useState([
    {
      id: "1",
      time: "10:00",
      patient: {
        id: "p1",
        name: "Jean Dupont",
        address: "15 Rue de Paris, 75001 Paris",
        care: "Pansement",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean"
      },
      completed: false
    },
    {
      id: "2",
      time: "11:30",
      patient: {
        id: "p2",
        name: "Marie Martin",
        address: "8 Avenue Victor Hugo, 75016 Paris",
        care: "Injection insuline",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie"
      },
      completed: false
    }
  ]);

  // Compter les soins terminés
  const completedAppointments = todayAppointments.filter(app => app.completed).length;
  const totalAppointments = todayAppointments.length;
  const completionPercentage = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;

  // Gérer la complétion d'un rendez-vous
  const handleAppointmentComplete = (appointmentId: string) => {
    setTodayAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, completed: true } 
          : appointment
      )
    );
    
    toast.success("Soin marqué comme terminé");
  };
  
  // Naviguer vers la fiche patient
  const navigateToPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Rendez-vous aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalAppointments}</div>
            <p className="text-sm text-muted-foreground">
              {completedAppointments} terminé{completedAppointments > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Patients actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">12</div>
            <p className="text-sm text-muted-foreground">
              3 nouveaux ce mois-ci
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Activité du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">8</div>
            <p className="text-sm text-muted-foreground">
              5 soins, 3 feuilles générées
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="bg-accent/30 pb-2">
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Rendez-vous du jour
                </div>
                <Badge variant="outline" className="font-normal">
                  {completedAppointments}/{totalAppointments} terminés
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 pb-2">
                <Progress value={completionPercentage} className="h-2" />
              </div>
              <div className="divide-y">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} 
                    className={`p-4 transition-colors hover:bg-muted/50 ${appointment.completed ? 'bg-muted/30' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={appointment.patient.avatar} />
                          <AvatarFallback>{appointment.patient.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{appointment.patient.name}</h3>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{appointment.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="font-normal">
                            {appointment.patient.care}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-2">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span className="truncate">{appointment.patient.address}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!appointment.completed ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAppointmentComplete(appointment.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Fait
                          </Button>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Terminé
                          </Badge>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigateToPatient(appointment.patient.id)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-accent/30 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Rendez-vous à venir
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Jean Dupont</div>
                    <Badge variant="outline">Demain</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">10:00 • Pansement</div>
                </div>
                <div className="p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Marie Martin</div>
                    <Badge variant="outline">Demain</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">11:30 • Injection insuline</div>
                </div>
                <div className="p-4 bg-accent/10">
                  <Button variant="ghost" className="w-full text-primary h-8" onClick={() => navigate('/calendar')}>
                    Voir tout le planning
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="bg-accent/30 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4">
                  <div className="font-medium">Feuille de soins générée</div>
                  <div className="text-xs text-muted-foreground mt-1">Il y a 35 minutes</div>
                </div>
                <div className="p-4">
                  <div className="font-medium">Facture envoyée</div>
                  <div className="text-xs text-muted-foreground mt-1">Il y a 2 heures</div>
                </div>
                <div className="p-4">
                  <div className="font-medium">Nouveau patient ajouté</div>
                  <div className="text-xs text-muted-foreground mt-1">Il y a 4 heures</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
