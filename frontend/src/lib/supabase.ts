import { createClient } from '@supabase/supabase-js';

// export const supabase = createClient('https://qsikqwqbfccjpeijmbsi.supabase.co ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaWtxd3FiZmNjanBlaWptYnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDQ1MTMsImV4cCI6MjA2MzkyMDUxM30.FeINRT7VcKhEVANS0T8Amzh2u5woXFS_720y9gM091Q');

// import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);