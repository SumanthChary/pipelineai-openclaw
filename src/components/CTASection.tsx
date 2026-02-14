import { ArrowRight, CreditCard, Clock, CalendarCheck } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(213 94% 68%))" }}>
          <div className="relative z-10 text-center py-20 px-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-light" />
              <span className="text-xs font-semibold text-primary-foreground/90 tracking-wider uppercase">Join 2,847 Sales Teams</span>
            </div>

            <h2 className="text-3xl lg:text-5xl font-extrabold text-primary-foreground mb-4 max-w-2xl mx-auto leading-tight">
              Ready to 10x Your Sales Meetings?
            </h2>

            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Automate your outbound, scale your pipeline, and close more deals without increasing your headcount. Join the future of autonomous sales.
            </p>

            <a href="#" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary-foreground text-primary px-8 text-sm font-semibold hover:bg-primary-foreground/90 transition-colors mb-8">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </a>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-4">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">No credit card</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <CalendarCheck className="w-4 h-4" />
                <span className="text-sm">Cancel anytime</span>
              </div>
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
