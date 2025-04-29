
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '@/integrations/supabase/services/appointmentsService';
import { toast } from 'sonner';
import { Appointment, Round, RoundStop } from '@/integrations/supabase/services/types';

export function useAppointmentsService() {
  const queryClient = useQueryClient();
  
  // Appointments Queries
  const useAppointments = (filters?: {
    date?: string;
    startDate?: string;
    endDate?: string;
    patientId?: string;
    status?: string;
  }) => {
    const queryKey = ['appointments', filters];
    
    return useQuery({
      queryKey,
      queryFn: () => appointmentsService.getAppointments(filters),
    });
  };
  
  const useAppointment = (appointmentId: string) => {
    return useQuery({
      queryKey: ['appointment', appointmentId],
      queryFn: () => appointmentsService.getAppointment(appointmentId),
      enabled: !!appointmentId,
    });
  };
  
  const useCreateAppointment = () => {
    return useMutation({
      mutationFn: (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => 
        appointmentsService.createAppointment(appointment),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        toast.success("Rendez-vous créé avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la création du rendez-vous");
        console.error("Error creating appointment:", error);
      }
    });
  };
  
  const useUpdateAppointment = () => {
    return useMutation({
      mutationFn: ({ appointmentId, data }: { appointmentId: string, data: Partial<Appointment> }) => 
        appointmentsService.updateAppointment(appointmentId, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['appointment', variables.appointmentId] });
        toast.success("Rendez-vous mis à jour avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour du rendez-vous");
        console.error("Error updating appointment:", error);
      }
    });
  };
  
  const useCompleteAppointment = () => {
    return useMutation({
      mutationFn: (appointmentId: string) => 
        appointmentsService.completeAppointment(appointmentId),
      onSuccess: (_, appointmentId) => {
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
        toast.success("Rendez-vous marqué comme terminé");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour du rendez-vous");
        console.error("Error completing appointment:", error);
      }
    });
  };
  
  // Rounds Queries
  const useRounds = (filters?: { date?: string; status?: string }) => {
    return useQuery({
      queryKey: ['rounds', filters],
      queryFn: () => appointmentsService.getRounds(filters),
    });
  };
  
  const useRound = (roundId: string) => {
    return useQuery({
      queryKey: ['round', roundId],
      queryFn: () => appointmentsService.getRound(roundId),
      enabled: !!roundId,
    });
  };
  
  const useCreateRound = () => {
    return useMutation({
      mutationFn: (round: Omit<Round, 'id' | 'created_at' | 'updated_at'>) => 
        appointmentsService.createRound(round),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['rounds'] });
        toast.success("Tournée créée avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la création de la tournée");
        console.error("Error creating round:", error);
      }
    });
  };
  
  const useAddStopToRound = () => {
    return useMutation({
      mutationFn: (roundStop: Omit<RoundStop, 'id' | 'created_at' | 'updated_at'>) => 
        appointmentsService.addStopToRound(roundStop),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['round', variables.round_id] });
        toast.success("Stop ajouté à la tournée");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de l'ajout du stop à la tournée");
        console.error("Error adding stop to round:", error);
      }
    });
  };
  
  const useUpdateRoundStatus = () => {
    return useMutation({
      mutationFn: ({ roundId, status }: { roundId: string, status: string }) => 
        appointmentsService.updateRoundStatus(roundId, status),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['rounds'] });
        queryClient.invalidateQueries({ queryKey: ['round', variables.roundId] });
        
        const statusMessage = 
          variables.status === 'completed' ? "terminée" :
          variables.status === 'in-progress' ? "démarrée" :
          variables.status === 'canceled' ? "annulée" : "mise à jour";
        
        toast.success(`Tournée ${statusMessage} avec succès`);
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour de la tournée");
        console.error("Error updating round status:", error);
      }
    });
  };

  return {
    useAppointments,
    useAppointment,
    useCreateAppointment,
    useUpdateAppointment,
    useCompleteAppointment,
    useRounds,
    useRound,
    useCreateRound,
    useAddStopToRound,
    useUpdateRoundStatus
  };
}
