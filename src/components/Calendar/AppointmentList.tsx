
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentDateHeader } from "./AppointmentDateHeader";
import { AppointmentCard, Appointment } from "./AppointmentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentEmptyState } from "./AppointmentEmptyState";
import { AppointmentLoadingState } from "./AppointmentLoadingState";

interface AppointmentListProps {
  date: Date | undefined;
  appointments: Appointment[];
  onMarkAsCompleted: (appointmentId: string) => void;
  isLoading?: boolean;
}

export const AppointmentList = ({ date, appointments, onMarkAsCompleted, isLoading = false }: AppointmentListProps) => {
  const renderContent = () => {
    if (isLoading) {
      return <AppointmentLoadingState />;
    }

    if (appointments.length === 0) {
      return <AppointmentEmptyState />;
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
    <Card className="transition-all duration-300 ease-in-out">
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
