
import { supabase } from '../client';
import { AppSettings } from './types';

export const appSettingsService = {
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
};
