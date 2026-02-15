import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does OpenClaw's AI outreach work?",
    answer: "Our AI agents research each prospect — analyzing their company, role, and recent activity — then craft personalized emails designed to start real conversations. No generic templates.",
  },
  {
    question: "How long does it take to see results?",
    answer: "Most teams start seeing qualified replies within the first 2 weeks. Results depend on your ICP, offer, and email domain health. We help optimize all three during onboarding.",
  },
  {
    question: "Do I need technical skills to get started?",
    answer: "Not at all. Setup takes about 5 minutes. Connect your email, define your ideal customer profile, and let the AI do the rest. We also provide hands-on onboarding for paid plans.",
  },
  {
    question: "Will this hurt my email deliverability?",
    answer: "No. We include a built-in email warmup engine, automatic domain rotation, and compliance monitoring to protect your sender reputation.",
  },
  {
    question: "Can I integrate OpenClaw with my existing CRM?",
    answer: "Yes. We integrate with Salesforce, HubSpot, Pipedrive, and other popular CRMs. All replies and meeting data sync automatically.",
  },
  {
    question: "Is OpenClaw open-source?",
    answer: "OpenClaw's core AI agent framework is open-source with 187K+ GitHub stars. This platform is built on top of OpenClaw, providing a managed experience for sales teams.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-secondary">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">FAQ</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-semibold text-foreground pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
