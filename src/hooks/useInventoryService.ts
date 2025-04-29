
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '@/integrations/supabase/services/inventoryService';
import { toast } from 'sonner';

export function useInventoryService() {
  const queryClient = useQueryClient();
  
  // Inventory Items Queries
  const useInventoryItems = () => {
    return useQuery({
      queryKey: ['inventory-items'],
      queryFn: inventoryService.getInventoryItems,
    });
  };
  
  const useInventoryItem = (itemId: string) => {
    return useQuery({
      queryKey: ['inventory-item', itemId],
      queryFn: () => inventoryService.getInventoryItem(itemId),
      enabled: !!itemId,
    });
  };
  
  const useCreateInventoryItem = () => {
    return useMutation({
      mutationFn: (item: any) => 
        inventoryService.createInventoryItem(item),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
        toast.success("Article d'inventaire créé avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la création de l'article d'inventaire");
        console.error("Error creating inventory item:", error);
      }
    });
  };
  
  const useUpdateInventoryItem = () => {
    return useMutation({
      mutationFn: ({ itemId, data }: { itemId: string, data: any }) => 
        inventoryService.updateInventoryItem(itemId, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-item', variables.itemId] });
        toast.success("Article d'inventaire mis à jour avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour de l'article d'inventaire");
        console.error("Error updating inventory item:", error);
      }
    });
  };
  
  const useDeleteInventoryItem = () => {
    return useMutation({
      mutationFn: (itemId: string) => 
        inventoryService.deleteInventoryItem(itemId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
        toast.success("Article d'inventaire supprimé avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la suppression de l'article d'inventaire");
        console.error("Error deleting inventory item:", error);
      }
    });
  };
  
  // Inventory Transactions Queries
  const useRecordInventoryTransaction = () => {
    return useMutation({
      mutationFn: (transaction: any) => 
        inventoryService.recordInventoryTransaction(transaction),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-item', variables.item_id] });
        queryClient.invalidateQueries({ queryKey: ['inventory-transactions', variables.item_id] });
        
        const transactionTypeMessage = 
          variables.transaction_type === 'in' ? "entrée" :
          variables.transaction_type === 'out' ? "sortie" : "ajustement";
        
        toast.success(`Transaction d'${transactionTypeMessage} enregistrée avec succès`);
      },
      onError: (error: any) => {
        toast.error("Erreur lors de l'enregistrement de la transaction");
        console.error("Error recording inventory transaction:", error);
      }
    });
  };
  
  const useItemTransactions = (itemId: string) => {
    return useQuery({
      queryKey: ['inventory-transactions', itemId],
      queryFn: () => inventoryService.getItemTransactions(itemId),
      enabled: !!itemId,
    });
  };

  return {
    useInventoryItems,
    useInventoryItem,
    useCreateInventoryItem,
    useUpdateInventoryItem,
    useDeleteInventoryItem,
    useRecordInventoryTransaction,
    useItemTransactions
  };
}
