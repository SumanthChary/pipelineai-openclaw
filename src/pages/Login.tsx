import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, ShieldCheck, Clock } from "lucide-react";

const COOLDOWN_SECONDS = 60;

const Login = () => {
  const { signInWithEmail } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [statusCopy, setStatusCopy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start a countdown timer
  const startCooldown = useCallback((seconds = COOLDOWN_SECONDS) => {
    setCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

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
    if (err instanceof Error) {
      if (/rate limit/i.test(err.message)) {
        return "Too many magic link requests. Wait about a minute and try again.";
      }
      return err.message;
    }
    return "Unable to send magic link";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cooldown > 0) return;
    setStatus("loading");
    setError(null);
    setStatusCopy(null);

    try {
      await signInWithEmail(email);
      setStatus("sent");
      setStatusCopy("Magic link sent via Supabase. Check your inbox (and spam folder) to finish signing in.");
      startCooldown(); // prevent spamming
    } catch (err) {
      const message = describeMagicLinkError(err);
      setError(message);
      setStatus("error");

      // If rate-limited, start cooldown so the user waits
      if (/rate limit/i.test(message)) {
        startCooldown();
      }
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
                <Button type="submit" disabled={status === "loading" || status === "sent" || cooldown > 0} className="w-full gap-2">
                  {cooldown > 0
                    ? `Wait ${cooldown}s…`
                    : status === "loading"
                      ? "Sending…"
                      : status === "sent"
                        ? "Magic link sent"
                        : "Email me a login link"}
                  {cooldown > 0 ? <Clock className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
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
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-red-600">{error}</p>
                  {cooldown > 0 && (
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-sm text-amber-800">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>You can try again in <strong>{cooldown}s</strong>. Supabase rate limits OTP requests for security.</span>
                    </div>
                  )}
                </div>
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
