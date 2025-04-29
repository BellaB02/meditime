
import { supabase } from '../client';
import { CareProtocol } from './types';

export const careProtocolsService = {
  // Récupérer tous les protocoles de soins
  getCareProtocols: async (): Promise<CareProtocol[]> => {
    const { data, error } = await supabase
      .from('care_protocols')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching care protocols:', error);
      throw error;
    }
    
    return data as CareProtocol[];
  },
  
  // Récupérer un protocole spécifique
  getCareProtocol: async (protocolId: string): Promise<CareProtocol> => {
    const { data, error } = await supabase
      .from('care_protocols')
      .select('*')
      .eq('id', protocolId)
      .single();
      
    if (error) {
      console.error(`Error fetching care protocol ${protocolId}:`, error);
      throw error;
    }
    
    return data as CareProtocol;
  },
  
  // Créer un nouveau protocole de soins
  createCareProtocol: async (protocol: Omit<CareProtocol, 'id' | 'created_at' | 'updated_at'>): Promise<CareProtocol> => {
    const { data, error } = await supabase
      .from('care_protocols')
      .insert(protocol)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating care protocol:', error);
      throw error;
    }
    
    return data as CareProtocol;
  },
  
  // Mettre à jour un protocole de soins existant
  updateCareProtocol: async (protocolId: string, protocol: Partial<CareProtocol>): Promise<CareProtocol> => {
    const { data, error } = await supabase
      .from('care_protocols')
      .update(protocol)
      .eq('id', protocolId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating care protocol ${protocolId}:`, error);
      throw error;
    }
    
    return data as CareProtocol;
  },
  
  // Supprimer un protocole de soins
  deleteCareProtocol: async (protocolId: string): Promise<void> => {
    const { error } = await supabase
      .from('care_protocols')
      .delete()
      .eq('id', protocolId);
      
    if (error) {
      console.error(`Error deleting care protocol ${protocolId}:`, error);
      throw error;
    }
  },
  
  // Fonctions pour les checklists
  getChecklists: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('care_checklists')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching checklists:', error);
      throw error;
    }
    
    return data;
  },
  
  getChecklist: async (checklistId: string): Promise<any> => {
    const { data, error } = await supabase
      .from('care_checklists')
      .select('*')
      .eq('id', checklistId)
      .single();
      
    if (error) {
      console.error(`Error fetching checklist ${checklistId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  createChecklist: async (checklist: any): Promise<any> => {
    const { data, error } = await supabase
      .from('care_checklists')
      .insert(checklist)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating checklist:', error);
      throw error;
    }
    
    return data;
  }
};
