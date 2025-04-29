
import { useState } from "react";
import { toast } from "sonner";
import { Appointment } from "@/components/Calendar/AppointmentCard";
import { DocumentService } from "@/services/DocumentService";

// Sample data
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

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFilteredAppointments = (date: Date | undefined) => {
    try {
      if (!date) return [];
      
      return appointments
        .filter(appointment => appointment.date.toDateString() === date.toDateString())
        .sort((a, b) => a.time.localeCompare(b.time));
    } catch (err) {
      setError("Erreur lors du filtrage des rendez-vous");
      return [];
    }
  };

  const addAppointment = (newAppointment: Appointment) => {
    try {
      setIsLoading(true);
      
      // Check if an appointment with the same patient, date and time already exists
      const existingAppointment = appointments.find(
        app => 
          app.patient.id === newAppointment.patient.id && 
          app.date.toDateString() === newAppointment.date.toDateString() &&
          app.time === newAppointment.time
      );
      
      if (existingAppointment) {
        toast.error("Ce patient a déjà un rendez-vous à cette date et cette heure");
        setIsLoading(false);
        return;
      }
      
      setAppointments(prev => [...prev, newAppointment]);
      toast.success("Rendez-vous ajouté avec succès");
    } catch (err) {
      setError("Erreur lors de l'ajout du rendez-vous");
      toast.error("Erreur lors de l'ajout du rendez-vous");
    } finally {
      setIsLoading(false);
    }
  };

  const markAppointmentAsCompleted = (appointmentId: string) => {
    try {
      setIsLoading(true);
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, completed: true } 
            : appointment
        )
      );
      
      // Find the appointment to get patient information
      const appointment = appointments.find(app => app.id === appointmentId);
      if (appointment) {
        // Generate care sheet
        DocumentService.generateCareSheet(
          appointmentId, 
          appointment.patient.name,
          appointment.patient.id
        );
        
        toast.success("Rendez-vous marqué comme terminé");
        toast.success(`Feuille de soins générée pour ${appointment.patient.name}`);
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du rendez-vous");
      toast.error("Erreur lors de la mise à jour du rendez-vous");
    } finally {
      setIsLoading(false);
    }
  };

  const getAppointmentsByPatientId = (patientId: string) => {
    return appointments.filter(app => app.patient.id === patientId)
      .sort((a, b) => {
        // Sort by date and time
        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });
  };

  return {
    appointments,
    isLoading,
    error,
    getFilteredAppointments,
    getAppointmentsByPatientId,
    addAppointment,
    markAppointmentAsCompleted
  };
};
