
import { toast } from "sonner";
import { PatientInfo, VitalSign, Prescription, PatientServiceResponse } from "./types";
import { PatientStorageService } from "./PatientStorageService";

/**
 * Service for managing patient data
 */
export const PatientService = {
  /**
   * Récupère les informations d'un patient
   */
  getPatientInfo: async (patientId?: string): Promise<PatientInfo | null> => {
    // Pour l'instant, nous utilisons des données fictives pour la démonstration
    // Dans une application réelle, ces données proviendraient d'une API ou d'une base de données
    if (!patientId) return null;
    
    try {
      // Simuler une requête API
      const mockPatients = PatientStorageService.getMockPatients();
      
      return mockPatients[patientId] || null;
    } catch (error) {
      console.error("Erreur lors de la récupération des informations patient:", error);
      toast.error("Erreur lors de la récupération des informations patient");
      return null;
    }
  },
  
  /**
   * Version synchrone de getPatientInfo pour la rétrocompatibilité
   */
  getPatientInfoSync: (patientId?: string): PatientInfo | null => {
    if (!patientId) return null;
    
    try {
      const mockPatients = PatientStorageService.getMockPatients();
      return mockPatients[patientId] || null;
    } catch (error) {
      console.error("Erreur lors de la récupération des informations patient:", error);
      return null;
    }
  },
  
  /**
   * Retourne tous les patients
   */
  getAllPatients: async (): Promise<PatientInfo[]> => {
    try {
      // Simuler une requête API
      const mockPatients = PatientStorageService.getMockPatients();
      return Object.values(mockPatients);
    } catch (error) {
      console.error("Erreur lors de la récupération des patients:", error);
      toast.error("Erreur lors de la récupération des patients");
      return [];
    }
  },
  
  /**
   * Version synchrone de getAllPatients pour la rétrocompatibilité
   */
  getAllPatientsSync: (): PatientInfo[] => {
    try {
      const mockPatients = PatientStorageService.getMockPatients();
      return Object.values(mockPatients);
    } catch (error) {
      console.error("Erreur lors de la récupération des patients:", error);
      return [];
    }
  },
  
  /**
   * Ajoute un nouveau patient
   */
  addPatient: (patient: Omit<PatientInfo, 'id'>): string => {
    try {
      const mockPatients = PatientStorageService.getMockPatients();
      const id = `p${Object.keys(mockPatients).length + 1}`;
      const newPatient = { id, ...patient };
      
      PatientStorageService.storePatient(newPatient);
      
      // Dans une application réelle, nous sauvegarderions ces données dans une base de données
      toast.success("Patient ajouté avec succès");
      return id;
    } catch (error) {
      console.error("Erreur lors de l'ajout du patient:", error);
      toast.error("Erreur lors de l'ajout du patient");
      return "";
    }
  },
  
  /**
   * Met à jour le statut d'un patient
   */
  updatePatientStatus: (patientId: string, status: "active" | "inactive" | "urgent"): boolean => {
    try {
      const mockPatients = PatientStorageService.getMockPatients();
      if (mockPatients[patientId]) {
        mockPatients[patientId].status = status;
        toast.success(`Statut du patient mis à jour : ${status}`);
        return true;
      }
      toast.error("Patient non trouvé");
      return false;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
      return false;
    }
  },
  
  /**
   * Met à jour les informations d'un patient
   */
  updatePatient: (patientId: string, updates: Partial<PatientInfo>): boolean => {
    try {
      const mockPatients = PatientStorageService.getMockPatients();
      if (mockPatients[patientId]) {
        const updatedPatient = { ...mockPatients[patientId], ...updates };
        PatientStorageService.storePatient(updatedPatient);
        
        toast.success("Informations patient mises à jour");
        return true;
      }
      toast.error("Patient non trouvé");
      return false;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du patient:", error);
      toast.error("Erreur lors de la mise à jour du patient");
      return false;
    }
  },
  
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
  },
  
  /**
   * Récupère les ordonnances d'un patient
   */
  getPrescriptions: (patientId: string): Prescription[] => {
    try {
      const mockPrescriptions = PatientStorageService.getMockPrescriptions();
      return mockPrescriptions[patientId] || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des ordonnances:", error);
      toast.error("Erreur lors de la récupération des ordonnances");
      return [];
    }
  },
  
  /**
   * Ajoute une ordonnance pour un patient
   */
  addPrescription: (patientId: string, prescription: Omit<Prescription, 'id'>): string => {
    try {
      const id = PatientStorageService.storePrescription(patientId, prescription);
      toast.success("Ordonnance ajoutée avec succès");
      return id;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ordonnance:", error);
      toast.error("Erreur lors de l'ajout de l'ordonnance");
      return "";
    }
  },
  
  /**
   * Get mock patients data - kept for backward compatibility
   */
  getMockPatients: (): Record<string, PatientInfo> => {
    return PatientStorageService.getMockPatients();
  }
};
