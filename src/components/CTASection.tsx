import { CreditCard, Clock, CalendarCheck, Shield } from "lucide-react";
import CampaignRequestForm from "@/components/CampaignRequestForm";

const CTASection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/90 to-red-light/80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(0_78%_55%/0.3),transparent_70%)]" />
          <div className="relative z-10 py-16 px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="text-primary-foreground">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 px-4 py-1.5 mb-6">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-xs font-semibold tracking-wider uppercase">Powered by OpenClaw</span>
                </div>

                <h2 className="text-3xl lg:text-5xl font-extrabold mb-5 leading-tight">
                  Drop campaigns straight into your Autonomous SDR
                </h2>

                <p className="text-lg text-primary-foreground/85 max-w-2xl mb-6">
                  Use the form to push structured JSON requests into your <span className="font-semibold">openclaw-bridge</span> folder.
                  Your desktop worker listens, launches the workflow, and hands back meetings within minutes.
                </p>

                <div className="grid gap-4 text-left text-primary-foreground/90">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-sm font-semibold tracking-wide uppercase">Air-gapped safety</p>
                      <p className="text-base text-primary-foreground/85">Files originate locally and never touch a public cloud.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-sm font-semibold tracking-wide uppercase">2-5 minute turnaround</p>
                      <p className="text-base text-primary-foreground/85">OpenClaw ingests your payload and immediately starts the outbound sequence.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarCheck className="mt-0.5 h-5 w-5" />
                    <div>
                      <p className="text-sm font-semibold tracking-wide uppercase">Human-ready output</p>
                      <p className="text-base text-primary-foreground/85">Every run produces synced CRM notes and booked meetings.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 mt-8 text-sm">
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <CreditCard className="w-4 h-4" />
                    <span>No credit card needed</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <Clock className="w-4 h-4" />
                    <span>Set up once, reuse forever</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <CalendarCheck className="w-4 h-4" />
                    <span>Results stream in continuously</span>
                  </div>
                </div>
              </div>

              <CampaignRequestForm />
            </div>
          </div>
        </div>

        {/* Trust avatars */}
        <div className="flex flex-col items-center mt-12">
          <div className="flex -space-x-2 mb-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">{String.fromCharCode(64 + i)}</span>
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
              <span className="text-xs font-bold text-primary">+2k</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Trusted by Industry Leaders Worldwide</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
