
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patientsService } from '@/integrations/supabase/services/patientsService';
import { toast } from 'sonner';
import { Patient, VitalSign } from '@/integrations/supabase/services/types';

export function usePatientsService() {
  const queryClient = useQueryClient();
  
  // Patients Queries
  const usePatients = () => {
    return useQuery({
      queryKey: ['patients'],
      queryFn: patientsService.getPatients,
    });
  };
  
  const usePatient = (patientId: string) => {
    return useQuery({
      queryKey: ['patient', patientId],
      queryFn: () => patientsService.getPatient(patientId),
      enabled: !!patientId,
    });
  };
  
  const useCreatePatient = () => {
    return useMutation({
      mutationFn: (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => 
        patientsService.createPatient(patient),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['patients'] });
        toast.success("Patient créé avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la création du patient");
        console.error("Error creating patient:", error);
      }
    });
  };
  
  const useUpdatePatient = () => {
    return useMutation({
      mutationFn: ({ patientId, data }: { patientId: string, data: Partial<Patient> }) => 
        patientsService.updatePatient(patientId, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['patients'] });
        queryClient.invalidateQueries({ queryKey: ['patient', variables.patientId] });
        toast.success("Patient mis à jour avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour du patient");
        console.error("Error updating patient:", error);
      }
    });
  };
  
  // Vital Signs Queries
  const usePatientVitalSigns = (patientId: string) => {
    return useQuery({
      queryKey: ['patient', patientId, 'vital-signs'],
      queryFn: () => patientsService.getPatientVitalSigns(patientId),
      enabled: !!patientId,
    });
  };
  
  const useAddVitalSign = () => {
    return useMutation({
      mutationFn: (vitalSign: Omit<VitalSign, 'id' | 'created_at'> & { patient_id: string }) => 
        patientsService.addVitalSign(vitalSign),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ 
          queryKey: ['patient', variables.patient_id, 'vital-signs'] 
        });
        toast.success("Signes vitaux enregistrés avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de l'enregistrement des signes vitaux");
        console.error("Error adding vital sign:", error);
      }
    });
  };
  
  // Patient Documents Queries
  const usePatientDocuments = (patientId: string) => {
    return useQuery({
      queryKey: ['patient', patientId, 'documents'],
      queryFn: () => patientsService.getPatientDocuments(patientId),
      enabled: !!patientId,
    });
  };
  
  const useUploadPatientDocument = () => {
    return useMutation({
      mutationFn: ({ 
        patientId, 
        file, 
        metadata 
      }: { 
        patientId: string, 
        file: File, 
        metadata: {
          document_type: string;
          title: string;
          description?: string;
          appointment_id?: string;
          tags?: string[];
        }
      }) => patientsService.uploadPatientDocument(patientId, file, metadata),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ 
          queryKey: ['patient', variables.patientId, 'documents']
        });
        toast.success("Document ajouté avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de l'ajout du document");
        console.error("Error uploading document:", error);
      }
    });
  };

  return {
    usePatients,
    usePatient,
    useCreatePatient,
    useUpdatePatient,
    usePatientVitalSigns,
    useAddVitalSign,
    usePatientDocuments,
    useUploadPatientDocument
  };
}
