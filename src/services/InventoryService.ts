
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface InventoryItem {
  id: string;
  name: string;
  category?: string;
  current_quantity: number;
  min_quantity: number;
  unit?: string;
  expiry_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  quantity: number;
  transaction_type: "stock_in" | "stock_out" | "adjustment" | "expired";
  reason?: string;
  batch_number?: string;
  expiry_date?: string;
  patient_id?: string;
  appointment_id?: string;
  recorded_by?: string;
  created_at?: string;
}

export const InventoryService = {
  /**
   * Récupère tous les articles de l'inventaire
   */
  getAllItems: async (): Promise<InventoryItem[]> => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Erreur lors de la récupération des articles:", err);
      toast.error("Erreur lors du chargement de l'inventaire");
      return [];
    }
  },
  
  /**
   * Récupère un article spécifique
   */
  getItem: async (itemId: string): Promise<InventoryItem | null> => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('id', itemId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Erreur lors de la récupération de l'article ${itemId}:`, err);
      return null;
    }
  },
  
  /**
   * Crée un nouvel article
   */
  createItem: async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem | null> => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          name: item.name,
          category: item.category,
          current_quantity: item.current_quantity || 0,
          min_quantity: item.min_quantity || 0,
          unit: item.unit,
          expiry_date: item.expiry_date,
          notes: item.notes
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success(`Article "${item.name}" créé avec succès`);
      return data;
    } catch (err) {
      console.error("Erreur lors de la création de l'article:", err);
      toast.error("Erreur lors de la création de l'article");
      return null;
    }
  },
  
  /**
   * Met à jour un article
   */
  updateItem: async (itemId: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success(`Article mis à jour avec succès`);
      return data;
    } catch (err) {
      console.error(`Erreur lors de la mise à jour de l'article ${itemId}:`, err);
      toast.error("Erreur lors de la mise à jour de l'article");
      return null;
    }
  },
  
  /**
   * Supprime un article
   */
  deleteItem: async (itemId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId);
        
      if (error) throw error;
      
      toast.success(`Article supprimé avec succès`);
      return true;
    } catch (err) {
      console.error(`Erreur lors de la suppression de l'article ${itemId}:`, err);
      toast.error("Erreur lors de la suppression de l'article");
      return false;
    }
  },
  
  /**
   * Enregistre une transaction d'inventaire
   */
  recordTransaction: async (transaction: Omit<InventoryTransaction, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      // Récupérer l'article actuel pour mettre à jour les quantités
      const { data: item, error: itemError } = await supabase
        .from('inventory_items')
        .select('current_quantity')
        .eq('id', transaction.item_id)
        .single();
        
      if (itemError) throw itemError;
      
      // Calculer la nouvelle quantité
      let newQuantity = item.current_quantity;
      if (transaction.transaction_type === 'stock_in' || transaction.transaction_type === 'adjustment') {
        newQuantity += transaction.quantity;
      } else if (transaction.transaction_type === 'stock_out' || transaction.transaction_type === 'expired') {
        newQuantity -= transaction.quantity;
      }
      
      // Mettre à jour l'article
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ current_quantity: newQuantity })
        .eq('id', transaction.item_id);
        
      if (updateError) throw updateError;
      
      // Enregistrer la transaction
      const { error: transactionError } = await supabase
        .from('inventory_transactions')
        .insert({
          item_id: transaction.item_id,
          quantity: transaction.quantity,
          transaction_type: transaction.transaction_type,
          reason: transaction.reason,
          batch_number: transaction.batch_number,
          expiry_date: transaction.expiry_date,
          patient_id: transaction.patient_id,
          appointment_id: transaction.appointment_id,
          recorded_by: transaction.recorded_by
        });
        
      if (transactionError) throw transactionError;
      
      toast.success("Transaction enregistrée avec succès");
      return true;
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la transaction:", err);
      toast.error("Erreur lors de l'enregistrement de la transaction");
      return false;
    }
  },
  
  /**
   * Récupère l'historique des transactions pour un article
   */
  getItemTransactions: async (itemId: string): Promise<InventoryTransaction[]> => {
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select('*')
        .eq('item_id', itemId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Erreur lors de la récupération des transactions pour l'article ${itemId}:`, err);
      toast.error("Erreur lors du chargement de l'historique des transactions");
      return [];
    }
  },
  
  /**
   * Vérifie les articles dont le stock est bas
   */
  getLowStockItems: async (): Promise<InventoryItem[]> => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .lt('current_quantity', supabase.raw('min_quantity'));
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Erreur lors de la récupération des articles à faible stock:", err);
      return [];
    }
  },
  
  /**
   * Vérifie les articles bientôt périmés
   */
  getExpiringItems: async (daysThreshold: number = 30): Promise<InventoryItem[]> => {
    try {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
      
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .lt('expiry_date', thresholdDate.toISOString())
        .gt('expiry_date', new Date().toISOString())
        .gt('current_quantity', 0);
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Erreur lors de la récupération des articles bientôt périmés:", err);
      return [];
    }
  }
};
