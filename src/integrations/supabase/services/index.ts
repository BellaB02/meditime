
import { appSettingsService } from './appSettingsService';
import { nursingActsService } from './nursingActsService';
import { majorationsService } from './majorationsService';
import { profilesService } from './profilesService';

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
  updateProfile: profilesService.updateProfile
};

// Exporter également les services individuels pour les cas où on veut y accéder directement
export {
  appSettingsService,
  nursingActsService,
  majorationsService,
  profilesService
};
