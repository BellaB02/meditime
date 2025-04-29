
import { supabase } from '../client';
import { Appointment, Round, RoundStop } from './types';

export const appointmentsService = {
  // Récupérer tous les rendez-vous
  getAppointments: async (filters?: {
    date?: string;
    startDate?: string;
    endDate?: string;
    patientId?: string;
    status?: string;
  }): Promise<Appointment[]> => {
    let query = supabase
      .from('appointments')
      .select('*, patients!inner(*)');
    
    if (filters) {
      if (filters.date) {
        query = query.eq('date', filters.date);
      }
      if (filters.startDate && filters.endDate) {
        query = query.gte('date', filters.startDate).lte('date', filters.endDate);
      }
      if (filters.patientId) {
        query = query.eq('patient_id', filters.patientId);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
    }
    
    const { data, error } = await query.order('date').order('time');
    
    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
    
    return data as unknown as Appointment[];
  },
  
  // Récupérer un rendez-vous spécifique
  getAppointment: async (appointmentId: string): Promise<Appointment> => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(*)')
      .eq('id', appointmentId)
      .single();
      
    if (error) {
      console.error(`Error fetching appointment ${appointmentId}:`, error);
      throw error;
    }
    
    return data as unknown as Appointment;
  },
  
  // Créer un nouveau rendez-vous
  createAppointment: async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> => {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
    
    return data as Appointment;
  },
  
  // Mettre à jour un rendez-vous existant
  updateAppointment: async (appointmentId: string, appointment: Partial<Appointment>): Promise<Appointment> => {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointment)
      .eq('id', appointmentId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating appointment ${appointmentId}:`, error);
      throw error;
    }
    
    return data as Appointment;
  },
  
  // Marquer un rendez-vous comme terminé
  completeAppointment: async (appointmentId: string): Promise<Appointment> => {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error completing appointment ${appointmentId}:`, error);
      throw error;
    }
    
    return data as Appointment;
  },
  
  // Tournées
  
  // Récupérer toutes les tournées
  getRounds: async (filters?: { date?: string; status?: string }): Promise<Round[]> => {
    let query = supabase
      .from('rounds')
      .select('*');
    
    if (filters) {
      if (filters.date) {
        query = query.eq('date', filters.date);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching rounds:', error);
      throw error;
    }
    
    return data as Round[];
  },
  
  // Récupérer une tournée spécifique avec ses stops
  getRound: async (roundId: string): Promise<{ round: Round, stops: RoundStop[] }> => {
    const { data: roundData, error: roundError } = await supabase
      .from('rounds')
      .select('*')
      .eq('id', roundId)
      .single();
      
    if (roundError) {
      console.error(`Error fetching round ${roundId}:`, roundError);
      throw roundError;
    }
    
    const { data: stopsData, error: stopsError } = await supabase
      .from('round_stops')
      .select('*, appointments(*), appointments.patients(*)')
      .eq('round_id', roundId)
      .order('stop_order', { ascending: true });
      
    if (stopsError) {
      console.error(`Error fetching stops for round ${roundId}:`, stopsError);
      throw stopsError;
    }
    
    return {
      round: roundData as Round,
      stops: stopsData as unknown as RoundStop[]
    };
  },
  
  // Créer une nouvelle tournée
  createRound: async (round: Omit<Round, 'id' | 'created_at' | 'updated_at'>): Promise<Round> => {
    const { data, error } = await supabase
      .from('rounds')
      .insert(round)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating round:', error);
      throw error;
    }
    
    return data as Round;
  },
  
  // Ajouter un stop à une tournée
  addStopToRound: async (roundStop: Omit<RoundStop, 'id' | 'created_at' | 'updated_at'>): Promise<RoundStop> => {
    const { data, error } = await supabase
      .from('round_stops')
      .insert(roundStop)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding stop to round:', error);
      throw error;
    }
    
    return data as RoundStop;
  },
  
  // Mettre à jour le statut d'une tournée
  updateRoundStatus: async (roundId: string, status: string): Promise<Round> => {
    const { data, error } = await supabase
      .from('rounds')
      .update({ status })
      .eq('id', roundId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating round ${roundId} status:`, error);
      throw error;
    }
    
    return data as Round;
  }
};
