import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$97",
    period: "/month",
    description: "Perfect for solo founders and small teams getting started with outbound.",
    features: [
      "500 AI-personalized emails/mo",
      "1 AI Sales Agent",
      "Basic analytics",
      "Email warmup included",
      "CRM integration",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$297",
    period: "/month",
    description: "For growing teams ready to scale their outbound pipeline.",
    features: [
      "2,500 AI-personalized emails/mo",
      "3 AI Sales Agents",
      "Advanced analytics & reports",
      "Multi-channel sequences",
      "Priority support",
      "Custom ICP targeting",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large teams with custom needs and high-volume outreach.",
    features: [
      "Unlimited emails",
      "Unlimited AI Agents",
      "Dedicated account manager",
      "Custom integrations",
      "SLA & compliance",
      "White-glove onboarding",
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
            Choose Your <span className="text-primary">Growth Plan</span>
          </h2>
          <p className="text-muted-foreground text-lg">Start free. Upgrade when you're ready to scale.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border relative ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground border-primary shadow-xl scale-105"
                  : "bg-card text-foreground border-border"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <h3 className={`text-lg font-bold mb-2 ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                {plan.period && <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{plan.period}</span>}
              </div>
              <p className={`text-sm mb-6 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold transition-colors w-full ${
                  plan.highlighted
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
