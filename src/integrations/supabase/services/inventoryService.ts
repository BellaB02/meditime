
import { supabase } from '../client';

export const inventoryService = {
  // Récupérer tous les articles d'inventaire
  getInventoryItems: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
    
    return data;
  },
  
  // Récupérer un article d'inventaire spécifique
  getInventoryItem: async (itemId: string): Promise<any> => {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', itemId)
      .single();
      
    if (error) {
      console.error(`Error fetching inventory item ${itemId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Créer un nouvel article d'inventaire
  createInventoryItem: async (item: any): Promise<any> => {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert(item)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
    
    return data;
  },
  
  // Mettre à jour un article d'inventaire existant
  updateInventoryItem: async (itemId: string, item: any): Promise<any> => {
    const { data, error } = await supabase
      .from('inventory_items')
      .update(item)
      .eq('id', itemId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating inventory item ${itemId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Supprimer un article d'inventaire
  deleteInventoryItem: async (itemId: string): Promise<void> => {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', itemId);
      
    if (error) {
      console.error(`Error deleting inventory item ${itemId}:`, error);
      throw error;
    }
  },
  
  // Enregistrer une transaction d'inventaire
  recordInventoryTransaction: async (transaction: any): Promise<any> => {
    const { data, error } = await supabase
      .from('inventory_transactions')
      .insert(transaction)
      .select()
      .single();
      
    if (error) {
      console.error('Error recording inventory transaction:', error);
      throw error;
    }
    
    return data;
  },
  
  // Récupérer l'historique des transactions pour un article
  getItemTransactions: async (itemId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('inventory_transactions')
      .select('*')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching transactions for item ${itemId}:`, error);
      throw error;
    }
    
    return data;
  }
};
