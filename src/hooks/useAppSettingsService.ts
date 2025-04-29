
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appSettingsService } from '@/integrations/supabase/services';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

// Type for app settings
type AppSettings = Database["public"]["Tables"]["app_settings"]["Row"];

export function useAppSettingsService() {
  const queryClient = useQueryClient();
  
  // App Settings Queries
  const useAppSettings = () => {
    return useQuery({
      queryKey: ['app-settings'],
      queryFn: appSettingsService.getAppSettings,
    });
  };

  const useUpdateAppSetting = () => {
    return useMutation({
      mutationFn: ({ key, value }: { key: string, value: string }) => 
        appSettingsService.updateAppSetting(key, value),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['app-settings'] });
        toast.success("Paramètre mis à jour avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour du paramètre");
        console.error("Error updating app setting:", error);
      }
    });
  };

  return {
    useAppSettings,
    useUpdateAppSetting
  };
}
