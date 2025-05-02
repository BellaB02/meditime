
import { toast } from "sonner";
import { PrescriptionInfo } from "@/services/PDFTypes";
import { PrescriptionsByPatient, PrescriptionServiceResponse } from "./types";
import { PrescriptionsStorageService } from "./PrescriptionsStorageService";

/**
 * Service for managing prescriptions
 */
export const PrescriptionsService = {
  /**
   * Récupère les ordonnances d'un patient
   */
  getPrescriptions: (patientId: string): PrescriptionInfo[] => {
    try {
      const prescriptionsData = PrescriptionsStorageService.getPrescriptionsData();
      return prescriptionsData[patientId] || [];
    } catch (error) {
      console.error("Error getting prescriptions:", error);
      toast.error("Erreur lors de la récupération des ordonnances");
      return [];
    }
  },
  
  /**
   * Ajoute une ordonnance pour un patient
   */
  addPrescription: (patientId: string, prescription: Omit<PrescriptionInfo, "id">): PrescriptionServiceResponse => {
    try {
      // Make sure we have a valid ID
      const id = `pre-${Date.now()}`;
      const newPrescription: PrescriptionInfo = { ...prescription, id };
      
      PrescriptionsStorageService.storePrescription(patientId, newPrescription);
      toast.success("Ordonnance ajoutée avec succès");
      
      return {
        success: true,
        id,
        message: "Ordonnance ajoutée avec succès"
      };
    } catch (error) {
      console.error("Error adding prescription:", error);
      toast.error("Erreur lors de l'ajout de l'ordonnance");
      
      return {
        success: false,
        message: "Erreur lors de l'ajout de l'ordonnance"
      };
    }
  }
};
