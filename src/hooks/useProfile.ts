
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useProfilesService } from './useProfilesService';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  updated_at: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { useUpdateProfile } = useProfilesService();
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        
        const { data, error } = await fetch('/api/profiles');
        
        const { profilesService } = await import('@/integrations/supabase/services');
        const profileData = await profilesService.getProfile(user.id);

        if (profileData) {
          setProfile(profileData as Profile);
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement du profil:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      await updateProfileMutation.mutateAsync({
        userId: user.id,
        data: updates
      });

      const { profilesService } = await import('@/integrations/supabase/services');
      const updatedProfile = await profilesService.getProfile(user.id);
      
      if (updatedProfile) {
        setProfile(updatedProfile as Profile);
      }
      
      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    }
  };

  return {
    profile,
    loading,
    updateProfile
  };
}
