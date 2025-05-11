
/**
 * Service for handling mobile-specific features
 */
export const MobileService = {
  /**
   * Initialize mobile services
   */
  init: async (): Promise<void> => {
    try {
      // Importations dynamiques pour éviter les problèmes lors du build
      const { SplashScreen } = await import('@capacitor/splash-screen');
      const { Network } = await import('@capacitor/network');
      
      // Hide the splash screen with a fade animation
      SplashScreen.hide({
        fadeOutDuration: 500
      });
      
      // Set up network status listener for mobile
      const listenerHandle = await Network.addListener('networkStatusChange', status => {
        if (status.connected) {
          const { toast } = require("sonner");
          toast.success("Connexion rétablie", {
            description: "Synchronisation des données en cours..."
          });
          const { OfflineService } = require('./OfflineService');
          OfflineService.processPendingSyncs();
        } else {
          const { toast } = require("sonner");
          toast.warning("Connexion perdue", {
            description: "Mode hors-ligne activé. Les modifications seront synchronisées ultérieurement."
          });
        }
      });
      
      // Initial network check
      const status = await Network.getStatus();
      if (!status.connected) {
        const { toast } = require("sonner");
        toast.warning("Mode hors-ligne actif", {
          description: "Les données disponibles sont celles de votre dernière connexion."
        });
      }
    } catch (error) {
      console.error("Error initializing mobile services:", error);
    }
  },
  
  /**
   * Save data to device storage
   */
  saveData: async (key: string, value: any): Promise<void> => {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.set({
        key,
        value: JSON.stringify(value),
      });
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      throw error;
    }
  },
  
  /**
   * Get data from device storage
   */
  getData: async <T>(key: string): Promise<T | null> => {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      const result = await Preferences.get({ key });
      if (result.value) {
        return JSON.parse(result.value) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      return null;
    }
  },
  
  /**
   * Remove data from device storage
   */
  removeData: async (key: string): Promise<void> => {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.remove({ key });
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw error;
    }
  },
  
  /**
   * Clear all data from device storage
   */
  clearData: async (): Promise<void> => {
    try {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.clear();
    } catch (error) {
      console.error("Error clearing all data:", error);
      throw error;
    }
  },
  
  /**
   * Determines if the app is running on a mobile device
   */
  isMobileApp: (): boolean => {
    return (
      // Check if Capacitor is available
      typeof (window as any).Capacitor !== 'undefined' && 
      (window as any).Capacitor.isNative
    );
  }
};
