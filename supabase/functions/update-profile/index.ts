
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateProfileRequest {
  user_id: string;
  profile_data: {
    first_name?: string;
    last_name?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // Parse request body
    const { user_id, profile_data } = await req.json() as UpdateProfileRequest
    
    if (!user_id || !profile_data) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id or profile_data' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }
    
    // Update the profile using RPC function
    const { data, error } = await supabase.rpc(
      'update_user_profile',
      { 
        user_id, 
        profile_data: {
          first_name: profile_data.first_name,
          last_name: profile_data.last_name,
          updated_at: new Date().toISOString()
        }
      }
    )

    if (error) throw error
    
    // Fetch the updated profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select()
      .eq('id', user_id)
      .single()
      
    if (profileError) throw profileError

    return new Response(
      JSON.stringify(profile),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    )
  }
})
