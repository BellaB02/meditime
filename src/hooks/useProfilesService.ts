
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profilesService } from '@/integrations/supabase/services';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useProfilesService() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const useProfile = (userId?: string) => {
    const id = userId || (user ? user.id : undefined);
    
    return useQuery({
      queryKey: ['profile', id],
      queryFn: () => profilesService.getProfile(id!),
      enabled: !!id,
    });
  };
  
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: ({ userId, data }: { userId: string, data: { first_name?: string, last_name?: string } }) => 
        profilesService.updateProfile(userId, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
        toast.success("Profil mis à jour avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour du profil");
        console.error("Error updating profile:", error);
      }
    });
  };

  return {
    useProfile,
    useUpdateProfile
  };
}
