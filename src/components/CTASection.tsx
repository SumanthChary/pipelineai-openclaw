import { ArrowRight, CreditCard, Clock, CalendarCheck } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/90 to-red-light/80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(0_78%_55%/0.3),transparent_70%)]" />
          <div className="relative z-10 text-center py-20 px-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs font-semibold text-primary-foreground/90 tracking-wider uppercase">Powered by OpenClaw</span>
            </div>

            <h2 className="text-3xl lg:text-5xl font-extrabold text-primary-foreground mb-4 max-w-2xl mx-auto leading-tight">
              Ready to Automate Your Outbound?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Let AI agents handle prospecting and scheduling so your team can focus on closing deals.
            </p>

            <a href="#" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary-foreground text-primary px-8 text-sm font-semibold hover:bg-primary-foreground/90 transition-colors mb-8">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </a>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-4">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <CreditCard className="w-4 h-4" /><span className="text-sm">No credit card</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Clock className="w-4 h-4" /><span className="text-sm">Setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <CalendarCheck className="w-4 h-4" /><span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
