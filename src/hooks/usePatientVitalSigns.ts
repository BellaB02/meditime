
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export function usePatientVitalSigns(patientId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);

  useEffect(() => {
    const fetchVitalSigns = async () => {
      if (!patientId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('vital_signs')
          .select('*')
          .eq('patient_id', patientId)
          .order('recorded_at', { ascending: false });
          
        if (error) throw error;
        
        setVitalSigns(data || []);
      } catch (error: any) {
        console.error("Error fetching vital signs:", error);
        setError(error);
        toast.error("Erreur lors du chargement des signes vitaux");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVitalSigns();
  }, [patientId]);

  const addVitalSign = async (vitalSign: Omit<VitalSign, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('vital_signs')
        .insert(vitalSign)
        .select()
        .single();
        
      if (error) throw error;
      
      setVitalSigns(prev => [data, ...prev]);
      toast.success("Signes vitaux ajoutés avec succès");
      return data;
    } catch (error: any) {
      console.error("Error adding vital sign:", error);
      toast.error("Erreur lors de l'ajout des signes vitaux");
      throw error;
    }
  };

  return { vitalSigns, isLoading, error, addVitalSign };
}
