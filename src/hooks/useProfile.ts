
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
        
        // Use a typesafe approach for RPC calls
        const { data, error } = await supabase.functions.invoke('get-profile', {
          body: { user_id: user.id }
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
      // Use a typesafe approach for RPC calls
      const { error } = await supabase.functions.invoke('update-profile', {
        body: { 
          user_id: user.id,
          profile_data: updates 
        }
      });

      if (error) {
        throw error;
      }

      // Fetch the updated profile
      const { data, error: fetchError } = await supabase.functions.invoke('get-profile', {
        body: { user_id: user.id }
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
