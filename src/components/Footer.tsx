import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-base font-bold text-primary-foreground">OpenClaw</span>
            </div>
            <p className="text-sm text-primary-foreground/50 leading-relaxed">
              Open-source AI-powered sales automation that books meetings on autopilot.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "How It Works", "Pricing", "Integrations"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Security", "GDPR"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-primary-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/40">© 2026 OpenClaw. All rights reserved.</p>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a key={social} href="#" className="text-xs text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
