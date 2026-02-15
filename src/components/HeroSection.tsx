import { ArrowRight, Play, TrendingUp } from "lucide-react";
import logo from "@/assets/pipeline-logo.png";

const HeroSection = () => {
  return (
    <section className="pt-28 pb-16 bg-background relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs font-semibold tracking-wider text-accent uppercase">Powered by OpenClaw AI</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground mb-6">
              Your AI Sales<br />
              Agent on<br />
              <span className="text-primary">Autopilot.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Deploy autonomous AI agents powered by OpenClaw to handle personalized outreach, lead qualification, and meeting scheduling — all from one platform.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <a href="#" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-7 text-sm font-semibold text-foreground hover:bg-border transition-colors">
                <Play className="w-4 h-4" fill="currentColor" /> Watch Demo
              </a>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">Trusted by Growing Teams</p>
              <div className="flex items-center gap-6">
                {["Acme", "Bolt", "Nova", "Apex"].map((name) => (
                  <div key={name} className="w-16 h-8 rounded bg-secondary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-muted-foreground">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Dashboard mockup */}
          <div className="relative">
            <div className="bg-card rounded-2xl shadow-2xl border border-border p-6 relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                  <div className="w-3 h-3 rounded-full bg-green-light/60" />
                </div>
                <div className="flex-1 text-right">
                  <span className="text-xs text-muted-foreground">app.pipelineai.co/dashboard</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-secondary rounded-xl p-4">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Meetings Booked</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-foreground">24</p>
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-xs text-accent font-medium mt-1">+8% vs last month</p>
                </div>
                <div className="bg-secondary rounded-xl p-4">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Reply Rate</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-foreground">12%</p>
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-xs text-accent font-medium mt-1">Above industry avg</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">Pipeline Growth</p>
                  <span className="text-xs text-muted-foreground border border-border rounded-md px-2 py-1">Last 30 Days</span>
                </div>
                <div className="h-32 relative">
                  <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                    <path d="M0 80 C50 75, 80 70, 120 65 C160 60, 180 55, 220 40 C260 25, 300 30, 340 15 C360 10, 380 5, 400 8" fill="none" stroke="hsl(0 78% 55%)" strokeWidth="2.5" />
                    <path d="M0 80 C50 75, 80 70, 120 65 C160 60, 180 55, 220 40 C260 25, 300 30, 340 15 C360 10, 380 5, 400 8 L400 100 L0 100Z" fill="hsl(0 78% 55% / 0.08)" />
                    <circle cx="120" cy="65" r="4" fill="hsl(0 78% 55%)" />
                    <circle cx="220" cy="40" r="4" fill="hsl(0 78% 55%)" />
                    <circle cx="340" cy="15" r="4" fill="hsl(0 78% 55%)" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between bg-secondary rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="Pipeline AI" className="w-10 h-10 rounded-full object-contain bg-card p-1" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Pipeline Agent</p>
                    <p className="text-xs text-muted-foreground">Drafting outreach to leads...</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
