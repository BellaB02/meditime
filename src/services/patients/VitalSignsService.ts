
import { toast } from "sonner";
import { VitalSign } from "./types";
import { PatientStorageService } from "./PatientStorageService";

/**
 * Service for managing vital signs
 */
export const VitalSignsService = {
  /**
   * Récupère les signes vitaux d'un patient
   */
  getVitalSigns: (patientId: string): VitalSign[] => {
    try {
      const mockVitalSigns = PatientStorageService.getMockVitalSigns();
      return mockVitalSigns[patientId] || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des signes vitaux:", error);
      toast.error("Erreur lors de la récupération des signes vitaux");
      return [];
    }
  },
  
  /**
   * Ajoute un signe vital pour un patient
   */
  addVitalSign: (patientId: string, vitalSign: Omit<VitalSign, 'id'>): string => {
    try {
      const id = PatientStorageService.storeVitalSign(patientId, vitalSign);
      toast.success("Signes vitaux enregistrés avec succès");
      return id;
    } catch (error) {
      console.error("Erreur lors de l'ajout des signes vitaux:", error);
      toast.error("Erreur lors de l'ajout des signes vitaux");
      return "";
    }
  }
};
