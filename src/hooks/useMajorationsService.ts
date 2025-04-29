
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { majorationsService } from '@/integrations/supabase/services';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

// Type for majorations
type MajorationAct = Database["public"]["Tables"]["majorations"]["Row"];

export function useMajorationsService() {
  const queryClient = useQueryClient();
  
  // Majorations Queries
  const useMajorations = () => {
    return useQuery({
      queryKey: ['majorations'],
      queryFn: majorationsService.getMajorations,
    });
  };
  
  const useMajoration = (id: string) => {
    return useQuery({
      queryKey: ['majoration', id],
      queryFn: () => majorationsService.getMajoration(id),
      enabled: !!id,
    });
  };
  
  const useCreateMajoration = () => {
    return useMutation({
      mutationFn: (data: Omit<MajorationAct, 'id' | 'created_at' | 'updated_at'>) => 
        majorationsService.createMajoration(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['majorations'] });
        toast.success("Majoration créée avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la création de la majoration");
        console.error("Error creating majoration:", error);
      }
    });
  };
  
  const useUpdateMajoration = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string, data: Partial<MajorationAct> }) => 
        majorationsService.updateMajoration(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['majorations'] });
        queryClient.invalidateQueries({ queryKey: ['majoration', variables.id] });
        toast.success("Majoration mise à jour avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour de la majoration");
        console.error("Error updating majoration:", error);
      }
    });
  };
  
  const useDeleteMajoration = () => {
    return useMutation({
      mutationFn: (id: string) => majorationsService.deleteMajoration(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['majorations'] });
        toast.success("Majoration supprimée avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la suppression de la majoration");
        console.error("Error deleting majoration:", error);
      }
    });
  };

  return {
    useMajorations,
    useMajoration,
    useCreateMajoration,
    useUpdateMajoration,
    useDeleteMajoration
  };
}
