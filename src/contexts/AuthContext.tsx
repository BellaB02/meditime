
import { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { firstName?: string, lastName?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { firstName?: string, lastName?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up authentication listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          // Clear any user data from localStorage
          localStorage.removeItem('userProfile');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast.success('Connexion réussie');
    } catch (error: any) {
      toast.error(`Erreur de connexion: ${error.message}`);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: { firstName?: string, lastName?: string }) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: userData.firstName || '',
            last_name: userData.lastName || '',
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Compte créé avec succès. Veuillez vérifier votre email.');
    } catch (error: any) {
      toast.error(`Erreur d'inscription: ${error.message}`);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      toast.error(`Erreur de déconnexion: ${error.message}`);
      throw error;
    }
  };

  // Update profile information
  const updateProfile = async (data: { firstName?: string, lastName?: string }) => {
    if (!user) {
      toast.error("Vous devez être connecté pour mettre à jour votre profil");
      return;
    }
    
    try {
      // Utilisation de la fonction RPC update_user_profile
      const { error } = await supabase.rpc('update_user_profile', {
        user_id: user.id,
        profile_data: {
          first_name: data.firstName,
          last_name: data.lastName,
          updated_at: new Date().toISOString()
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
