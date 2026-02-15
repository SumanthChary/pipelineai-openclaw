import { Menu, X, LogOut } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/pipeline-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const founderBadge = profile?.role === "founder" ? "Founder access" : undefined;
  const avatarSeed = (profile?.email ?? user?.email ?? "pipelineai").toLowerCase();
  const avatarInitials = useMemo(() => {
    const segments = avatarSeed
      .replace(/@.*$/, "")
      .split(/[^a-z0-9]+/i)
      .filter(Boolean);
    const letters = (segments.length ? segments : [avatarSeed])
      .slice(0, 2)
      .map((segment) => segment.charAt(0).toUpperCase());
    return letters.join("") || "PI";
  }, [avatarSeed]);
  const dicebearUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}`;
  const metadataAvatar = (profile?.metadata && typeof profile.metadata === "object" && "avatar_url" in profile.metadata
    ? (profile.metadata.avatar_url as string | undefined)
    : undefined) || (user?.user_metadata?.avatar_url as string | undefined);
  const avatarUrl = metadataAvatar || dicebearUrl;

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
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Dashboard
              </Link>
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-foreground">{profile?.email ?? user.email}</span>
                <span className="text-[10px] uppercase tracking-widest text-accent">{founderBadge || profile?.plan || "Member"}</span>
              </div>
              <Link to="/profile" className="hidden sm:inline-flex">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={avatarUrl} alt="User avatar" />
                  <AvatarFallback>{avatarInitials}</AvatarFallback>
                </Avatar>
              </Link>
              <button
                onClick={() => signOut()}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >

                <LogOut className="w-4 h-4 mr-1" />
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Log in
            </Link>
          )}
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

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Product</a>
          <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Solutions</a>
          <a href="#pricing" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Pricing</a>
          <a href="#integrations" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Integrations</a>
          <a href="#faq" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Resources</a>
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-3 rounded-lg border border-border px-4 py-2" onClick={() => setMobileOpen(false)}>
                <Avatar className="h-9 w-9 border border-border/30">
                  <AvatarImage src={avatarUrl} alt="User avatar" />
                  <AvatarFallback>{avatarInitials}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{profile?.email ?? user.email}</p>
                  <p className="text-[11px] uppercase tracking-widest text-accent">{founderBadge || profile?.plan || "Member"}</p>
                </div>
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signOut();
                }}
                className="w-full rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="block text-sm font-semibold text-foreground" onClick={() => setMobileOpen(false)}>
              Log in
            </Link>
          )}
          <Link
          to="/campaign"
          className="block rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
          onClick={() => setMobileOpen(false)}>

            Launch Campaign
          </Link>
        </div>
      )}
    </nav>
  );

};

export default Navbar;