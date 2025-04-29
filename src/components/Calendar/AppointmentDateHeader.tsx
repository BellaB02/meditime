
import { CalendarIcon } from "lucide-react";

interface AppointmentDateHeaderProps {
  date: Date | undefined;
  appointmentCount: number;
}

export const AppointmentDateHeader = ({ date, appointmentCount }: AppointmentDateHeaderProps) => {
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

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{formatDate(date)}</h2>
      </div>
      <span className="text-sm text-muted-foreground">
        {appointmentCount} rendez-vous
      </span>
    </div>
  );
};
