
import { toast } from "sonner";

export interface PatientInfo {
  name: string;
  address?: string;
  phoneNumber?: string;
  socialSecurityNumber?: string;
  dateOfBirth?: string;
}

// Simulation de données patient
const patientsData: Record<string, PatientInfo> = {
  "p1": {
    name: "Jean Dupont",
    address: "15 Rue de Paris, 75001 Paris",
    phoneNumber: "06 12 34 56 78",
    socialSecurityNumber: "1 88 05 75 123 456 78",
    dateOfBirth: "05/08/1988"
  },
  "p2": {
    name: "Marie Martin",
    address: "8 Avenue Victor Hugo, 75016 Paris",
    phoneNumber: "06 23 45 67 89",
    socialSecurityNumber: "2 90 12 75 234 567 89",
    dateOfBirth: "12/10/1990"
  },
  "p3": {
    name: "Robert Petit",
    address: "8 rue du Commerce, 75015 Paris",
    phoneNumber: "06 34 56 78 90",
    socialSecurityNumber: "1 85 07 75 345 678 90",
    dateOfBirth: "07/07/1985"
  }
};

export const PatientService = {
  /**
   * Récupère les informations d'un patient par son ID
   */
  getPatientInfo: (patientId?: string): PatientInfo | undefined => {
    return patientId && patientsData[patientId] ? patientsData[patientId] : undefined;
  },
  
  /**
   * Vérifie si les informations patient sont disponibles et notifie l'utilisateur si non
   */
  validatePatientInfo: (patientId?: string): PatientInfo | null => {
    const patientInfo = patientId ? patientsData[patientId] : undefined;
    
    if (!patientInfo) {
      toast.error("Informations patient non trouvées");
      return null;
    }
    
    return patientInfo;
  }
};
