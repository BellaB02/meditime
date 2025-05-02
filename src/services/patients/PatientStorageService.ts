
import { PatientInfo, VitalSign, Prescription } from "./types";
import { toast } from "sonner";

/**
 * Service for managing patient data storage operations
 */
export const PatientStorageService = {
  /**
   * Get the mock patients data
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
  },

  /**
   * Get mock vital signs data
   */
  getMockVitalSigns: (): Record<string, VitalSign[]> => {
    return {
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
  },

  /**
   * Get mock prescriptions data
   */
  getMockPrescriptions: (): Record<string, Prescription[]> => {
    return {
      "p1": [
        {
          id: "pr1",
          name: "Paracétamol",
          dosage: "1000mg",
          frequency: "3 fois par jour",
          startDate: "15/04/2025",
          endDate: "22/04/2025",
          doctor: "Dr. Martin",
          notes: "À prendre pendant les repas",
          title: "Paracétamol",
          date: "15/04/2025",
          file: "/documents/prescription1.pdf"
        },
        {
          id: "pr2",
          name: "Amoxicilline",
          dosage: "500mg",
          frequency: "2 fois par jour",
          startDate: "15/04/2025",
          endDate: "29/04/2025",
          doctor: "Dr. Martin",
          notes: "Traitement antibiotique",
          title: "Amoxicilline",
          date: "15/04/2025",
          file: "/documents/prescription2.pdf"
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
          notes: "Traitement au long cours",
          title: "Insuline",
          date: "01/01/2025",
          file: "/documents/prescription3.pdf"
        }
      ],
      "p3": []
    };
  },
  
  /**
   * Store patient data
   */
  storePatient: (patient: PatientInfo): string => {
    try {
      // In a real application, we would save to a database
      console.log("Storing patient:", patient);
      return patient.id;
    } catch (error) {
      console.error("Error storing patient:", error);
      throw new Error("Failed to store patient");
    }
  },
  
  /**
   * Store vital sign data
   */
  storeVitalSign: (patientId: string, vitalSign: Omit<VitalSign, 'id'>): string => {
    try {
      // In a real application, we would save to a database
      const id = `vs${Date.now()}`;
      console.log("Storing vital sign:", patientId, vitalSign);
      return id;
    } catch (error) {
      console.error("Error storing vital sign:", error);
      throw new Error("Failed to store vital sign");
    }
  },
  
  /**
   * Store prescription data
   */
  storePrescription: (patientId: string, prescription: Omit<Prescription, 'id'>): string => {
    try {
      // In a real application, we would save to a database
      const id = `pr${Date.now()}`;
      console.log("Storing prescription:", patientId, prescription);
      return id;
    } catch (error) {
      console.error("Error storing prescription:", error);
      throw new Error("Failed to store prescription");
    }
  }
};
