
-- Création de la fonction pour récupérer un profil utilisateur
CREATE OR REPLACE FUNCTION public.get_profile(user_id UUID)
RETURNS JSON AS $$
DECLARE
  profile_data JSON;
BEGIN
  EXECUTE 'SELECT row_to_json(p) FROM (SELECT * FROM profiles WHERE id = $1) p'
  INTO profile_data
  USING user_id;
  
  RETURN profile_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Création de la fonction pour mettre à jour un profil utilisateur
CREATE OR REPLACE FUNCTION public.update_user_profile(user_id UUID, profile_data JSONB)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET 
    first_name = COALESCE(profile_data->>'first_name', first_name),
    last_name = COALESCE(profile_data->>'last_name', last_name),
    updated_at = COALESCE((profile_data->>'updated_at')::timestamptz, updated_at)
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Autoriser l'accès aux fonctions depuis l'API
GRANT EXECUTE ON FUNCTION public.get_profile TO service_role;
GRANT EXECUTE ON FUNCTION public.update_user_profile TO service_role;

-- Autoriser l'accès aux fonctions pour les utilisateurs authentifiés
ALTER FUNCTION public.get_profile SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.update_user_profile SECURITY DEFINER SET search_path = public;

-- Autoriser l'accès aux fonctions pour les utilisateurs authentifiés
CREATE POLICY "Les utilisateurs authentifiés peuvent utiliser get_profile"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent utiliser update_user_profile" 
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);
