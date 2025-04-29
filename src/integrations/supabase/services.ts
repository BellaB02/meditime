
import { supabase } from './client';
import { Database } from './types';

// Type pour les actes infirmiers
type NursingAct = Database["public"]["Tables"]["nursing_acts"]["Row"];
type MajorationAct = Database["public"]["Tables"]["majorations"]["Row"];
type AppSettings = Database["public"]["Tables"]["app_settings"]["Row"];

// Interface pour le profil utilisateur (car non inclus dans les types générés)
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  updated_at: string | null;
}

// Service Supabase pour interagir avec l'API
export const supabaseService = {
  
  // App Settings
  getAppSettings: async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*');
      
    if (error) {
      console.error('Error fetching app settings:', error);
      throw error;
    }
    
    return data;
  },
  
  updateAppSetting: async (key: string, value: string) => {
    const { data, error } = await supabase
      .from('app_settings')
      .update({ setting_value: value })
      .eq('setting_key', key)
      .select();
      
    if (error) {
      console.error(`Error updating app setting ${key}:`, error);
      throw error;
    }
    
    return data[0];
  },
  
  // Nursing Acts
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
  
  // Majorations
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
  
  // Profiles - Utilisation des fonctions RPC au lieu d'accès direct à la table
  getProfile: async (userId: string) => {
    const { data, error } = await supabase.rpc('get_profile', {
      user_id: userId
    });
      
    if (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      throw error;
    }
    
    return data as Profile;
  },
  
  updateProfile: async (userId: string, profile: { first_name?: string, last_name?: string }) => {
    const { error } = await supabase.rpc('update_user_profile', {
      user_id: userId,
      profile_data: profile
    });
      
    if (error) {
      console.error(`Error updating profile for user ${userId}:`, error);
      throw error;
    }
    
    // Récupérer le profil mis à jour
    return await supabaseService.getProfile(userId);
  }
};
