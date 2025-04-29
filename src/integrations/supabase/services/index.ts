
import { appSettingsService } from './appSettingsService';
import { nursingActsService } from './nursingActsService';
import { majorationsService } from './majorationsService';
import { profilesService } from './profilesService';
import { patientsService } from './patientsService';
import { appointmentsService } from './appointmentsService';
import { careProtocolsService } from './careProtocolsService';
import { inventoryService } from './inventoryService';
import { billingService } from './billingService';

// Exporter un objet consolidé avec tous les services
export const supabaseService = {
  // App Settings
  getAppSettings: appSettingsService.getAppSettings,
  updateAppSetting: appSettingsService.updateAppSetting,
  
  // Nursing Acts
  getNursingActs: nursingActsService.getNursingActs,
  getNursingAct: nursingActsService.getNursingAct,
  createNursingAct: nursingActsService.createNursingAct,
  updateNursingAct: nursingActsService.updateNursingAct, 
  deleteNursingAct: nursingActsService.deleteNursingAct,
  
  // Majorations
  getMajorations: majorationsService.getMajorations,
  getMajoration: majorationsService.getMajoration,
  createMajoration: majorationsService.createMajoration,
  updateMajoration: majorationsService.updateMajoration,
  deleteMajoration: majorationsService.deleteMajoration,
  
  // Profiles
  getProfile: profilesService.getProfile,
  updateProfile: profilesService.updateProfile,
  
  // Patients
  getPatients: patientsService.getPatients,
  getPatient: patientsService.getPatient,
  createPatient: patientsService.createPatient,
  updatePatient: patientsService.updatePatient,
  getPatientVitalSigns: patientsService.getPatientVitalSigns,
  addVitalSign: patientsService.addVitalSign,
  getPatientDocuments: patientsService.getPatientDocuments,
  uploadPatientDocument: patientsService.uploadPatientDocument,
  
  // Appointments
  getAppointments: appointmentsService.getAppointments,
  getAppointment: appointmentsService.getAppointment,
  createAppointment: appointmentsService.createAppointment,
  updateAppointment: appointmentsService.updateAppointment,
  completeAppointment: appointmentsService.completeAppointment,
  
  // Rounds
  getRounds: appointmentsService.getRounds,
  getRound: appointmentsService.getRound,
  createRound: appointmentsService.createRound,
  addStopToRound: appointmentsService.addStopToRound,
  updateRoundStatus: appointmentsService.updateRoundStatus,
  
  // Care Protocols
  getCareProtocols: careProtocolsService.getCareProtocols,
  getCareProtocol: careProtocolsService.getCareProtocol,
  createCareProtocol: careProtocolsService.createCareProtocol,
  updateCareProtocol: careProtocolsService.updateCareProtocol,
  deleteCareProtocol: careProtocolsService.deleteCareProtocol,
  
  // Checklists
  getChecklists: careProtocolsService.getChecklists,
  getChecklist: careProtocolsService.getChecklist,
  createChecklist: careProtocolsService.createChecklist,
  
  // Inventory
  getInventoryItems: inventoryService.getInventoryItems,
  getInventoryItem: inventoryService.getInventoryItem,
  createInventoryItem: inventoryService.createInventoryItem,
  updateInventoryItem: inventoryService.updateInventoryItem,
  deleteInventoryItem: inventoryService.deleteInventoryItem,
  recordInventoryTransaction: inventoryService.recordInventoryTransaction,
  getItemTransactions: inventoryService.getItemTransactions,
  
  // Billing
  getBillingRecords: billingService.getBillingRecords,
  getBillingRecord: billingService.getBillingRecord,
  createBillingRecord: billingService.createBillingRecord,
  updateTransmissionStatus: billingService.updateTransmissionStatus,
  updatePaymentStatus: billingService.updatePaymentStatus
};

// Exporter également les services individuels pour les cas où on veut y accéder directement
export {
  appSettingsService,
  nursingActsService,
  majorationsService,
  profilesService,
  patientsService,
  appointmentsService,
  careProtocolsService,
  inventoryService,
  billingService
};
