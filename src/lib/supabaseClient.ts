import { createClient } from "@supabase/supabase-js";
import { runtimeEnv } from "@/lib/runtimeEnv";

const supabaseUrl = runtimeEnv.VITE_SUPABASE_URL;
const supabaseAnonKey = runtimeEnv.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: "pipelineai-auth",
    autoRefreshToken: true,
  },
});
