import { supabase } from '../client';
import { Patient, VitalSign, CareDocument } from './types';

export const patientsService = {
  // Récupérer tous les patients
  getPatients: async (): Promise<Patient[]> => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('last_name', { ascending: true });
      
    if (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
    
    return data as Patient[];
  },
  
  // Récupérer un patient spécifique
  getPatient: async (patientId: string): Promise<Patient> => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();
      
    if (error) {
      console.error(`Error fetching patient ${patientId}:`, error);
      throw error;
    }
    
    return data as Patient;
  },
  
  // Créer un nouveau patient
  createPatient: async (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> => {
    // Vérifions que les champs requis sont présents
    if (!patient.first_name || !patient.last_name) {
      throw new Error('Missing required patient fields: first_name or last_name');
    }
    
    const { data, error } = await supabase
      .from('patients')
      .insert({
        first_name: patient.first_name,
        last_name: patient.last_name,
        date_of_birth: patient.date_of_birth,
        address: patient.address,
        city: patient.city,
        postal_code: patient.postal_code,
        phone: patient.phone,
        email: patient.email,
        doctor: patient.doctor,
        insurance: patient.insurance,
        medical_notes: patient.medical_notes,
        social_security_number: patient.social_security_number,
        status: patient.status || 'active',
        user_id: patient.user_id
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
    
    return data as Patient;
  },
  
  // Mettre à jour un patient existant
  updatePatient: async (patientId: string, patient: Partial<Patient>): Promise<Patient> => {
    const { data, error } = await supabase
      .from('patients')
      .update(patient)
      .eq('id', patientId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating patient ${patientId}:`, error);
      throw error;
    }
    
    return data as Patient;
  },
  
  // Récupérer les signes vitaux d'un patient
  getPatientVitalSigns: async (patientId: string): Promise<VitalSign[]> => {
    const { data, error } = await supabase
      .from('vital_signs')
      .select('*')
      .eq('patient_id', patientId)
      .order('recorded_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching vital signs for patient ${patientId}:`, error);
      throw error;
    }
    
    return data as VitalSign[];
  },
  
  // Ajouter des signes vitaux pour un patient
  addVitalSign: async (vitalSign: Omit<VitalSign, 'id' | 'created_at'> & { patient_id: string }): Promise<VitalSign> => {
    const { data, error } = await supabase
      .from('vital_signs')
      .insert({
        patient_id: vitalSign.patient_id,
        temperature: vitalSign.temperature,
        heart_rate: vitalSign.heart_rate,
        blood_pressure: vitalSign.blood_pressure,
        blood_sugar: vitalSign.blood_sugar,
        oxygen_saturation: vitalSign.oxygen_saturation,
        pain_level: vitalSign.pain_level,
        notes: vitalSign.notes,
        recorded_at: vitalSign.recorded_at || new Date().toISOString(),
        recorded_by: vitalSign.recorded_by
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding vital sign:', error);
      throw error;
    }
    
    return data as VitalSign;
  },
  
  // Récupérer les documents d'un patient
  getPatientDocuments: async (patientId: string): Promise<CareDocument[]> => {
    const { data, error } = await supabase
      .from('care_documents')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching documents for patient ${patientId}:`, error);
      throw error;
    }
    
    return data as CareDocument[];
  },
  
  // Uploader un document pour un patient
  uploadPatientDocument: async (
    patientId: string,
    file: File,
    metadata: {
      document_type: string;
      title: string;
      description?: string;
      appointment_id?: string;
      tags?: string[];
    }
  ): Promise<CareDocument> => {
    // 1. Upload the file to storage
    const fileName = `${patientId}/${Date.now()}_${file.name}`;
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('patient_documents')
      .upload(fileName, file);
      
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }
    
    // 2. Create the document record
    const documentData = {
      patient_id: patientId,
      appointment_id: metadata.appointment_id,
      document_type: metadata.document_type,
      title: metadata.title,
      description: metadata.description || null,
      storage_path: fileData.path,
      tags: metadata.tags || [],
      uploaded_by: (await supabase.auth.getUser()).data.user?.id
    };
    
    const { data: docData, error: docError } = await supabase
      .from('care_documents')
      .insert(documentData)
      .select()
      .single();
      
    if (docError) {
      console.error('Error creating document record:', docError);
      throw docError;
    }
    
    return docData as CareDocument;
  }
};
