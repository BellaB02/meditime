
import { toast } from "sonner";
import { PrescriptionInfo } from "@/services/PDFTypes";
import { PrescriptionsByPatient } from "./types";

// In-memory storage for prescriptions (simulated database)
const prescriptionsData: PrescriptionsByPatient = {
  "p1": [
    {
      id: "pre-1",
      title: "Ordonnance de renouvellement",
      date: "15/04/2025",
      doctor: "Dr. Martin",
      file: "/documents/ordonnance_p1.pdf",
      name: "Paracétamol",
      dosage: "1000mg",
      frequency: "3 fois par jour",
      startDate: "15/04/2025",
      endDate: "22/04/2025"
    }
  ],
  "p2": [
    {
      id: "pre-2",
      title: "Prescription cardiaque",
      date: "10/04/2025",
      doctor: "Dr. Dubois",
      file: "/documents/ordonnance_p2.pdf",
      name: "Aténolol",
      dosage: "50mg",
      frequency: "1 fois par jour",
      startDate: "10/04/2025"
    }
  ],
  "p3": [
    {
      id: "pre-3",
      title: "Traitement diabète",
      date: "05/04/2025",
      doctor: "Dr. Leroy",
      file: "/documents/ordonnance_p3.pdf",
      name: "Insuline",
      dosage: "10 unités",
      frequency: "Avant chaque repas",
      startDate: "05/04/2025"
    }
  ]
};

/**
 * Service for managing prescription storage operations
 */
export const PrescriptionsStorageService = {
  /**
   * Get the in-memory prescriptions data store
   */
  getPrescriptionsData: (): PrescriptionsByPatient => {
    return prescriptionsData;
  },
  
  /**
   * Add a prescription to the in-memory storage
   */
  storePrescription: (patientId: string, prescription: PrescriptionInfo): string => {
    try {
      if (!prescriptionsData[patientId]) {
        prescriptionsData[patientId] = [];
      }
      
      prescriptionsData[patientId].unshift(prescription);
      return prescription.id;
    } catch (error) {
      console.error("Error storing prescription:", error);
      throw new Error("Failed to store prescription");
    }
  }
};
