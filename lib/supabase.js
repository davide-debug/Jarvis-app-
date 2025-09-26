import { createClient } from '@supabase/supabase-js';
export function getSupabase() {
  let url = null, key = null;
  if (typeof window !== 'undefined') {
    url = localStorage.getItem('SUPABASE_URL') || null;
    key = localStorage.getItem('SUPABASE_ANON_KEY') || null;
  }
  url = url || process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  key = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;
  if (!url || !key) return null;
  return createClient(url, key);
}