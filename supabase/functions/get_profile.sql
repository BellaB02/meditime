
CREATE OR REPLACE FUNCTION get_profile(user_id UUID)
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
