import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Enable session persistence
    storageType: "cookie", // Tell Supabase to store tokens in cookies
    cookieOptions: {
      secure: process.env.NODE_ENV === "production", // Set "secure" in production
      // Add "sameSite" attribute here if needed (e.g., 'lax' or 'strict')
      // sameSite: 'lax',
    },
  },
});
