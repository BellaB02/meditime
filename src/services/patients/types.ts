
export interface PatientInfo {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
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
  title: string;
  date: string;
  file?: string;
}

export interface PatientServiceResponse {
  success: boolean;
  id?: string;
  message?: string;
}
