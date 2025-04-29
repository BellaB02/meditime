
import { Database } from '../types';

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
export interface Patient extends Database["public"]["Tables"]["patients"]["Row"] {
  // Extensions du type de base si nécessaire
}

export interface PatientMessage extends Database["public"]["Tables"]["patient_messages"]["Row"] {
  // Extensions du type de base si nécessaire
}

export interface VitalSign extends Database["public"]["Tables"]["vital_signs"]["Row"] {
  // Extensions du type de base si nécessaire
}

export interface CareDocument extends Database["public"]["Tables"]["care_documents"]["Row"] {
  // Extensions du type de base si nécessaire
}

export interface Appointment extends Database["public"]["Tables"]["appointments"]["Row"] {
  // Extensions du type de base si nécessaire
}

export interface Round extends Database["public"]["Tables"]["rounds"]["Row"] {
  // Extensions du type de base si nécessaire
}

export interface RoundStop extends Database["public"]["Tables"]["round_stops"]["Row"] {
  // Extensions du type de base si nécessaire
}

export interface CareProtocol extends Database["public"]["Tables"]["care_protocols"]["Row"] {
  // Extensions du type de base si nécessaire
}
