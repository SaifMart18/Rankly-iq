
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ccyhaenuedgnhcgifokm.supabase.co';
const supabaseAnonKey = 'sb_publishable_rYoxiU_3Cj3V_lBAdKt0aw_gZhIb9aa';

// Create Supabase client with explicit persistence settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});
