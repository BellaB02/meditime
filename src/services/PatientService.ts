
import { toast } from "sonner";

export interface PatientInfo {
  id: string;
  name: string;
  firstName?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  socialSecurityNumber?: string;
  doctor?: string;
}

/**
 * Service pour la gestion des patients
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
      const mockPatients: Record<string, PatientInfo> = {
        "p1": {
          id: "p1",
          name: "Dupont",
          firstName: "Jean",
          address: "123 rue des Fleurs, 75001 Paris",
          phoneNumber: "0123456789",
          email: "jean.dupont@email.com",
          dateOfBirth: "15/04/1965",
          socialSecurityNumber: "1 65 04 75 123 456",
          doctor: "Dr. Martin"
        },
        "p2": {
          id: "p2",
          name: "Martin",
          firstName: "Marie",
          address: "456 avenue des Lilas, 75002 Paris",
          phoneNumber: "0123456780",
          email: "marie.martin@email.com",
          dateOfBirth: "22/08/1978",
          socialSecurityNumber: "2 78 08 75 123 457",
          doctor: "Dr. Durand"
        },
        "p3": {
          id: "p3",
          name: "Petit",
          firstName: "Robert",
          address: "789 boulevard des Roses, 75003 Paris",
          phoneNumber: "0123456781",
          email: "robert.petit@email.com",
          dateOfBirth: "10/12/1950",
          socialSecurityNumber: "1 50 12 75 123 458",
          doctor: "Dr. Bernard"
        }
      };
      
      return mockPatients[patientId] || null;
    } catch (error) {
      console.error("Erreur lors de la récupération des informations patient:", error);
      toast.error("Erreur lors de la récupération des informations patient");
      return null;
    }
  }
};
