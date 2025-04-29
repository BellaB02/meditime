
import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";
import { AppointmentList } from "@/components/Calendar/AppointmentList";
import { AddAppointmentDialog } from "@/components/Calendar/AddAppointmentDialog";
import { motion } from "framer-motion";
import { useAppointments } from "@/hooks/useAppointments";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const {
    error,
    isLoading,
    getFilteredAppointments,
    addAppointment,
    markAppointmentAsCompleted
  } = useAppointments();
  
  // Filtrer et trier les rendez-vous pour la date sélectionnée
  const filteredAppointments = getFilteredAppointments(date);

  return (
    <motion.div 
      className="animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <CalendarHeader 
        view={view} 
        setView={setView} 
        onAddAppointment={() => setIsAddDialogOpen(true)}
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
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

        <div className="lg:col-span-2">
          <AppointmentList 
            date={date}
            appointments={filteredAppointments}
            onMarkAsCompleted={markAppointmentAsCompleted}
            isLoading={isLoading}
          />
        </div>
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
