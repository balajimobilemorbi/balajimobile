import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zexskspiezfrcbthhexw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Valid Supabase Anon keys are JWT strings starting with 'eyJ' or 'sbp_'
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  (supabaseAnonKey.startsWith('eyJ') || supabaseAnonKey.startsWith('sbp_'))
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
