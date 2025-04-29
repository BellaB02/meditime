
import { Card } from "@/components/ui/card";
import { Clock, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// Types pour les rendez-vous
interface Appointment {
  id: string;
  time: string;
  patient: {
    id: string;
    name: string;
    address: string;
    care: string;
  }
}

interface AppointmentListProps {
  title: string;
  appointments: Appointment[];
}

const AppointmentList = ({ title, appointments = [] }: AppointmentListProps) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-3">
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="p-3 border rounded-md card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <Clock size={20} />
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

              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <a href={`/patients/${appointment.patient.id}`}>
                  Voir fiche
                </a>
              </Button>
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
