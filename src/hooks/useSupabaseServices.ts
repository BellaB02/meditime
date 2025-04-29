
import { useAppSettingsService } from './useAppSettingsService';
import { useNursingActsService } from './useNursingActsService';
import { useMajorationsService } from './useMajorationsService';
import { useProfilesService } from './useProfilesService';
import { usePatientsService } from './usePatientsService';
import { useAppointmentsService } from './useAppointmentsService';
import { useCareProtocolsService } from './useCareProtocolsService';
import { useInventoryService } from './useInventoryService';
import { useBillingService } from './useBillingService';

export function useSupabaseServices() {
  const appSettingsService = useAppSettingsService();
  const nursingActsService = useNursingActsService();
  const majorationsService = useMajorationsService();
  const profilesService = useProfilesService();
  const patientsService = usePatientsService();
  const appointmentsService = useAppointmentsService();
  const careProtocolsService = useCareProtocolsService();
  const inventoryService = useInventoryService();
  const billingService = useBillingService();
  
  return {
    // App Settings
    useAppSettings: appSettingsService.useAppSettings,
    
    // Nursing Acts
    useNursingActs: nursingActsService.useNursingActs,
    useNursingAct: nursingActsService.useNursingAct,
    useCreateNursingAct: nursingActsService.useCreateNursingAct,
    useUpdateNursingAct: nursingActsService.useUpdateNursingAct,
    useDeleteNursingAct: nursingActsService.useDeleteNursingAct,
    
    // Majorations
    useMajorations: majorationsService.useMajorations,
    useMajoration: majorationsService.useMajoration,
    useCreateMajoration: majorationsService.useCreateMajoration,
    useUpdateMajoration: majorationsService.useUpdateMajoration,
    useDeleteMajoration: majorationsService.useDeleteMajoration,
    
    // Profiles
    useProfile: profilesService.useProfile,
    useUpdateProfile: profilesService.useUpdateProfile,
    
    // Patients
    usePatients: patientsService.usePatients,
    usePatient: patientsService.usePatient,
    useCreatePatient: patientsService.useCreatePatient,
    useUpdatePatient: patientsService.useUpdatePatient,
    usePatientVitalSigns: patientsService.usePatientVitalSigns,
    useAddVitalSign: patientsService.useAddVitalSign,
    usePatientDocuments: patientsService.usePatientDocuments,
    useUploadPatientDocument: patientsService.useUploadPatientDocument,
    
    // Appointments
    useAppointments: appointmentsService.useAppointments,
    useAppointment: appointmentsService.useAppointment,
    useCreateAppointment: appointmentsService.useCreateAppointment,
    useUpdateAppointment: appointmentsService.useUpdateAppointment,
    useCompleteAppointment: appointmentsService.useCompleteAppointment,
    
    // Rounds
    useRounds: appointmentsService.useRounds,
    useRound: appointmentsService.useRound,
    useCreateRound: appointmentsService.useCreateRound,
    useAddStopToRound: appointmentsService.useAddStopToRound,
    useUpdateRoundStatus: appointmentsService.useUpdateRoundStatus,
    
    // Care Protocols
    useCareProtocols: careProtocolsService.useCareProtocols,
    useCareProtocol: careProtocolsService.useCareProtocol,
    useCreateCareProtocol: careProtocolsService.useCreateCareProtocol,
    useUpdateCareProtocol: careProtocolsService.useUpdateCareProtocol,
    useDeleteCareProtocol: careProtocolsService.useDeleteCareProtocol,
    
    // Checklists
    useChecklists: careProtocolsService.useChecklists,
    useChecklist: careProtocolsService.useChecklist,
    useCreateChecklist: careProtocolsService.useCreateChecklist,
    
    // Inventory
    useInventoryItems: inventoryService.useInventoryItems,
    useInventoryItem: inventoryService.useInventoryItem,
    useCreateInventoryItem: inventoryService.useCreateInventoryItem,
    useUpdateInventoryItem: inventoryService.useUpdateInventoryItem,
    useDeleteInventoryItem: inventoryService.useDeleteInventoryItem,
    useRecordInventoryTransaction: inventoryService.useRecordInventoryTransaction,
    useItemTransactions: inventoryService.useItemTransactions,
    
    // Billing
    useBillingRecords: billingService.useBillingRecords,
    useBillingRecord: billingService.useBillingRecord,
    useCreateBillingRecord: billingService.useCreateBillingRecord,
    useUpdateTransmissionStatus: billingService.useUpdateTransmissionStatus,
    useUpdatePaymentStatus: billingService.useUpdatePaymentStatus
  };
}
