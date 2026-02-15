import { FormEvent, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, ShieldCheck } from "lucide-react";

const Login = () => {
  const { signInWithEmail } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("enjoywithpandu@gmail.com");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [statusCopy, setStatusCopy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setStatus("loading");
    setError(null);
    setStatusCopy(null);

    try {
      await signInWithEmail(email);
      setStatus("sent");
      setStatusCopy("Magic link sent via Supabase. Check your inbox to finish signing in.");
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
                <Button type="submit" disabled={status === "loading" || status === "sent"} className="w-full gap-2">
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
