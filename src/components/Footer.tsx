import { Link } from "react-router-dom";
import logo from "@/assets/pipeline-logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img alt="Pipeline AI" className="w-8 h-8 object-contain" src="/lovable-uploads/a60ba2b0-9fb3-44c0-87f8-2e798c4ceb98.png" />
              <span className="text-base font-bold text-foreground">Pipeline AI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered sales automation built on OpenClaw. Books meetings on autopilot.
            </p>
          </div>

          {[
          { title: "Product", links: ["Features", "How It Works", "Pricing", "Integrations"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] }].
          map((col) =>
          <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) =>
              <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Pipeline AI. Built on OpenClaw. All rights reserved.</p>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) =>
            <a key={social} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{social}</a>
            )}
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;