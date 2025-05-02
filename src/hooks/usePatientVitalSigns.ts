
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface VitalSign {
  id: string;
  patient_id: string;
  temperature?: number;
  heart_rate?: number;
  blood_pressure?: string;
  blood_sugar?: number;
  oxygen_saturation?: number;
  pain_level?: number;
  notes?: string;
  recorded_at: string;
  recorded_by?: string;
}

// Fonction pour récupérer les signes vitaux depuis Supabase
const fetchVitalSigns = async (patientId: string): Promise<VitalSign[]> => {
  if (!patientId) return [];
  
  const { data, error } = await supabase
    .from('vital_signs')
    .select('*')
    .eq('patient_id', patientId)
    .order('recorded_at', { ascending: false });
    
  if (error) throw error;
  
  return data || [];
};

// Fonction pour ajouter un signe vital dans Supabase
const addVitalSignToDb = async (vitalSign: Omit<VitalSign, 'id'>): Promise<VitalSign> => {
  const { data, error } = await supabase
    .from('vital_signs')
    .insert(vitalSign)
    .select()
    .single();
    
  if (error) throw error;
  
  return data;
};

// Fonction pour supprimer un signe vital
const deleteVitalSignFromDb = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('vital_signs')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Fonction pour mettre à jour un signe vital
const updateVitalSignInDb = async (id: string, updates: Partial<VitalSign>): Promise<VitalSign> => {
  const { data, error } = await supabase
    .from('vital_signs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  return data;
};

export function usePatientVitalSigns(patientId: string) {
  const queryClient = useQueryClient();
  
  // Récupération des signes vitaux avec React Query
  const { 
    data: vitalSigns = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['vitalSigns', patientId],
    queryFn: () => fetchVitalSigns(patientId),
    enabled: !!patientId,
    staleTime: 60000, // 1 minute
    retry: 1
  });

  // Mutation pour ajouter un signe vital
  const addMutation = useMutation({
    mutationFn: addVitalSignToDb,
    onSuccess: (data) => {
      // Mettre à jour le cache React Query
      queryClient.setQueryData(['vitalSigns', patientId], (old: VitalSign[] = []) => [data, ...old]);
      toast.success("Signes vitaux ajoutés avec succès");
    },
    onError: (error: any) => {
      console.error("Error adding vital sign:", error);
      toast.error("Erreur lors de l'ajout des signes vitaux");
    }
  });
  
  // Mutation pour supprimer un signe vital
  const deleteMutation = useMutation({
    mutationFn: deleteVitalSignFromDb,
    onSuccess: (_, id) => {
      // Mettre à jour le cache React Query
      queryClient.setQueryData(['vitalSigns', patientId], (old: VitalSign[] = []) => 
        old.filter(item => item.id !== id)
      );
      toast.success("Signe vital supprimé avec succès");
    },
    onError: (error: any) => {
      console.error("Error deleting vital sign:", error);
      toast.error("Erreur lors de la suppression du signe vital");
    }
  });
  
  // Mutation pour mettre à jour un signe vital
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<VitalSign> }) => 
      updateVitalSignInDb(id, updates),
    onSuccess: (data) => {
      // Mettre à jour le cache React Query
      queryClient.setQueryData(['vitalSigns', patientId], (old: VitalSign[] = []) => 
        old.map(item => item.id === data.id ? data : item)
      );
      toast.success("Signe vital mis à jour avec succès");
    },
    onError: (error: any) => {
      console.error("Error updating vital sign:", error);
      toast.error("Erreur lors de la mise à jour du signe vital");
    }
  });

  // Fonction simplifiée pour ajouter un signe vital
  const addVitalSign = async (vitalSign: Omit<VitalSign, 'id'>) => {
    try {
      const result = await addMutation.mutateAsync(vitalSign);
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  // Fonction pour supprimer un signe vital
  const deleteVitalSign = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Fonction pour mettre à jour un signe vital
  const updateVitalSign = async (id: string, updates: Partial<VitalSign>) => {
    try {
      const result = await updateMutation.mutateAsync({ id, updates });
      return result;
    } catch (error) {
      return null;
    }
  };

  return { 
    vitalSigns, 
    isLoading, 
    error, 
    addVitalSign,
    deleteVitalSign,
    updateVitalSign,
    refetch
  };
}
