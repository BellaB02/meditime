
import { supabase } from '../client';

export const billingService = {
  // Récupérer tous les enregistrements de facturation
  getBillingRecords: async (filters?: {
    startDate?: string;
    endDate?: string;
    patientId?: string;
    status?: string;
  }): Promise<any[]> => {
    let query = supabase
      .from('billing_records')
      .select('*, patients(*)');
    
    if (filters) {
      if (filters.startDate && filters.endDate) {
        query = query.gte('created_at', filters.startDate).lte('created_at', filters.endDate);
      }
      if (filters.patientId) {
        query = query.eq('patient_id', filters.patientId);
      }
      if (filters.status) {
        query = query.eq('transmission_status', filters.status);
      }
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching billing records:', error);
      throw error;
    }
    
    return data;
  },
  
  // Récupérer un enregistrement de facturation spécifique
  getBillingRecord: async (recordId: string): Promise<any> => {
    const { data, error } = await supabase
      .from('billing_records')
      .select('*, patients(*)')
      .eq('id', recordId)
      .single();
      
    if (error) {
      console.error(`Error fetching billing record ${recordId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Créer un nouvel enregistrement de facturation
  createBillingRecord: async (record: any): Promise<any> => {
    const { data, error } = await supabase
      .from('billing_records')
      .insert(record)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating billing record:', error);
      throw error;
    }
    
    return data;
  },
  
  // Mettre à jour le statut de transmission d'un enregistrement
  updateTransmissionStatus: async (recordId: string, status: string, transmissionId?: string): Promise<any> => {
    const updateData: any = {
      transmission_status: status
    };
    
    if (transmissionId) {
      updateData.transmission_id = transmissionId;
    }
    
    const { data, error } = await supabase
      .from('billing_records')
      .update(updateData)
      .eq('id', recordId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating transmission status for record ${recordId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Mettre à jour le statut de paiement d'un enregistrement
  updatePaymentStatus: async (recordId: string, status: string, paymentDate?: string): Promise<any> => {
    const updateData: any = {
      payment_status: status
    };
    
    if (paymentDate) {
      updateData.payment_date = paymentDate;
    }
    
    const { data, error } = await supabase
      .from('billing_records')
      .update(updateData)
      .eq('id', recordId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating payment status for record ${recordId}:`, error);
      throw error;
    }
    
    return data;
  }
};
