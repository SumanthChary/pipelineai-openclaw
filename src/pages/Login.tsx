import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthStatus, getAuthStatus, isApiError, requestMagicLink } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Login = () => {
  const { signInWithEmail } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("enjoywithpandu@gmail.com");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [statusCopy, setStatusCopy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchStatus = async () => {
      try {
        setStatusLoading(true);
        const result = await getAuthStatus();
        if (!active) return;
        setAuthStatus(result);
        setStatusError(null);
      } catch (err) {
        if (!active) return;
        setAuthStatus(null);
        setStatusError("Magic-link bridge unreachable. Configure Resend + Supabase on the server.");
      } finally {
        if (active) {
          setStatusLoading(false);
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const resendReady = authStatus?.resend.ok ?? false;
  const supabaseReady = authStatus?.supabase.ok ?? false;
  const bridgeReady = resendReady && supabaseReady;
  const statusMessage = authStatus?.resend.error || authStatus?.supabase.error;

  const describeSupabaseError = (err: unknown) => {
    if (err && typeof err === "object" && "message" in err) {
      const message = (err as { message?: string }).message || "Unable to send magic link";
      if (/rate limit/i.test(message)) {
        return "Too many magic link requests. Wait about a minute and try again.";
      }
      return message;
    }
    return "Unable to send magic link via Supabase.";
  };

  const describeMagicLinkError = (err: unknown) => {
    if (isApiError(err)) {
      if (err.status === 429) {
        return "Too many magic link requests. Wait about a minute and try again.";
      }
      return err.message || "Unable to send magic link";
    }
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to send magic link";
  };

  const shouldFallbackToSupabase = (err: unknown) => {
    if (!isApiError(err)) return true;
    if (!err.status) return true;
    if (err.status === 404) return true;
    if (err.status === 429) return false;
    if (err.status === 503) return false;
    if (err.status >= 500) {
      const message = err.message?.toLowerCase() ?? "";
      if (message.includes("service role") || message.includes("resend")) {
        return false;
      }
    }
    if (authStatus && !resendReady) {
      return false;
    }
    return err.status >= 500;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    setStatusCopy(null);

    try {
      try {
        await requestMagicLink(email);
        setStatus("sent");
        setStatusCopy("Magic link sent from Pipeline AI. It works for both sign in and sign up.");
      } catch (magicLinkError) {
        console.error("Magic link API failed", magicLinkError);

        if (!shouldFallbackToSupabase(magicLinkError)) {
          throw magicLinkError;
        }

        try {
          await signInWithEmail(email);
          setStatus("sent");
          setStatusCopy("Magic link sent via Supabase Auth. Open it to finish sign up or sign in.");
        } catch (supabaseError) {
          throw new Error(describeSupabaseError(supabaseError));
        }
      }
    } catch (err) {
      const message = describeMagicLinkError(err);
      setError(message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Sign in to PipelineAI</CardTitle>
              <CardDescription>Magic link authentication for both sign up and sign in. Use your work email.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-sm font-semibold text-foreground/80">
                    Work email
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <StatusGrid
                  loading={statusLoading}
                  resendReady={resendReady}
                  supabaseReady={supabaseReady}
                  error={statusError || statusMessage || undefined}
                />
                <Button
                  type="submit"
                  disabled={status === "loading" || status === "sent" || (!statusLoading && authStatus !== null && !bridgeReady)}
                  className="w-full gap-2"
                >
                  {status === "loading" ? "Sending…" : status === "sent" ? "Magic link sent" : "Email me a login link"}
                  <Mail className="h-4 w-4" />
                </Button>
              </form>

              {status === "sent" && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-800">
                  <ShieldCheck className="h-4 w-4" />
                  <div>
                    <p className="font-semibold">Check your inbox</p>
                    <p>{statusCopy || `Click the secure link to continue ${location.state?.from ? `to ${location.state.from}` : ""}.`}</p>
                  </div>
                </div>
              )}

              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

type StatusGridProps = {
  loading: boolean;
  resendReady: boolean;
  supabaseReady: boolean;
  error?: string;
};

const StatusGrid = ({ loading, resendReady, supabaseReady, error }: StatusGridProps) => {
  const indicators = useMemo(
    () => [
      { label: "Resend API", ok: resendReady, description: resendReady ? "Email delivery ready." : "Configure Resend API key + sender." },
      { label: "Supabase admin", ok: supabaseReady, description: supabaseReady ? "Magic link generator ready." : "Check service_role key." },
    ],
    [resendReady, supabaseReady],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Email system</p>
        {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {indicators.map((indicator) => (
          <StatusIndicator key={indicator.label} {...indicator} loading={loading} />
        ))}
      </div>
      {error && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {error}
        </div>
      )}
    </div>
  );
};

type StatusIndicatorProps = {
  label: string;
  ok: boolean;
  description?: string;
  loading?: boolean;
};

const StatusIndicator = ({ label, ok, description, loading }: StatusIndicatorProps) => (
  <div className="rounded-lg border border-border/70 px-3 py-2">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <div
      className={cn(
        "mt-1 flex items-center gap-1 text-sm font-semibold",
        loading ? "text-muted-foreground" : ok ? "text-emerald-600" : "text-red-600",
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {loading ? "Checking…" : ok ? "Ready" : "Needs attention"}
    </div>
    {!loading && !ok && description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
  </div>
);
