
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProfileRequest {
  user_id: string;
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
    const { user_id } = await req.json() as ProfileRequest
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }
    
    // Get the profile using RPC function
    const { data, error } = await supabase.rpc('get_profile', { user_id })
    
    if (error) throw error
    
    if (!data) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      )
    }

    return new Response(
      JSON.stringify(data),
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
