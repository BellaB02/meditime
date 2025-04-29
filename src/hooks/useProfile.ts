
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        
        // Utilisation de la fonction RPC get_profile
        const { data, error } = await supabase.rpc('get_profile', {
          user_id: user.id
        });

        if (error) {
          console.error('Erreur lors du chargement du profil:', error.message);
          setLoading(false);
          return;
        }

        if (data) {
          setProfile(data as Profile);
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
      // Utilisation de la fonction RPC update_user_profile
      const { error } = await supabase.rpc('update_user_profile', {
        user_id: user.id,
        profile_data: updates
      });

      if (error) {
        throw error;
      }

      // Récupérer le profil mis à jour avec la fonction RPC
      const { data, error: fetchError } = await supabase.rpc('get_profile', {
        user_id: user.id
      });

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setProfile(data as Profile);
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
