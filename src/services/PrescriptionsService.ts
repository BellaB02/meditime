
import { toast } from "sonner";
import { Prescription } from "@/services/PatientService";

// Données des ordonnances simulées
const prescriptionsData: Record<string, Prescription[]> = {
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

export const PrescriptionsService = {
  /**
   * Récupère les ordonnances d'un patient
   */
  getPrescriptions: (patientId: string): Prescription[] => {
    return prescriptionsData[patientId] || [];
  },
  
  /**
   * Ajoute une ordonnance pour un patient
   */
  addPrescription: (patientId: string, prescription: Omit<Prescription, 'id'>): string => {
    if (!prescriptionsData[patientId]) {
      prescriptionsData[patientId] = [];
    }
    const id = `pre-${Date.now()}`;
    const newPrescription = { id, ...prescription };
    prescriptionsData[patientId].unshift(newPrescription);
    return id;
  }
};
