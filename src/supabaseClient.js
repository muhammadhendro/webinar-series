
import { createClient } from '@supabase/supabase-js'

// These environment variables will need to be set in your Vercel project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase URL or Anon Key. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
