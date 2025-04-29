
import { supabase } from '../client';
import { MajorationAct } from './types';

export const majorationsService = {
  getMajorations: async () => {
    const { data, error } = await supabase
      .from('majorations')
      .select('*')
      .order('code', { ascending: true });
      
    if (error) {
      console.error('Error fetching majorations:', error);
      throw error;
    }
    
    return data;
  },
  
  getMajoration: async (id: string) => {
    const { data, error } = await supabase
      .from('majorations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching majoration ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  createMajoration: async (majoration: Omit<MajorationAct, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('majorations')
      .insert([majoration])
      .select();
      
    if (error) {
      console.error('Error creating majoration:', error);
      throw error;
    }
    
    return data[0];
  },
  
  updateMajoration: async (id: string, majoration: Partial<MajorationAct>) => {
    const { data, error } = await supabase
      .from('majorations')
      .update(majoration)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error(`Error updating majoration ${id}:`, error);
      throw error;
    }
    
    return data[0];
  },
  
  deleteMajoration: async (id: string) => {
    const { error } = await supabase
      .from('majorations')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting majoration ${id}:`, error);
      throw error;
    }
    
    return true;
  },
};
