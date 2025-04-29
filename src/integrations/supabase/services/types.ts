
import { Database } from '../types';
import { Json } from '../types';

// Types communs pour les services
export type NursingAct = Database["public"]["Tables"]["nursing_acts"]["Row"];
export type MajorationAct = Database["public"]["Tables"]["majorations"]["Row"];
export type AppSettings = Database["public"]["Tables"]["app_settings"]["Row"];

// Interface pour le profil utilisateur
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  updated_at: string | null;
}

// Types pour les patients et les données médicales
export interface Patient {
  id: string;
  user_id?: string | null;
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  phone?: string | null;
  email?: string | null;
  doctor?: string | null;
  insurance?: string | null;
  medical_notes?: string | null;
  status?: string | null;
  social_security_number?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PatientMessage {
  id: string;
  patient_id?: string | null;
  sender_id?: string | null;
  is_from_patient?: boolean | null;
  content: string;
  read_at?: string | null;
  created_at?: string | null;
}

export interface VitalSign {
  id: string;
  patient_id?: string | null;
  recorded_by?: string | null;
  temperature?: number | null;
  heart_rate?: number | null;
  blood_pressure?: string | null;
  blood_sugar?: number | null;
  oxygen_saturation?: number | null;
  pain_level?: number | null;
  notes?: string | null;
  recorded_at?: string | null;
  created_at?: string | null;
}

export interface CareDocument {
  id: string;
  patient_id?: string | null;
  appointment_id?: string | null;
  document_type: string;
  title: string;
  description?: string | null;
  file_path?: string | null;
  storage_path?: string | null;
  is_signed?: boolean | null;
  tags?: string[] | null;
  uploaded_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Appointment {
  id: string;
  patient_id?: string | null;
  caregiver_id?: string | null;
  date: string;
  time: string;
  duration?: number | null;
  care_type: string;
  care_protocol_id?: string | null;
  location?: string | null;
  notes?: string | null;
  status?: string | null;
  is_recurring?: boolean | null;
  recurrence_pattern?: Json | null;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Round {
  id: string;
  name: string;
  caregiver_id?: string | null;
  date: string;
  status?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface RoundStop {
  id: string;
  round_id?: string | null;
  appointment_id?: string | null;
  stop_order: number;
  estimated_time?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CareProtocol {
  id: string;
  name: string;
  description?: string | null;
  steps?: Json | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CareChecklist {
  id: string;
  name: string;
  created_by?: string | null;
  is_template?: boolean | null;
  items?: Json | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface InventoryItem {
  id: string;
  name: string;
  category?: string | null;
  unit?: string | null;
  current_quantity?: number | null;
  min_quantity?: number | null;
  expiry_date?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface InventoryTransaction {
  id: string;
  item_id?: string | null;
  transaction_type: string;
  quantity: number;
  reason?: string | null;
  recorded_by?: string | null;
  patient_id?: string | null;
  appointment_id?: string | null;
  batch_number?: string | null;
  expiry_date?: string | null;
  created_at?: string | null;
}
