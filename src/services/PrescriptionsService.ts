
import { toast } from "sonner";

export interface Prescription {
  id: string;
  title: string;
  date: string;
  doctor: string;
  file: string;
}

// Données des ordonnances simulées
const prescriptionsData: Record<string, Prescription[]> = {
  "p1": [
    {
      id: "pre-1",
      title: "Ordonnance de renouvellement",
      date: "15/04/2025",
      doctor: "Dr. Martin",
      file: "/documents/ordonnance_p1.pdf"
    }
  ],
  "p2": [
    {
      id: "pre-2",
      title: "Prescription cardiaque",
      date: "10/04/2025",
      doctor: "Dr. Dubois",
      file: "/documents/ordonnance_p2.pdf"
    }
  ],
  "p3": [
    {
      id: "pre-3",
      title: "Traitement diabète",
      date: "05/04/2025",
      doctor: "Dr. Leroy",
      file: "/documents/ordonnance_p3.pdf"
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
