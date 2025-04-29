
import { Card } from "@/components/ui/card";
import { Clock, User, MapPin, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { DocumentService } from "@/services/DocumentService";

// Types pour les rendez-vous
interface Appointment {
  id: string;
  time: string;
  patient: {
    id: string;
    name: string;
    address: string;
    care: string;
  };
  completed?: boolean;
}

interface AppointmentListProps {
  title: string;
  appointments: Appointment[];
  onAppointmentComplete?: (appointmentId: string) => void;
}

const AppointmentList = ({ title, appointments = [], onAppointmentComplete }: AppointmentListProps) => {
  const [completedAppointments, setCompletedAppointments] = useState<string[]>([]);

  const handleMarkAsCompleted = (appointmentId: string) => {
    setCompletedAppointments((prev) => [...prev, appointmentId]);
    
    // Si une fonction de rappel est fournie, on l'appelle
    if (onAppointmentComplete) {
      onAppointmentComplete(appointmentId);
    }
    
    // Générer une feuille de soins
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      DocumentService.generateCareSheet(appointmentId, appointment.patient.name, appointment.patient.id);
      toast.success(`Soin marqué comme terminé pour ${appointment.patient.name}`);
      toast.success("Feuille de soins générée avec succès");
    }
  };

  const handleDownloadCareSheet = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      DocumentService.downloadDocument('careSheet', appointment.patient.id, {
        type: appointment.patient.care,
        date: new Date().toLocaleDateString('fr-FR')
      }, true);
      toast.success(`Feuille de soins téléchargée pour ${appointment.patient.name}`);
    }
  };

  // Vérifier si un rendez-vous est marqué comme terminé
  const isAppointmentCompleted = (appointmentId: string) => {
    return completedAppointments.includes(appointmentId) || 
           appointments.find(app => app.id === appointmentId)?.completed;
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-3">
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className={`p-3 border rounded-md card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isAppointmentCompleted(appointment.id) ? "bg-green-50 border-green-200" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isAppointmentCompleted(appointment.id) ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"}`}>
                  {isAppointmentCompleted(appointment.id) ? <CheckCircle size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <p className="font-medium">{appointment.time}</p>
                  <p className="text-sm text-muted-foreground">{appointment.patient.care}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-accent text-primary p-2 rounded-full">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-medium">{appointment.patient.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={12} />
                    <span>{appointment.patient.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!isAppointmentCompleted(appointment.id) ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleMarkAsCompleted(appointment.id)}
                    className="w-full sm:w-auto"
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Marquer terminé
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-green-50 text-green-600 border-green-200 w-full sm:w-auto"
                      disabled
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Terminé
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadCareSheet(appointment.id)}
                      className="w-full sm:w-auto"
                    >
                      <FileText size={16} className="mr-1" />
                      Feuille de soins
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <a href={`/patients/${appointment.patient.id}`}>
                    Voir fiche
                  </a>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Aucun rendez-vous prévu
          </div>
        )}
      </div>
    </Card>
  );
};

export default AppointmentList;
