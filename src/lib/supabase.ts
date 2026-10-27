import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase backs analytics and the chat transcript log - both optional. This
// used to throw when the env vars were missing, taking the whole bundle down
// with it. The chat assistant no longer depends on Supabase at all; it talks to
// the /api/chat Pages Function.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing - analytics and chat logging are disabled.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
