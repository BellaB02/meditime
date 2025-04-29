import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PatientInfoService, PatientInfo } from './PatientInfoService';
import { VitalSignsService, VitalSign } from './VitalSignsService';
import { PrescriptionsService, Prescription } from './PrescriptionsService';

// Re-export the types for backward compatibility
export type { PatientInfo, VitalSign, Prescription };

// Real implementation using Supabase
export const PatientService = {
  // Patient info methods
  getPatientInfo: async (patientId?: string): Promise<PatientInfo | undefined> => {
    if (!patientId) return undefined;
    
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
        
      if (error) {
        console.error("Error fetching patient info:", error);
        toast.error("Erreur lors du chargement des informations patient");
        return undefined;
      }
      
      // Conversion du format Supabase en PatientInfo
      return {
        id: data.id,
        name: data.last_name,
        firstName: data.first_name,
        address: data.address || '',
        phoneNumber: data.phone || '',
        socialSecurityNumber: data.social_security_number || '',
        dateOfBirth: data.date_of_birth || '',
        email: data.email || '',
        doctor: data.doctor || '',
        medicalNotes: data.medical_notes || '',
        insurance: data.insurance || '',
        status: data.status as "active" | "inactive" | "urgent"
      };
    } catch (err) {
      console.error("Error in getPatientInfo:", err);
      toast.error("Erreur lors du chargement des informations patient");
      return undefined;
    }
  },
  
  getAllPatients: async (): Promise<PatientInfo[]> => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('last_name', { ascending: true });
        
      if (error) {
        console.error("Error fetching all patients:", error);
        toast.error("Erreur lors du chargement de la liste des patients");
        return [];
      }
      
      // Conversion du format Supabase en PatientInfo[]
      return data.map(patient => ({
        id: patient.id,
        name: patient.last_name,
        firstName: patient.first_name,
        address: patient.address || '',
        phoneNumber: patient.phone || '',
        socialSecurityNumber: patient.social_security_number || '',
        dateOfBirth: patient.date_of_birth || '',
        email: patient.email || '',
        doctor: patient.doctor || '',
        medicalNotes: patient.medical_notes || '',
        insurance: patient.insurance || '',
        status: (patient.status as "active" | "inactive" | "urgent") || 'active'
      }));
    } catch (err) {
      console.error("Error in getAllPatients:", err);
      toast.error("Erreur lors du chargement de la liste des patients");
      return [];
    }
  },
  
  // Pour la rétrocompatibilité, ajoutons une version synchrone qui renvoie des données en mémoire
  // Cette fonction sera utilisée par les composants qui n'ont pas encore été mis à jour
  getAllPatientsSync: (): PatientInfo[] => {
    return PatientInfoService.getAllPatients();
  },
  
  getPatientInfoSync: (patientId?: string): PatientInfo | undefined => {
    return PatientInfoService.getPatientInfo(patientId);
  },
  
  addPatient: async (patient: Omit<PatientInfo, 'id'>): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert({
          first_name: patient.firstName,
          last_name: patient.name,
          address: patient.address,
          phone: patient.phoneNumber,
          social_security_number: patient.socialSecurityNumber,
          date_of_birth: patient.dateOfBirth,
          email: patient.email,
          doctor: patient.doctor,
          medical_notes: patient.medicalNotes,
          insurance: patient.insurance,
          status: patient.status || 'active'
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error adding patient:", error);
        toast.error("Erreur lors de l'ajout du patient");
        return "";
      }
      
      toast.success(`Patient ${patient.firstName} ${patient.name} ajouté avec succès`);
      return data.id;
    } catch (err) {
      console.error("Error in addPatient:", err);
      toast.error("Erreur lors de l'ajout du patient");
      return "";
    }
  },
  
  updatePatientStatus: async (patientId: string, status: "active" | "inactive" | "urgent"): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ status })
        .eq('id', patientId);
        
      if (error) {
        console.error("Error updating patient status:", error);
        toast.error("Erreur lors de la mise à jour du statut du patient");
        return false;
      }
      
      toast.success(`Statut du patient mis à jour : ${status}`);
      return true;
    } catch (err) {
      console.error("Error in updatePatientStatus:", err);
      toast.error("Erreur lors de la mise à jour du statut du patient");
      return false;
    }
  },
  
  updatePatient: async (patientId: string, patient: Partial<PatientInfo>): Promise<boolean> => {
    try {
      const updateData: any = {};
      
      if (patient.name) updateData.last_name = patient.name;
      if (patient.firstName) updateData.first_name = patient.firstName;
      if (patient.address) updateData.address = patient.address;
      if (patient.phoneNumber) updateData.phone = patient.phoneNumber;
      if (patient.socialSecurityNumber) updateData.social_security_number = patient.socialSecurityNumber;
      if (patient.dateOfBirth) updateData.date_of_birth = patient.dateOfBirth;
      if (patient.email) updateData.email = patient.email;
      if (patient.doctor) updateData.doctor = patient.doctor;
      if (patient.medicalNotes) updateData.medical_notes = patient.medicalNotes;
      if (patient.insurance) updateData.insurance = patient.insurance;
      if (patient.status) updateData.status = patient.status;
      
      const { error } = await supabase
        .from('patients')
        .update(updateData)
        .eq('id', patientId);
        
      if (error) {
        console.error("Error updating patient:", error);
        toast.error("Erreur lors de la mise à jour du patient");
        return false;
      }
      
      toast.success("Informations patient mises à jour");
      return true;
    } catch (err) {
      console.error("Error in updatePatient:", err);
      toast.error("Erreur lors de la mise à jour du patient");
      return false;
    }
  },
  
  validatePatientInfo: (patientId?: string): PatientInfo | null => {
    // This function will be replaced with an async version in the future
    // For now, we'll keep using the mock service to maintain compatibility
    return PatientInfoService.validatePatientInfo(patientId);
  },
  
  // Vital signs methods - delegate to specialized services for now
  getVitalSigns: VitalSignsService.getVitalSigns,
  addVitalSign: VitalSignsService.addVitalSign,
  
  // Prescriptions methods - delegate to specialized services for now
  getPrescriptions: PrescriptionsService.getPrescriptions,
  addPrescription: PrescriptionsService.addPrescription
};
