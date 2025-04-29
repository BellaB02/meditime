
CREATE OR REPLACE FUNCTION update_user_profile(user_id UUID, profile_data JSONB)
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
