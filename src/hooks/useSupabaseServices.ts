
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '@/integrations/supabase/services';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

// Type for nursing acts
type NursingAct = Database["public"]["Tables"]["nursing_acts"]["Row"];
type MajorationAct = Database["public"]["Tables"]["majorations"]["Row"];
type AppSettings = Database["public"]["Tables"]["app_settings"]["Row"];

export function useSupabaseServices() {
  const queryClient = useQueryClient();
  
  // App Settings Queries
  const useAppSettings = () => {
    return useQuery({
      queryKey: ['app-settings'],
      queryFn: supabaseService.getAppSettings,
    });
  };
  
  // Nursing Acts Queries
  const useNursingActs = () => {
    return useQuery({
      queryKey: ['nursing-acts'],
      queryFn: supabaseService.getNursingActs,
    });
  };
  
  const useNursingAct = (id: string) => {
    return useQuery({
      queryKey: ['nursing-act', id],
      queryFn: () => supabaseService.getNursingAct(id),
      enabled: !!id,
    });
  };
  
  const useCreateNursingAct = () => {
    return useMutation({
      mutationFn: (data: Omit<NursingAct, 'id' | 'created_at' | 'updated_at'>) => 
        supabaseService.createNursingAct(data),
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
        supabaseService.updateNursingAct(id, data),
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
      mutationFn: (id: string) => supabaseService.deleteNursingAct(id),
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
  
  // Majorations Queries
  const useMajorations = () => {
    return useQuery({
      queryKey: ['majorations'],
      queryFn: supabaseService.getMajorations,
    });
  };
  
  const useMajoration = (id: string) => {
    return useQuery({
      queryKey: ['majoration', id],
      queryFn: () => supabaseService.getMajoration(id),
      enabled: !!id,
    });
  };
  
  const useCreateMajoration = () => {
    return useMutation({
      mutationFn: (data: Omit<MajorationAct, 'id' | 'created_at' | 'updated_at'>) => 
        supabaseService.createMajoration(data),
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
        supabaseService.updateMajoration(id, data),
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
      mutationFn: (id: string) => supabaseService.deleteMajoration(id),
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
    useAppSettings,
    useNursingActs,
    useNursingAct,
    useCreateNursingAct,
    useUpdateNursingAct,
    useDeleteNursingAct,
    useMajorations,
    useMajoration,
    useCreateMajoration,
    useUpdateMajoration,
    useDeleteMajoration
  };
}
