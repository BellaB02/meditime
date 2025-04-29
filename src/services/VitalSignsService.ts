
import { toast } from "sonner";

export interface VitalSign {
  date: string;
  temperature: string;
  heartRate: string;
  bloodPressure: string;
  notes: string;
}

// Données de signes vitaux simulées
const vitalSignsData: Record<string, VitalSign[]> = {
  "p1": [
    {
      date: "Aujourd'hui",
      temperature: "37.2°C",
      heartRate: "72 bpm",
      bloodPressure: "130/85",
      notes: "Patient stable"
    },
    {
      date: "Hier",
      temperature: "37.0°C",
      heartRate: "75 bpm",
      bloodPressure: "132/86",
      notes: "Légère fatigue"
    }
  ],
  "p2": [
    {
      date: "Il y a 2 jours",
      temperature: "37.4°C",
      heartRate: "80 bpm",
      bloodPressure: "145/90",
      notes: "Tension élevée, à surveiller"
    }
  ],
  "p3": [
    {
      date: "Aujourd'hui",
      temperature: "36.8°C",
      heartRate: "70 bpm",
      bloodPressure: "128/82",
      notes: "Glycémie: 1.25 g/l"
    }
  ]
};

export const VitalSignsService = {
  /**
   * Récupère les signes vitaux d'un patient
   */
  getVitalSigns: (patientId: string): VitalSign[] => {
    return vitalSignsData[patientId] || [];
  },
  
  /**
   * Ajoute un signe vital pour un patient
   */
  addVitalSign: (patientId: string, vitalSign: VitalSign): void => {
    if (!vitalSignsData[patientId]) {
      vitalSignsData[patientId] = [];
    }
    vitalSignsData[patientId].unshift(vitalSign);
  }
};
