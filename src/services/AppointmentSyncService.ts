
import { Appointment } from "@/components/Calendar/AppointmentCard";
import { Round, RoundStop } from "@/types/rounds";
import { toast } from "sonner";
import { DateFormatService } from "./DateFormatService";

export const AppointmentSyncService = {
  /**
   * Convert appointments to round stops
   */
  appointmentsToStops: (appointments: Appointment[]): RoundStop[] => {
    return appointments.map(appointment => ({
      id: `stop-${appointment.id}`,
      patient: {
        name: appointment.patient.name,
        address: appointment.patient.address
      },
      time: appointment.time,
      care: appointment.patient.care,
      completed: appointment.completed || false
    }));
  },

  /**
   * Convert round stops to appointments
   */
  stopsToAppointments: (stops: RoundStop[], date: Date): Appointment[] => {
    return stops.map(stop => ({
      id: stop.id.replace('stop-', ''),
      date: date,
      time: stop.time,
      patient: {
        id: `p-${stop.id}`,
        name: stop.patient.name,
        address: stop.patient.address,
        care: stop.care
      },
      completed: stop.completed
    }));
  },

  /**
   * Create a round from appointments
   */
  createRoundFromAppointments: (appointments: Appointment[], name: string): Omit<Round, 'id'> => {
    if (appointments.length === 0) {
      toast.error("Aucun rendez-vous sélectionné pour créer une tournée");
      throw new Error("No appointments selected");
    }
    
    // Get the date from the first appointment
    const date = appointments[0].date;
    const formattedDate = DateFormatService.formatDate(date);
    
    return {
      name: name,
      date: formattedDate,
      stops: AppointmentSyncService.appointmentsToStops(appointments),
      completed: false,
      started: false
    };
  },
  
  /**
   * Sync a round with appointments
   */
  syncRoundWithAppointments: (round: Round, appointments: Appointment[]): void => {
    // Find appointments that match the round stops
    const matchingAppointments = appointments.filter(appointment => 
      round.stops.some(stop => 
        stop.patient.name === appointment.patient.name && 
        stop.time === appointment.time
      )
    );
    
    // Update round stops based on appointment status
    const updatedStops = round.stops.map(stop => {
      const matchingAppointment = matchingAppointments.find(appointment => 
        stop.patient.name === appointment.patient.name && 
        stop.time === appointment.time
      );
      
      if (matchingAppointment) {
        return {
          ...stop,
          completed: matchingAppointment.completed || stop.completed
        };
      }
      
      return stop;
    });
    
    // Update the round with the updated stops
    round.stops = updatedStops;
    
    toast.success("Synchronisation des données effectuée");
  }
};
