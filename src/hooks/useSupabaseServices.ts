
import { useAppSettingsService } from './useAppSettingsService';
import { useNursingActsService } from './useNursingActsService';
import { useMajorationsService } from './useMajorationsService';
import { useProfilesService } from './useProfilesService';

export function useSupabaseServices() {
  const appSettingsService = useAppSettingsService();
  const nursingActsService = useNursingActsService();
  const majorationsService = useMajorationsService();
  const profilesService = useProfilesService();
  
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
    useUpdateProfile: profilesService.useUpdateProfile
  };
}
