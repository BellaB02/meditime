
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nursingActsService } from '@/integrations/supabase/services';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

// Type for nursing acts
type NursingAct = Database["public"]["Tables"]["nursing_acts"]["Row"];

export function useNursingActsService() {
  const queryClient = useQueryClient();
  
  // Nursing Acts Queries
  const useNursingActs = () => {
    return useQuery({
      queryKey: ['nursing-acts'],
      queryFn: nursingActsService.getNursingActs,
    });
  };
  
  const useNursingAct = (id: string) => {
    return useQuery({
      queryKey: ['nursing-act', id],
      queryFn: () => nursingActsService.getNursingAct(id),
      enabled: !!id,
    });
  };
  
  const useCreateNursingAct = () => {
    return useMutation({
      mutationFn: (data: Omit<NursingAct, 'id' | 'created_at' | 'updated_at'>) => 
        nursingActsService.createNursingAct(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['nursing-acts'] });
        toast.success("Acte infirmier créé avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la création de l'acte infirmier");
        console.error("Error creating nursing act:", error);
      }
    });
  };
  
  const useUpdateNursingAct = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string, data: Partial<NursingAct> }) => 
        nursingActsService.updateNursingAct(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['nursing-acts'] });
        queryClient.invalidateQueries({ queryKey: ['nursing-act', variables.id] });
        toast.success("Acte infirmier mis à jour avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour de l'acte infirmier");
        console.error("Error updating nursing act:", error);
      }
    });
  };
  
  const useDeleteNursingAct = () => {
    return useMutation({
      mutationFn: (id: string) => nursingActsService.deleteNursingAct(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['nursing-acts'] });
        toast.success("Acte infirmier supprimé avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la suppression de l'acte infirmier");
        console.error("Error deleting nursing act:", error);
      }
    });
  };

  return {
    useNursingActs,
    useNursingAct,
    useCreateNursingAct,
    useUpdateNursingAct,
    useDeleteNursingAct
  };
}
