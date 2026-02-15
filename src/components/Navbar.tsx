import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/pipeline-logo.png";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const founderBadge = profile?.role === "founder" ? "Founder access" : undefined;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img alt="Pipeline AI" className="w-9 h-9 object-contain" src="/lovable-uploads/d4fe21ec-f958-4b9b-adcf-3ce127b938ba.png" />
          <span className="text-lg font-bold text-foreground">Pipeline AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Product</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#integrations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Integrations</a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Resources</a>
        </div>

        <div className="flex items-center gap-4">
          {user ?
          <>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Dashboard
              </Link>
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-foreground">{profile?.email ?? user.email}</span>
                <span className="text-[10px] uppercase tracking-widest text-accent">{founderBadge || profile?.plan || "Member"}</span>
              </div>
              <button
              onClick={() => signOut()}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground hover:text-foreground">

                <LogOut className="w-4 h-4 mr-1" />
                Sign out
              </button>
            </> :

          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Log in
            </Link>
          }
          <Link
            to="/campaign"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">

            Launch Campaign
          </Link>
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen &&
      <div className="md:hidden bg-background border-b border-border px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Product</a>
          <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Solutions</a>
          <a href="#pricing" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Pricing</a>
          <a href="#integrations" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Integrations</a>
          <a href="#faq" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Resources</a>
          {user ?
        <button
          onClick={() => {
            setMobileOpen(false);
            signOut();
          }}
          className="w-full rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground">

              Sign out
            </button> :

        <Link to="/login" className="block text-sm font-semibold text-foreground" onClick={() => setMobileOpen(false)}>
              Log in
            </Link>
        }
          <Link
          to="/campaign"
          className="block rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
          onClick={() => setMobileOpen(false)}>

            Launch Campaign
          </Link>
        </div>
      }
    </nav>);

};

export default Navbar;