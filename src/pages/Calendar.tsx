
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";
import { AppointmentList } from "@/components/Calendar/AppointmentList";
import { AddAppointmentDialog } from "@/components/Calendar/AddAppointmentDialog";
import { AppointmentSearch } from "@/components/Calendar/AppointmentSearch";
import { motion } from "framer-motion";
import { useAppointments } from "@/hooks/useAppointments";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { Appointment } from "@/components/Calendar/AppointmentCard";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const {
    error,
    isLoading,
    getFilteredAppointments,
    addAppointment,
    markAppointmentAsCompleted
  } = useAppointments();
  
  // Surveiller la connectivité réseau
  useState(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connexion rétablie");
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Connexion perdue");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });
  
  // Filtrer les rendez-vous par date et recherche
  const filteredAppointments = getFilteredAppointments(date).filter(appointment => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const { patient } = appointment;
    
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.address.toLowerCase().includes(query) ||
      patient.care.toLowerCase().includes(query)
    );
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <motion.div 
      className="animate-fade-in space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <CalendarHeader 
        view={view} 
        setView={setView} 
        onAddAppointment={() => setIsAddDialogOpen(true)}
      />

      {!isOnline && (
        <Alert variant="destructive" className="mb-6">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Mode hors ligne</AlertTitle>
          <AlertDescription>
            Vous êtes actuellement en mode hors ligne. Certaines fonctionnalités peuvent être limitées.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          layout
          transition={{ duration: 0.3 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="p-4">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                classNames={{
                  day_today: "bg-primary text-primary-foreground"
                }}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          layout
          transition={{ duration: 0.3 }}
          className="lg:col-span-2 space-y-4"
        >
          <AppointmentSearch onSearch={handleSearch} />
          
          <AppointmentList 
            date={date}
            appointments={filteredAppointments}
            onMarkAsCompleted={markAppointmentAsCompleted}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
      
      <AddAppointmentDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddAppointment={addAppointment}
      />
    </motion.div>
  );
};

export default Calendar;
