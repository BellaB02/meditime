
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialSecurityNumber?: string;
  doctor?: string;
  medicalNotes?: string;
  insurance?: string;
  status: "active" | "inactive" | "urgent";
}

export function usePatientDetails(patientId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!patientId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setPatientDetails({
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            dateOfBirth: data.date_of_birth,
            address: data.address,
            phone: data.phone,
            email: data.email,
            socialSecurityNumber: data.social_security_number,
            doctor: data.doctor,
            medicalNotes: data.medical_notes,
            insurance: data.insurance,
            status: (data.status as "active" | "inactive" | "urgent") || "active"
          });
        }
      } catch (error: any) {
        console.error("Error fetching patient details:", error);
        setError(error);
        toast.error("Erreur lors du chargement des informations du patient");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  const updatePatient = async (updates: Partial<PatientDetails>) => {
    if (!patientId) return false;
    
    try {
      // Convert to Supabase schema
      const supabaseUpdates = {
        first_name: updates.firstName,
        last_name: updates.lastName,
        date_of_birth: updates.dateOfBirth,
        address: updates.address,
        phone: updates.phone,
        email: updates.email,
        social_security_number: updates.socialSecurityNumber,
        doctor: updates.doctor,
        medical_notes: updates.medicalNotes,
        insurance: updates.insurance,
        status: updates.status,
      };
      
      // Remove undefined values
      Object.keys(supabaseUpdates).forEach(key => 
        supabaseUpdates[key as keyof typeof supabaseUpdates] === undefined && delete supabaseUpdates[key as keyof typeof supabaseUpdates]
      );
      
      const { error } = await supabase
        .from('patients')
        .update(supabaseUpdates)
        .eq('id', patientId);
        
      if (error) throw error;
      
      // Update local state
      setPatientDetails(prev => prev ? { ...prev, ...updates } : null);
      toast.success("Informations patient mises à jour");
      return true;
    } catch (error: any) {
      console.error("Error updating patient:", error);
      toast.error("Erreur lors de la mise à jour du patient");
      return false;
    }
  };

  return { patientDetails, isLoading, error, updatePatient };
}
