
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { DocumentService } from "@/services/DocumentService";

interface AppointmentPatient {
  id: string;
  name: string;
  address: string;
  care: string;
}

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  completed?: boolean;
  patient: AppointmentPatient;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onMarkAsCompleted: (appointmentId: string) => void;
}

export const AppointmentCard = ({ appointment, onMarkAsCompleted }: AppointmentCardProps) => {
  const handleDownloadCareSheet = () => {
    DocumentService.downloadDocument(
      "feuille_de_soins", 
      appointment.patient.id,
      {
        type: appointment.patient.care,
        date: appointment.date.toLocaleDateString("fr-FR"),
        time: appointment.time,
        patientName: appointment.patient.name,
        patientAddress: appointment.patient.address
      },
      true
    );
    
    toast.success(`Feuille de soins pré-remplie téléchargée pour ${appointment.patient.name}`);
  };

  return (
    <div 
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
            <Button variant="outline" size="sm" onClick={handleDownloadCareSheet}>
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
            onClick={() => onMarkAsCompleted(appointment.id)}
          >
            <CheckCircle size={14} className="mr-1" />
            Marquer comme terminé
          </Button>
        </div>
      )}
    </div>
  );
};
