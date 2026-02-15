import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  Calendar,
  Clock,
  Loader2,
  Mail,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

type CampaignRun = {
  id: string;
  campaign_name: string;
  successful: number;
  failed: number;
  total_leads: number;
  status: string;
  created_at: string;
  lead: { name?: string; company?: string } | null;
};

const statusBadge: Record<CampaignRun["status"] | string, { label: string; dotClass: string }> = {
  success: { label: "Completed", dotClass: "bg-primary" },
  running: { label: "Running", dotClass: "bg-accent" },
  queued: { label: "Queued", dotClass: "bg-muted-foreground" },
  failed: { label: "Failed", dotClass: "bg-destructive" },
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} · ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const DashboardPreview = () => {
  const { user, profile } = useAuth();
  const planLabel = profile?.is_founder ? "Founder Unlimited" : profile?.plan ?? "Free Plan";

  const {
    data: runs = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<CampaignRun[]>({
    queryKey: ["campaign-runs", user?.id, profile?.is_founder],
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("campaign_runs")
        .select("id,campaign_name,successful,failed,total_leads,status,created_at,lead")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(profile?.is_founder ? 100 : 25);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
    refetchInterval: 30_000,
  });

  const aggregate = useMemo(
    () =>
      runs.reduce(
        (acc, run) => {
          acc.totalRuns += 1;
          acc.totalLeads += run.total_leads;
          acc.totalSuccess += run.successful;
          acc.totalFailed += run.failed;
          return acc;
        },
        { totalRuns: 0, totalLeads: 0, totalSuccess: 0, totalFailed: 0 },
      ),
    [runs],
  );

  const successRate = aggregate.totalLeads ? (aggregate.totalSuccess / aggregate.totalLeads) * 100 : 0;
  const lastUpdated = runs[0]?.created_at ? formatTime(runs[0].created_at) : null;
  const recentActivity = runs.slice(0, 6);

  const timeline = useMemo(() => {
    const windowed = runs.slice(0, 8).reverse();
    const maxLeads = Math.max(...windowed.map((run) => run.total_leads), 1);
    return windowed.map((run, idx) => {
      const denominator = Math.max(windowed.length - 1, 1);
      const successRatio = run.successful / maxLeads;
      const totalRatio = run.total_leads / maxLeads;
      return {
        x: (idx / denominator) * 500,
        ySuccess: 150 - successRatio * 120,
        yTotal: 150 - totalRatio * 120,
        label: run.campaign_name,
        success: run.successful,
        total: run.total_leads,
      };
    });
  }, [runs]);

  const metrics = [
    {
      icon: Mail,
      label: "Emails Shipped",
      value: aggregate.totalSuccess.toLocaleString(),
      change: runs[0]?.successful ? `+${runs[0].successful}` : "fresh",
      period: "latest run",
    },
    {
      icon: Users,
      label: "Leads Parsed",
      value: aggregate.totalLeads.toLocaleString(),
      change: runs[0]?.total_leads ? `+${runs[0].total_leads}` : "pending",
      period: "latest batch",
    },
    {
      icon: Calendar,
      label: "Runs Logged",
      value: aggregate.totalRuns.toLocaleString(),
      change: planLabel,
      period: "plan tier",
    },
    {
      icon: BarChart3,
      label: "Success Rate",
      value: `${successRate.toFixed(1)}%`,
      change: aggregate.totalFailed ? `${aggregate.totalFailed} failed` : "clean streak",
      period: "all time",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Pipeline Control</p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black text-foreground">Live Campaign Dashboard</h1>
              {lastUpdated && (
                <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
                  Updated {lastUpdated}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Monitor Supabase-backed campaign runs, track deliverability, and review the agents powering your outbound motion.
            </p>
          </div>

          {!user && (
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">Authentication Required</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sign in to Supabase to unlock live campaign telemetry, run history, and founder-only controls.
              </p>
              <a href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Go to login <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          )}

          {user && (
            <>
              {isError && (
                <div className="bg-destructive/10 border border-destructive/40 text-destructive rounded-xl p-4 text-sm mb-6">
                  Failed to load Supabase metrics. Please verify your session and try again.
                  <button type="button" className="ml-4 underline" onClick={() => refetch()}>
                    Retry
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((stat) => (
                  <div key={stat.label} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-widest">
                        {stat.period}
                      </span>
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {stat.change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Signal Curve</h3>
                      <p className="text-xs text-muted-foreground">Successful personalized emails per run</p>
                    </div>
                    <span className="text-xs text-muted-foreground border border-border rounded-md px-2 py-1">Last {timeline.length} runs</span>
                  </div>
                  <div className="h-48 relative">
                    {timeline.length > 1 ? (
                      <svg viewBox="0 0 500 150" className="w-full h-full" preserveAspectRatio="none">
                        {[0, 37.5, 75, 112.5, 150].map((y) => (
                          <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="hsl(210 20% 18%)" strokeWidth="0.4" />
                        ))}
                        <polyline
                          points={timeline.map((point) => `${point.x},${point.yTotal}`).join(" ")}
                          fill="none"
                          stroke="hsl(174 60% 45%)"
                          strokeWidth="1.5"
                          strokeDasharray="6 4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points={timeline.map((point) => `${point.x},${point.ySuccess}`).join(" ")}
                          fill="none"
                          stroke="hsl(0 75% 55%)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                        Not enough runs to chart yet.
                      </div>
                    )}
                  </div>
                  <div className="flex gap-6 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-1 rounded-full bg-primary" /> Successful emails
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-1 rounded-full bg-accent" /> Total leads processed
                    </span>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">Agent Footprint</h3>
                    <span className="text-xs text-muted-foreground">{planLabel}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-secondary rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">Pipeline Claw</span>
                        </div>
                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Core</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {aggregate.totalLeads.toLocaleString()} leads parsed · {aggregate.totalRuns} runs
                      </div>
                    </div>
                    <div className="bg-secondary/70 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Founder Safety Net</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Unlimited throughput unlocked for {profile?.email ?? user?.email ?? "founder"}. Campaigns bypass rate limits and log extended metadata.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
                  {isLoading && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Syncing
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {recentActivity.length === 0 && !isLoading && (
                    <p className="text-sm text-muted-foreground">No runs logged yet. Ship a campaign to populate this timeline.</p>
                  )}
                  {recentActivity.map((run) => {
                    const meta = statusBadge[run.status] ?? statusBadge.queued;
                    return (
                      <div key={run.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                            <span className="text-sm font-semibold text-foreground">{run.campaign_name}</span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{meta.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {run.successful}/{run.total_leads} personalized emails · {run.failed} failed · {run.lead?.company ?? run.lead?.name ?? "lead"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(run.created_at)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPreview;
