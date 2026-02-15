import { Link2 } from "lucide-react";

const integrations = [
  { name: "Salesforce", category: "CRM" },
  { name: "HubSpot", category: "CRM" },
  { name: "Pipedrive", category: "CRM" },
  { name: "Slack", category: "Communication" },
  { name: "Google Calendar", category: "Scheduling" },
  { name: "Outlook", category: "Email" },
  { name: "Gmail", category: "Email" },
  { name: "Zapier", category: "Automation" },
];

const IntegrationsSection = () => {
  return (
    <section id="integrations" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Integrations</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
            Works With Your <span className="text-primary">Existing Stack</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Connect OpenClaw to the tools your team already uses.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="bg-card rounded-xl border border-border p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Link2 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{integration.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{integration.category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
