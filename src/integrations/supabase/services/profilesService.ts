
import { supabase } from '../client';
import { Profile } from './types';

export const profilesService = {
  // Profiles - Using Edge Functions instead of direct RPC calls
  getProfile: async (userId: string) => {
    const { data, error } = await supabase.functions.invoke('get-profile', {
      body: { user_id: userId }
    });
      
    if (error) {
      console.error(`Error fetching profile for user ${userId}:`, error.message);
      throw error;
    }
    
    return data as Profile;
  },
  
  updateProfile: async (userId: string, profile: { first_name?: string, last_name?: string }) => {
    const { data, error } = await supabase.functions.invoke('update-profile', {
      body: { 
        user_id: userId,
        profile_data: profile
      }
    });
      
    if (error) {
      console.error(`Error updating profile for user ${userId}:`, error.message);
      throw error;
    }
    
    return data as Profile;
  }
};
