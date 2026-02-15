import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { runtimeEnv } from "@/lib/runtimeEnv";

export type ProfileRecord = {
  id: string;
  email: string;
  role: string;
  plan: string;
  seats: number;
  max_parallel_runs: number;
  max_daily_campaigns: number;
  is_founder: boolean;
  created_at?: string;
  updated_at?: string;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  profile: ProfileRecord | null;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const founderEmail = runtimeEnv.VITE_FOUNDER_EMAIL.toLowerCase();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!supabase || !session?.user) {
        setProfile(null);
        return;
      }

      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,role,plan,seats,max_parallel_runs,max_daily_campaigns,is_founder,created_at,updated_at")
        .eq("id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Failed to fetch profile", error);
      }

      if (data) {
        setProfile(data as ProfileRecord);
        return;
      }

      const founder = (user.email || "").toLowerCase() === founderEmail;

      const { data: upserted, error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          role: founder ? "founder" : "member",
          plan: founder ? "founder" : "starter",
          seats: founder ? 25 : 3,
          max_parallel_runs: founder ? 10 : 1,
          max_daily_campaigns: founder ? 999 : 3,
          is_founder: founder,
        })
        .select("id,email,role,plan,seats,max_parallel_runs,max_daily_campaigns,is_founder,created_at,updated_at")
        .single();

      if (upsertError) {
        console.error("Failed to create profile", upsertError);
        return;
      }

      setProfile(upserted as ProfileRecord);
    };

    loadProfile();
  }, [session]);

  const signInWithEmail = async (email: string) => {
    if (!supabase) throw new Error("Supabase client missing");
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + "/dashboard" } });
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
  };

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    loading,
    profile,
    signInWithEmail,
    signOut,
  }), [session, loading, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};
