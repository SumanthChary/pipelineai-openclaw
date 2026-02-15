import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "OpenClaw helped us systematize our outbound process. We went from ad-hoc emails to a structured pipeline in under a week.",
    name: "Sarah Chen",
    role: "Head of Sales, TechFlow",
    rating: 5,
  },
  {
    quote: "The AI personalization is genuinely impressive. Our reply rates improved noticeably within the first month of using the platform.",
    name: "Marcus Rivera",
    role: "Founder, GrowthLab",
    rating: 5,
  },
  {
    quote: "As a small team, we couldn't afford dedicated SDRs. OpenClaw gave us a scalable way to do outbound without hiring.",
    name: "Priya Patel",
    role: "CEO, DataBridge",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
            What Our <span className="text-primary">Users Say</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from teams using OpenClaw to grow their pipeline.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-2xl border border-border p-8 flex flex-col">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-6 flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
