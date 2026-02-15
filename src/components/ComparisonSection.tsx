import { Check, X } from "lucide-react";

const features = [
  "AI-Personalized Outreach", "Multi-Channel Sequences", "Automated Meeting Booking",
  "Built-in Email Warmup", "Real-Time Analytics", "Open-Source Foundation", "CRM Integration", "Dedicated Support",
];

const tools = [
  { name: "Pipeline AI", highlight: true, values: [true, true, true, true, true, true, true, true] },
  { name: "Outreach.io", highlight: false, values: [false, true, false, true, true, false, true, false] },
  { name: "Apollo", highlight: false, values: [false, true, false, false, true, false, true, false] },
];

const ComparisonSection = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Comparison</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
            Why Teams Choose <span className="text-primary">Pipeline AI</span>
          </h2>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-semibold text-foreground p-4 w-1/4">Features</th>
                  {tools.map((tool) => (
                    <th key={tool.name} className={`text-center text-sm font-semibold p-4 ${tool.highlight ? "text-primary" : "text-foreground"}`}>
                      {tool.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={feature} className={i < features.length - 1 ? "border-b border-border" : ""}>
                    <td className="text-sm text-foreground p-4">{feature}</td>
                    {tools.map((tool) => (
                      <td key={tool.name} className="text-center p-4">
                        {tool.values[i] ? (
                          <div className={`w-6 h-6 rounded-full inline-flex items-center justify-center ${tool.highlight ? "bg-primary/10" : "bg-secondary"}`}>
                            <Check className={`w-3.5 h-3.5 ${tool.highlight ? "text-primary" : "text-accent"}`} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-secondary inline-flex items-center justify-center">
                            <X className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
