import { createClient } from "@supabase/supabase-js";

// Make sure to add these to your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// The anon key is safe for the public client because we have configured RLS
// to only allow inserts into 'orders' and 'leads', and selects on 'active products'.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
