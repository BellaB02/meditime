import { PatientService, PatientInfo } from "@/services/PatientService";
import { toast } from "sonner";

// Demo patients to create for new users
const demoPatients = [
  {
    name: "Durant",
    firstName: "Thomas",
    address: "27 Avenue des Champs-Élysées, 75008 Paris",
    phoneNumber: "06 11 22 33 44",
    socialSecurityNumber: "1 80 02 75 123 456 78",
    dateOfBirth: "02/10/1980",
    email: "thomas.durant@email.com",
    doctor: "Dr. Bernard",
    medicalNotes: "Diabète type 2, HTA contrôlée",
    insurance: "Mutuelle Générale",
    status: "active" as const
  },
  {
    name: "Lefebvre",
    firstName: "Sophie",
    address: "14 Rue de la Paix, 75002 Paris",
    phoneNumber: "07 22 33 44 55",
    socialSecurityNumber: "2 92 10 75 234 567 89",
    dateOfBirth: "10/10/1992",
    email: "sophie.lefebvre@email.com",
    doctor: "Dr. Martin",
    medicalNotes: "Allergie pénicilline",
    insurance: "AXA Santé",
    status: "active" as const
  },
  {
    name: "Moreau",
    firstName: "Robert",
    address: "8 Place de la Bastille, 75011 Paris",
    phoneNumber: "06 33 44 55 66",
    socialSecurityNumber: "1 75 04 75 345 678 90",
    dateOfBirth: "04/04/1975",
    email: "robert.moreau@email.com",
    doctor: "Dr. Dupont",
    medicalNotes: "Insuffisance cardiaque, suivi hebdomadaire",
    insurance: "MAIF",
    status: "urgent" as const
  }
];

/**
 * Creates demo patients for new users
 */
export const createDemoData = async (): Promise<boolean> => {
  try {
    // Check if we already have patients
    const existingPatients = await PatientService.getAllPatients();
    
    // If we already have patients, don't create demo data
    if (existingPatients.length > 0) {
      return true;
    }
    
    // Create demo patients
    for (const patient of demoPatients) {
      await PatientService.addPatient(patient);
    }
    
    toast.success("Données de démonstration créées avec succès");
    return true;
  } catch (error) {
    console.error("Failed to create demo data:", error);
    toast.error("Impossible de créer les données de démonstration");
    return false;
  }
};

/**
 * Check if a user is new by checking if they have any patients
 */
export const isNewUser = async (): Promise<boolean> => {
  try {
    const patients = await PatientService.getAllPatients();
    return patients.length === 0;
  } catch (error) {
    console.error("Failed to check if user is new:", error);
    return false;
  }
};
