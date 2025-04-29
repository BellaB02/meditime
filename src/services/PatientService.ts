
import { PatientInfoService, PatientInfo } from './PatientInfoService';
import { VitalSignsService, VitalSign } from './VitalSignsService';
import { PrescriptionsService, Prescription } from './PrescriptionsService';

// Re-export the types for backward compatibility
export { PatientInfo, VitalSign, Prescription };

// Create a consolidated service that delegates to the specialized services
export const PatientService = {
  // Patient info methods
  getPatientInfo: PatientInfoService.getPatientInfo,
  getAllPatients: PatientInfoService.getAllPatients,
  addPatient: PatientInfoService.addPatient,
  updatePatientStatus: PatientInfoService.updatePatientStatus,
  updatePatient: PatientInfoService.updatePatient,
  validatePatientInfo: PatientInfoService.validatePatientInfo,
  
  // Vital signs methods
  getVitalSigns: VitalSignsService.getVitalSigns,
  addVitalSign: VitalSignsService.addVitalSign,
  
  // Prescriptions methods
  getPrescriptions: PrescriptionsService.getPrescriptions,
  addPrescription: PrescriptionsService.addPrescription
};
