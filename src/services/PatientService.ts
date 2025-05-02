
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
  insurance?: string;
  medicalNotes?: string;
  status?: "active" | "inactive" | "urgent";
}

export interface VitalSign {
  id: string;
  date: string;
  time: string;
  temperature?: string;
  bloodPressure?: string;
  heartRate?: string;
  oxygenSaturation?: string;
  bloodSugar?: string;
  painLevel?: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  doctor: string;
  notes?: string;
  scan?: string;
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
      const mockPatients = PatientService.getMockPatients();
      
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
      const mockPatients = PatientService.getMockPatients();
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
      const mockPatients = PatientService.getMockPatients();
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
      const mockPatients = PatientService.getMockPatients();
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
      const mockPatients = PatientService.getMockPatients();
      const id = `p${Object.keys(mockPatients).length + 1}`;
      mockPatients[id] = { id, ...patient };
      
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
      const mockPatients = PatientService.getMockPatients();
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
   * Récupère les signes vitaux d'un patient
   */
  getVitalSigns: (patientId: string): VitalSign[] => {
    // Données fictives pour la démonstration
    const mockVitalSigns: Record<string, VitalSign[]> = {
      "p1": [
        {
          id: "vs1",
          date: "01/05/2025",
          time: "09:15",
          temperature: "37.2",
          bloodPressure: "120/80",
          heartRate: "72",
          oxygenSaturation: "98",
          bloodSugar: "5.6",
          painLevel: "1",
          notes: "Patient en bonne santé générale"
        },
        {
          id: "vs2",
          date: "28/04/2025",
          time: "14:30",
          temperature: "37.5",
          bloodPressure: "125/85",
          heartRate: "78",
          oxygenSaturation: "97",
          bloodSugar: "5.8",
          painLevel: "2",
          notes: "Légère fatigue signalée"
        }
      ],
      "p2": [
        {
          id: "vs3",
          date: "30/04/2025",
          time: "10:00",
          temperature: "36.9",
          bloodPressure: "130/85",
          heartRate: "68",
          oxygenSaturation: "99",
          bloodSugar: "5.2",
          painLevel: "0",
          notes: "État stable"
        }
      ],
      "p3": []
    };
    
    return mockVitalSigns[patientId] || [];
  },
  
  /**
   * Ajoute un signe vital pour un patient
   */
  addVitalSign: (patientId: string, vitalSign: Omit<VitalSign, 'id'>): string => {
    try {
      // Dans une application réelle, nous sauvegarderions ces données dans une base de données
      const id = `vs${Date.now()}`;
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
    // Données fictives pour la démonstration
    const mockPrescriptions: Record<string, Prescription[]> = {
      "p1": [
        {
          id: "pr1",
          name: "Paracétamol",
          dosage: "1000mg",
          frequency: "3 fois par jour",
          startDate: "15/04/2025",
          endDate: "22/04/2025",
          doctor: "Dr. Martin",
          notes: "À prendre pendant les repas"
        },
        {
          id: "pr2",
          name: "Amoxicilline",
          dosage: "500mg",
          frequency: "2 fois par jour",
          startDate: "15/04/2025",
          endDate: "29/04/2025",
          doctor: "Dr. Martin",
          notes: "Traitement antibiotique"
        }
      ],
      "p2": [
        {
          id: "pr3",
          name: "Insuline",
          dosage: "10 unités",
          frequency: "Avant chaque repas",
          startDate: "01/01/2025",
          doctor: "Dr. Durand",
          notes: "Traitement au long cours"
        }
      ],
      "p3": []
    };
    
    return mockPrescriptions[patientId] || [];
  },
  
  /**
   * Ajoute une ordonnance pour un patient
   */
  addPrescription: (patientId: string, prescription: Omit<Prescription, 'id'>): string => {
    try {
      // Dans une application réelle, nous sauvegarderions ces données dans une base de données
      const id = `pr${Date.now()}`;
      toast.success("Ordonnance ajoutée avec succès");
      return id;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ordonnance:", error);
      toast.error("Erreur lors de l'ajout de l'ordonnance");
      return "";
    }
  },
  
  /**
   * Données fictives de patients pour la démonstration
   */
  getMockPatients: (): Record<string, PatientInfo> => {
    return {
      "p1": {
        id: "p1",
        name: "Dupont",
        firstName: "Jean",
        address: "123 rue des Fleurs, 75001 Paris",
        phoneNumber: "0123456789",
        email: "jean.dupont@email.com",
        dateOfBirth: "15/04/1965",
        socialSecurityNumber: "1 65 04 75 123 456",
        doctor: "Dr. Martin",
        insurance: "Carte vitale n°12345678901234",
        medicalNotes: "Hypertension artérielle sous traitement",
        status: "active"
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
        doctor: "Dr. Durand",
        insurance: "Carte vitale n°23456789012345",
        medicalNotes: "Diabète de type 2",
        status: "active"
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
        doctor: "Dr. Bernard",
        insurance: "Carte vitale n°34567890123456",
        medicalNotes: "",
        status: "inactive"
      }
    };
  }
};
