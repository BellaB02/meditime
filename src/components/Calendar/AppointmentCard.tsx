
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, User, Clock, Check } from "lucide-react";
import { toast } from "sonner";

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  patient: {
    id: string;
    name: string;
    address: string;
    care: string;
  };
  completed?: boolean;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onMarkAsCompleted: (appointmentId: string) => void;
}

export const AppointmentCard = ({ appointment, onMarkAsCompleted }: AppointmentCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleMarkAsCompleted = () => {
    setIsLoading(true);
    
    // Simulate loading state
    setTimeout(() => {
      onMarkAsCompleted(appointment.id);
      setIsLoading(false);
    }, 500);
  };
  
  const handleCallPatient = () => {
    // Extract a phone number from the patient name (this is just a demo)
    // In a real app, this would come from patient data
    toast.info(`Appel à ${appointment.patient.name}`);
    
    // In a real app, this would use a phone number from the patient data
    window.location.href = `tel:0600000000`;
  };
  
  const handleNavigateToAddress = () => {
    const encodedAddress = encodeURIComponent(appointment.patient.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    toast.info(`Navigation vers : ${appointment.patient.address}`);
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
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
              <button 
                onClick={handleNavigateToAddress}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                <MapPin size={12} />
                <span>{appointment.patient.address}</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            {appointment.completed ? (
              <Button variant="outline" className="bg-green-50 text-green-600 border-green-200" disabled>
                <Check size={16} className="mr-2" />
                Terminé
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={handleMarkAsCompleted}
                disabled={isLoading}
              >
                Marquer terminé
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
