import { FormEvent, useEffect, useState } from "react";
import { runCampaign, checkBackendHealth, CampaignResult } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, WifiOff, Wifi, Crown, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";

const defaultLead = {
  leadName: "Jane Founder",
  leadTitle: "CEO",
  leadCompany: "Acme Labs",
  leadEmail: "jane@acme.com",
};

const generateFallbackEmail = () => `pipelineai+${Date.now()}-${Math.random().toString(36).slice(2, 8)}@pipeline.ai`;

const CampaignPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const { user, profile } = useAuth();
  const [contactEmail, setContactEmail] = useState(profile?.email ?? user?.email ?? "");
  const [lastNotificationEmail, setLastNotificationEmail] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  useEffect(() => {
    setContactEmail(profile?.email ?? user?.email ?? "");
  }, [profile?.email, user?.email]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(event.currentTarget);

    try {
      const trimmedContact = contactEmail.trim();
      const notificationEmail = trimmedContact || generateFallbackEmail();
      const fallbackGenerated = !trimmedContact;

      const payload = {
        campaignName: formData.get("name") as string,
        emailSubject: formData.get("subject") as string,
        emailTemplate: formData.get("template") as string,
        leads: [
          {
            name: formData.get("leadName") as string,
            title: formData.get("leadTitle") as string,
            company: formData.get("leadCompany") as string,
            email: formData.get("leadEmail") as string,
          },
        ],
        contactEmail: notificationEmail,
        submittedBy: user?.email ?? undefined,
        metadata: {
          workspacePlan: profile?.plan ?? "starter",
          seats: profile?.seats,
          maxParallelRuns: profile?.max_parallel_runs,
          maxDailyCampaigns: profile?.max_daily_campaigns,
          isFounder: profile?.is_founder ?? false,
          userId: user?.id,
        },
      };

      const response = await runCampaign(payload);

      setResult(response);

      if (user && supabase) {
        const failedCount = response.failed ?? Math.max(response.totalLeads - response.successful, 0);
        await supabase.from("campaign_runs").insert({
          user_id: user.id,
          campaign_name: payload.campaignName,
          email_subject: payload.emailSubject,
          email_template: payload.emailTemplate,
          lead: payload.leads[0],
          status: "completed",
          successful: response.successful,
          failed: failedCount,
          total_leads: response.totalLeads,
          remote_campaign_id: response.runId,
          metadata: { source: "lovable-ui" },
        });
      }

      setLastNotificationEmail(notificationEmail);
      setFallbackNotice(fallbackGenerated ? `Using temporary alias ${notificationEmail}` : null);
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const pollHealth = async () => {
      const healthy = await checkBackendHealth();
      if (mounted) setIsHealthy(healthy);
    };

    pollHealth();
    const interval = setInterval(pollHealth, 20000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-3xl mx-auto px-4 py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">PipelineAI Console</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Start a Smart Campaign</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${isHealthy ? "bg-emerald-500/15 text-emerald-700" : "bg-red-500/15 text-red-600"}`}>
              {isHealthy ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />} {isHealthy ? "Backend online" : "Backend offline"}
            </div>
            {profile && (
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Crown className="h-4 w-4" /> {profile.role === "founder" ? "Founder access" : profile.plan}
              </div>
            )}
          </div>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Create a pilot campaign</CardTitle>
            <CardDescription>Send a templated run to the ngrok-hosted OpenClaw worker.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="campaign-name" className="text-sm font-medium text-foreground/80">
                    Campaign Name
                  </label>
                  <Input id="campaign-name" name="name" placeholder="Product Hunt Relaunch" required />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="campaign-subject" className="text-sm font-medium text-foreground/80">
                    Email Subject
                  </label>
                  <Input id="campaign-subject" name="subject" placeholder="Quick idea for {{first_name}}" required />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="campaign-template" className="text-sm font-medium text-foreground/80">
                    Email Template
                  </label>
                  <Textarea
                    id="campaign-template"
                    name="template"
                    rows={5}
                    placeholder="Hi {{first_name}}, we built PipeLineAI to..."
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-foreground/80">
                    Notification Email
                  </label>
                  <Input
                    id="contact-email"
                    value={contactEmail}
                    onChange={(event) => setContactEmail(event.target.value)}
                    placeholder="you@company.com"
                  />
                  {!contactEmail.trim() && (
                    <div className="inline-flex items-center gap-2 rounded-md border border-amber-300/80 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      <Sparkles className="h-4 w-4" />
                      We will send confirmations to a temporary alias if you leave this blank.
                    </div>
                  )}
                </div>
                <h3 className="text-base font-semibold mb-3">Test Lead</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="lead-name" className="text-sm font-medium text-foreground/80">
                      Lead Name
                    </label>
                    <Input id="lead-name" name="leadName" placeholder={defaultLead.leadName} required />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="lead-title" className="text-sm font-medium text-foreground/80">
                      Title
                    </label>
                    <Input id="lead-title" name="leadTitle" placeholder={defaultLead.leadTitle} required />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="lead-company" className="text-sm font-medium text-foreground/80">
                      Company
                    </label>
                    <Input id="lead-company" name="leadCompany" placeholder={defaultLead.leadCompany} required />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="lead-email" className="text-sm font-medium text-foreground/80">
                      Email
                    </label>
                    <Input id="lead-email" type="email" name="leadEmail" placeholder={defaultLead.leadEmail} required />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? "Processing..." : "Start Campaign"}
              </Button>
              {lastNotificationEmail && (
                <p className="text-xs text-muted-foreground text-center">Notifications will go to {lastNotificationEmail}.</p>
              )}
            </form>

            {fallbackNotice && !error && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900 flex items-start gap-2">
                <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Temporary contact</p>
                  <p>{fallbackNotice}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Submission failed</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

              {result && (
                <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Campaign complete</p>
                    <p>
                      {result.successful} out of {result.totalLeads} emails generated.
                    </p>
                    {result.details && (
                      <pre className="mt-2 rounded bg-white/80 p-3 text-xs text-foreground overflow-x-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default CampaignPage;
