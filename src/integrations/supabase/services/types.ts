
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
