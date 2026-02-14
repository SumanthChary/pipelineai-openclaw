import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does PipelineAI's AI outreach work?",
    answer: "Our AI agents research each prospect individually — analyzing their company, role, recent activity, and pain points — then craft hyper-personalized emails that feel hand-written. No templates, no generic messaging.",
  },
  {
    question: "How long does it take to see results?",
    answer: "Most teams start seeing qualified meetings booked within the first 2 weeks. By the end of month one, our average client has 30+ meetings on their calendar.",
  },
  {
    question: "Do I need technical skills to get started?",
    answer: "Not at all. Setup takes about 5 minutes. Connect your email, define your ideal customer profile, and let our AI do the rest. We also provide white-glove onboarding for Growth and Enterprise plans.",
  },
  {
    question: "Will this hurt my email deliverability?",
    answer: "No. We include a built-in email warmup engine, automatic domain rotation, and compliance monitoring to keep your sender reputation pristine and stay out of spam folders.",
  },
  {
    question: "Can I integrate PipelineAI with my existing CRM?",
    answer: "Yes. We integrate natively with Salesforce, HubSpot, Pipedrive, and other major CRMs. All meetings, replies, and pipeline data sync automatically.",
  },
  {
    question: "What happens when I hit my plan limit?",
    answer: "We'll notify you before you hit your limit. You can upgrade at any time, and unused credits roll over to the next month.",
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
