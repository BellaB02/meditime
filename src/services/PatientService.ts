
// This file now serves as a re-export to maintain backward compatibility
import { PatientService } from './patients/PatientService';
import { VitalSign, PatientInfo, Prescription } from "./patients/types";

export { PatientService };
export type { VitalSign, PatientInfo, Prescription };

// Additionally export other services if needed elsewhere
export { VitalSignsService } from './patients/VitalSignsService';
export { PatientStorageService } from './patients/PatientStorageService';
