
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentDateHeader } from "./AppointmentDateHeader";
import { AppointmentCard, Appointment } from "./AppointmentCard";

interface AppointmentListProps {
  date: Date | undefined;
  appointments: Appointment[];
  onMarkAsCompleted: (appointmentId: string) => void;
}

export const AppointmentList = ({ date, appointments, onMarkAsCompleted }: AppointmentListProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <AppointmentDateHeader 
          date={date} 
          appointmentCount={appointments.length} 
        />

        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onMarkAsCompleted={onMarkAsCompleted}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun rendez-vous prévu pour cette date
          </div>
        )}
      </CardContent>
    </Card>
  );
};
