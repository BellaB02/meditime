
import { useState, useCallback } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";
import { AppointmentList } from "@/components/Calendar/AppointmentList";
import { Appointment } from "@/components/Calendar/AppointmentCard";
import { DocumentService } from "@/services/DocumentService";
import { toast } from "sonner";
import { AddAppointmentDialog } from "@/components/Calendar/AddAppointmentDialog";
import { motion } from "framer-motion";

// Données fictives
const appointmentsData: Appointment[] = [
  {
    id: "1",
    date: new Date(),
    time: "08:30",
    patient: {
      id: "p1",
      name: "Jean Dupont",
      address: "12 rue des Lilas, 75010 Paris",
      care: "Prise de sang"
    }
  },
  {
    id: "2",
    date: new Date(),
    time: "10:15",
    patient: {
      id: "p2",
      name: "Marie Martin",
      address: "5 avenue Victor Hugo, 75016 Paris",
      care: "Changement pansement"
    }
  },
  {
    id: "3",
    date: new Date(),
    time: "14:00",
    patient: {
      id: "p3",
      name: "Robert Petit",
      address: "8 rue du Commerce, 75015 Paris",
      care: "Injection insuline"
    }
  },
  {
    id: "4",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: "09:00",
    patient: {
      id: "p4",
      name: "Sophie Leroy",
      address: "25 rue des Martyrs, 75009 Paris",
      care: "Soins post-opératoires"
    }
  },
  {
    id: "5",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: "11:30",
    patient: {
      id: "p5",
      name: "Pierre Bernard",
      address: "14 boulevard Haussmann, 75008 Paris",
      care: "Perfusion"
    }
  }
];

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Filtrer les rendez-vous pour la date sélectionnée
  const filteredAppointments = date ? appointments.filter(appointment => 
    appointment.date.toDateString() === date.toDateString()
  ) : [];
  
  // Trier les rendez-vous par heure
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  // Ajouter un nouveau rendez-vous
  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment]);
  };

  // Fonction pour marquer un rendez-vous comme terminé
  const handleMarkAsCompleted = useCallback((appointmentId: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, completed: true } 
          : appointment
      )
    );
    
    // Trouver le rendez-vous pour obtenir les informations du patient
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      // Générer une feuille de soins avec toutes les informations du patient
      const careSheet = DocumentService.generateCareSheet(
        appointmentId, 
        appointment.patient.name,
        appointment.patient.id
      );
      
      toast.success(`Rendez-vous marqué comme terminé`);
      toast.success(`Feuille de soins générée pour ${appointment.patient.name}`);
    }
  }, [appointments]);

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
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <AppointmentList 
            date={date}
            appointments={sortedAppointments}
            onMarkAsCompleted={handleMarkAsCompleted}
          />
        </div>
      </div>
      
      <AddAppointmentDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddAppointment={handleAddAppointment}
      />
    </motion.div>
  );
};

export default Calendar;
