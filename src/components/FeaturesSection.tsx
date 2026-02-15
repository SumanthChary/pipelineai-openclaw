import { Mail, Users, Calendar, BarChart3, Zap, Shield } from "lucide-react";

const features = [
  { icon: Mail, title: "AI-Powered Outreach", description: "Personalized emails crafted by AI that resonate with each prospect. No generic templates." },
  { icon: Users, title: "Smart Lead Scoring", description: "Automatically identify and prioritize prospects based on engagement signals and fit criteria." },
  { icon: Calendar, title: "Automated Scheduling", description: "Meetings booked directly into your calendar. No back-and-forth, no friction." },
  { icon: BarChart3, title: "Real-Time Analytics", description: "Track every touchpoint, reply, and conversion in a unified dashboard." },
  { icon: Zap, title: "Multi-Channel Sequences", description: "Coordinate outreach across email, LinkedIn, and phone automatically." },
  { icon: Shield, title: "Deliverability Engine", description: "Built-in warmup, rotation, and compliance to protect your sender reputation." },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
            Everything You Need to <span className="text-primary">Scale Outbound</span>
          </h2>
          <p className="text-muted-foreground text-lg">One platform powered by OpenClaw to find, engage, and convert your ideal customers.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
