import { Target, TrendingUp, Repeat, Bot } from "lucide-react";

const steps = [
  {
    icon: Target,
    step: "01",
    title: "Define Your ICP",
    description: "Tell us who your ideal customer is. Industry, role, company size — we handle the rest.",
  },
  {
    icon: Bot,
    step: "02",
    title: "Deploy AI Agents",
    description: "Our AI agents research each prospect and craft hyper-personalized outreach sequences.",
  },
  {
    icon: Repeat,
    step: "03",
    title: "Engage & Nurture",
    description: "Automated follow-ups, multi-channel sequences, and smart replies keep conversations going.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Book Meetings",
    description: "Qualified meetings land directly in your calendar. You just show up and close.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
            From Zero to Booked in <span className="text-primary">4 Simple Steps</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Step {step.step}</span>
              <h3 className="text-lg font-bold text-foreground mt-2 mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
