import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

export const supabase: SupabaseClient<Database> | null =
  supabaseUrl && supabaseKey
    ? createClient<Database>(supabaseUrl, supabaseKey)
    : null;
