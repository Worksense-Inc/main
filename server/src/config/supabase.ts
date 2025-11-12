import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
// Prefer service role key on server; fallback to anon if needed
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';

const KEY = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing SUPABASE_URL or server key (SERVICE_ROLE or ANON)'
  );
}

export const supabase = createClient(SUPABASE_URL, KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export default supabase;
