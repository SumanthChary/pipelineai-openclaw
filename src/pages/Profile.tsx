import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { ShieldCheck, Crown, Mail, Users } from "lucide-react";

const ProfilePage = () => {
  const { user, profile, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const email = (profile?.email ?? user.email ?? "").toLowerCase();
  const avatarSeed = email || "pipelineai";
  const avatarInitials = email
    ? email
        .replace(/@.*$/, "")
        .split(/[^a-z0-9]+/i)
        .filter(Boolean)
        .slice(0, 2)
        .map((segment) => segment.charAt(0).toUpperCase())
        .join("") || "PI"
    : "PI";
  const metadataAvatar =
    (profile?.metadata && typeof profile.metadata === "object" && "avatar_url" in profile.metadata
      ? (profile.metadata.avatar_url as string | undefined)
      : undefined) || (user.user_metadata?.avatar_url as string | undefined);
  const avatarUrl = metadataAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}`;

  const planStats = [
    { label: "Plan", value: profile?.plan ?? "starter" },
    { label: "Seats", value: profile?.seats ?? 3 },
    { label: "Parallel runs", value: profile?.max_parallel_runs ?? 1 },
    { label: "Daily campaigns", value: profile?.max_daily_campaigns ?? 3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <Card>
            <CardHeader className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border border-border">
                  <AvatarImage src={avatarUrl} alt="Profile avatar" />
                  <AvatarFallback className="text-lg font-bold">{avatarInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-foreground">{profile?.email ?? user.email}</CardTitle>
                  <CardDescription>
                    {profile?.is_founder ? "Founder workspace" : "Pipeline AI workspace"}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link to="/campaign">Launch campaign</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Plan</p>
                  <p className="text-2xl font-semibold text-foreground mt-1 capitalize">{profile?.plan ?? "starter"}</p>
                  {profile?.is_founder ? (
                    <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-primary">
                      <Crown className="h-4 w-4" /> Founder unlimited access
                    </span>
                  ) : (
                    <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <ShieldCheck className="h-4 w-4" /> Secure workspace
                    </span>
                  )}
                </div>
                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Account</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {profile?.email ?? user.email}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4" /> Seats: {profile?.seats ?? 3}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {planStats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                    <p className="text-xl font-semibold text-foreground mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => signOut()}>
                  Sign out
                </Button>
                <Button variant="ghost" asChild>
                  <a href="mailto:support@pipeline.ai">Contact support</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
