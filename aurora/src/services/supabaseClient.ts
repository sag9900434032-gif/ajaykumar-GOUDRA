import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fijgonfzdrloytiqnxvs.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_RL_fhDSK-EQEyCNhbsd8tA_L9ILA4Ak';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
