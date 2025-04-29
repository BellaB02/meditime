
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentDateHeader } from "./AppointmentDateHeader";
import { AppointmentCard, Appointment } from "./AppointmentCard";
import { Skeleton } from "@/components/ui/skeleton";

interface AppointmentListProps {
  date: Date | undefined;
  appointments: Appointment[];
  onMarkAsCompleted: (appointmentId: string) => void;
  isLoading?: boolean;
}

export const AppointmentList = ({ date, appointments, onMarkAsCompleted, isLoading = false }: AppointmentListProps) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-32" />
          ))}
        </div>
      );
    }

    if (appointments.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Aucun rendez-vous prévu pour cette date
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onMarkAsCompleted={onMarkAsCompleted}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <AppointmentDateHeader 
          date={date} 
          appointmentCount={appointments.length} 
        />
        {renderContent()}
      </CardContent>
    </Card>
  );
};
