import { toast } from "sonner";

export interface PatientInfo {
  id: string;
  name: string;
  firstName?: string;
  address?: string;
  phoneNumber?: string;
  socialSecurityNumber?: string;
  dateOfBirth?: string;
  email?: string;
  doctor?: string;
  medicalNotes?: string;
  insurance?: string;
  status?: "active" | "inactive" | "urgent";
}

export interface VitalSign {
  date: string;
  temperature: string;
  heartRate: string;
  bloodPressure: string;
  notes: string;
}

export interface Prescription {
  id: string;
  title: string;
  date: string;
  doctor: string;
  file: string;
}

// Simulation de données patient
const patientsData: Record<string, PatientInfo> = {
  "p1": {
    id: "p1",
    name: "Dupont",
    firstName: "Jean",
    address: "15 Rue de Paris, 75001 Paris",
    phoneNumber: "06 12 34 56 78",
    socialSecurityNumber: "1 88 05 75 123 456 78",
    dateOfBirth: "05/08/1988",
    email: "jean.dupont@email.com",
    insurance: "Carte vitale n°12345678901234",
    doctor: "Dr. Martin (Généraliste)",
    status: "active"
  },
  "p2": {
    id: "p2",
    name: "Martin",
    firstName: "Marie",
    address: "8 Avenue Victor Hugo, 75016 Paris",
    phoneNumber: "06 23 45 67 89",
    socialSecurityNumber: "2 90 12 75 234 567 89",
    dateOfBirth: "12/10/1990",
    email: "marie.martin@email.com",
    insurance: "Carte vitale n°23456789012345",
    doctor: "Dr. Dubois (Cardiologue)",
    status: "active"
  },
  "p3": {
    id: "p3",
    name: "Petit",
    firstName: "Robert",
    address: "8 rue du Commerce, 75015 Paris",
    phoneNumber: "06 34 56 78 90",
    socialSecurityNumber: "1 85 07 75 345 678 90",
    dateOfBirth: "07/07/1985",
    email: "robert.petit@email.com",
    insurance: "Carte vitale n°34567890123456",
    doctor: "Dr. Leroy (Diabétologue)",
    status: "active"
  }
};

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

export const PatientService = {
  /**
   * Récupère les informations d'un patient par son ID
   */
  getPatientInfo: (patientId?: string): PatientInfo | undefined => {
    return patientId && patientsData[patientId] ? patientsData[patientId] : undefined;
  },
  
  /**
   * Récupère la liste de tous les patients
   */
  getAllPatients: (): PatientInfo[] => {
    return Object.values(patientsData);
  },
  
  /**
   * Ajoute un nouveau patient
   */
  addPatient: (patient: Omit<PatientInfo, 'id'>): string => {
    const id = `p${Object.keys(patientsData).length + 1}`;
    patientsData[id] = { id, ...patient };
    return id;
  },
  
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
  },
  
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
  },
  
  /**
   * Met à jour le statut d'un patient (actif ou inactif)
   */
  updatePatientStatus: (patientId: string, status: "active" | "inactive" | "urgent"): boolean => {
    if (patientsData[patientId]) {
      patientsData[patientId].status = status;
      toast.success(`Statut du patient mis à jour : ${status}`);
      return true;
    }
    toast.error("Patient non trouvé");
    return false;
  },
  
  /**
   * Met à jour les informations d'un patient
   */
  updatePatient: (patientId: string, patient: Partial<PatientInfo>): boolean => {
    if (patientsData[patientId]) {
      patientsData[patientId] = {
        ...patientsData[patientId],
        ...patient
      };
      toast.success("Informations patient mises à jour");
      return true;
    }
    toast.error("Patient non trouvé");
    return false;
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
