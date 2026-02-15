const stats = [
  { value: "24+", label: "Avg Meetings Booked", sublabel: "per month per client" },
  { value: "12%", label: "Reply Rate", sublabel: "industry avg is 1-3%" },
  { value: "1.8x", label: "Pipeline Growth", sublabel: "within first 90 days" },
  { value: "92%", label: "Client Satisfaction", sublabel: "based on user surveys" },
];

const StatsSection = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Results</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground">
            Real Results From <span className="text-primary">Real Teams</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl border border-border p-8 text-center">
              <p className="text-4xl lg:text-5xl font-extrabold text-primary mb-2">{stat.value}</p>
              <p className="text-sm font-semibold text-foreground mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
