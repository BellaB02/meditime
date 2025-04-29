
import { supabase } from '../client';
import { NursingAct } from './types';

export const nursingActsService = {
  getNursingActs: async () => {
    const { data, error } = await supabase
      .from('nursing_acts')
      .select('*')
      .order('code', { ascending: true });
      
    if (error) {
      console.error('Error fetching nursing acts:', error);
      throw error;
    }
    
    return data;
  },
  
  getNursingAct: async (id: string) => {
    const { data, error } = await supabase
      .from('nursing_acts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching nursing act ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  createNursingAct: async (nursingAct: Omit<NursingAct, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('nursing_acts')
      .insert([nursingAct])
      .select();
      
    if (error) {
      console.error('Error creating nursing act:', error);
      throw error;
    }
    
    return data[0];
  },
  
  updateNursingAct: async (id: string, nursingAct: Partial<NursingAct>) => {
    const { data, error } = await supabase
      .from('nursing_acts')
      .update(nursingAct)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error(`Error updating nursing act ${id}:`, error);
      throw error;
    }
    
    return data[0];
  },
  
  deleteNursingAct: async (id: string) => {
    const { error } = await supabase
      .from('nursing_acts')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting nursing act ${id}:`, error);
      throw error;
    }
    
    return true;
  },
};
