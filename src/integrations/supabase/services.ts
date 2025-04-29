
import { supabase } from './client';

export interface SupabaseService {
  // Fetch application settings
  getAppSettings: () => Promise<any>;
  
  // Nursing acts management
  getNursingActs: () => Promise<any[]>;
  getNursingAct: (id: string) => Promise<any>;
  createNursingAct: (data: any) => Promise<any>;
  updateNursingAct: (id: string, data: any) => Promise<any>;
  deleteNursingAct: (id: string) => Promise<void>;
  
  // Majorations management
  getMajorations: () => Promise<any[]>;
  getMajoration: (id: string) => Promise<any>;
  createMajoration: (data: any) => Promise<any>;
  updateMajoration: (id: string, data: any) => Promise<any>;
  deleteMajoration: (id: string) => Promise<void>;
}

// Implementation of the SupabaseService
export const supabaseService: SupabaseService = {
  // App settings
  getAppSettings: async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*');
      
    if (error) throw error;
    return data;
  },
  
  // Nursing acts
  getNursingActs: async () => {
    const { data, error } = await supabase
      .from('nursing_acts')
      .select('*')
      .order('code', { ascending: true });
      
    if (error) throw error;
    return data || [];
  },
  
  getNursingAct: async (id: string) => {
    const { data, error } = await supabase
      .from('nursing_acts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  createNursingAct: async (data: any) => {
    const { data: createdAct, error } = await supabase
      .from('nursing_acts')
      .insert(data)
      .select()
      .single();
      
    if (error) throw error;
    return createdAct;
  },
  
  updateNursingAct: async (id: string, data: any) => {
    const { data: updatedAct, error } = await supabase
      .from('nursing_acts')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return updatedAct;
  },
  
  deleteNursingAct: async (id: string) => {
    const { error } = await supabase
      .from('nursing_acts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },
  
  // Majorations
  getMajorations: async () => {
    const { data, error } = await supabase
      .from('majorations')
      .select('*')
      .order('code', { ascending: true });
      
    if (error) throw error;
    return data || [];
  },
  
  getMajoration: async (id: string) => {
    const { data, error } = await supabase
      .from('majorations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  createMajoration: async (data: any) => {
    const { data: createdMajoration, error } = await supabase
      .from('majorations')
      .insert(data)
      .select()
      .single();
      
    if (error) throw error;
    return createdMajoration;
  },
  
  updateMajoration: async (id: string, data: any) => {
    const { data: updatedMajoration, error } = await supabase
      .from('majorations')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return updatedMajoration;
  },
  
  deleteMajoration: async (id: string) => {
    const { error } = await supabase
      .from('majorations')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }
};
