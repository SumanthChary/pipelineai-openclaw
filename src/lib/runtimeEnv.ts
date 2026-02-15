const fallbackEnv = {
  VITE_SUPABASE_URL: "https://qxmcohtzaqrqhfdpamud.supabase.co",
  VITE_SUPABASE_ANON_KEY: "sb_publishable_tUJmfAuAntIMaRvDpVszJw_-6i3a5DW",
  VITE_FOUNDER_EMAIL: "enjoywithpandu@gmail.com",
};

type RuntimeEnv = {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_FOUNDER_EMAIL: string;
};

declare global {
  interface Window {
    __PIPELINEAI_ENV?: Partial<RuntimeEnv>;
  }
}

const globalEnv = typeof window !== "undefined" ? window.__PIPELINEAI_ENV || {} : {};

const pickEnvValue = <Key extends keyof RuntimeEnv>(key: Key): RuntimeEnv[Key] => {
  const viteValue = import.meta.env[key as keyof ImportMetaEnv] as RuntimeEnv[Key] | undefined;
  if (viteValue) return viteValue as RuntimeEnv[Key];
  const globalValue = globalEnv[key];
  if (globalValue) return globalValue as RuntimeEnv[Key];
  return fallbackEnv[key];
};

export const runtimeEnv: RuntimeEnv = {
  VITE_SUPABASE_URL: pickEnvValue("VITE_SUPABASE_URL"),
  VITE_SUPABASE_ANON_KEY: pickEnvValue("VITE_SUPABASE_ANON_KEY"),
  VITE_FOUNDER_EMAIL: pickEnvValue("VITE_FOUNDER_EMAIL"),
};
