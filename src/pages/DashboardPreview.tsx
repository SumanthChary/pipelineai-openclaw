import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrendingUp, Users, Mail, Calendar, BarChart3, Bot, ArrowUpRight, Clock } from "lucide-react";

const recentActivity = [
  { agent: "Agent Alpha", action: "Sent personalized email to", target: "James K. at Stripe", time: "2 min ago", status: "sent" },
  { agent: "Agent Alpha", action: "Got reply from", target: "Maria L. at Notion", time: "15 min ago", status: "reply" },
  { agent: "Agent Beta", action: "Booked meeting with", target: "Alex R. at Linear", time: "1 hr ago", status: "booked" },
  { agent: "Agent Alpha", action: "Follow-up sent to", target: "Chris P. at Vercel", time: "2 hrs ago", status: "sent" },
  { agent: "Agent Beta", action: "Lead qualified:", target: "Dana W. at Figma", time: "3 hrs ago", status: "qualified" },
];

const DashboardPreview = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-foreground mb-1">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of your OpenClaw agents and pipeline performance.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Mail, label: "Emails Sent", value: "1,247", change: "+12%", period: "this month" },
              { icon: Users, label: "Leads Engaged", value: "389", change: "+8%", period: "this month" },
              { icon: Calendar, label: "Meetings Booked", value: "24", change: "+15%", period: "this month" },
              { icon: BarChart3, label: "Reply Rate", value: "11.4%", change: "+2.1%", period: "vs last month" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-green-light flex items-center gap-0.5">
                    {stat.change} <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label} · {stat.period}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Pipeline Growth</h3>
                  <p className="text-xs text-muted-foreground">Emails, replies, and meetings over time</p>
                </div>
                <span className="text-xs text-muted-foreground border border-border rounded-md px-2 py-1">Last 30 Days</span>
              </div>
              <div className="h-48 relative">
                <svg viewBox="0 0 500 150" className="w-full h-full" preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[0, 37.5, 75, 112.5, 150].map((y) => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="hsl(214 32% 91%)" strokeWidth="0.5" />
                  ))}
                  {/* Emails line */}
                  <path
                    d="M0 120 C60 115, 100 105, 150 95 C200 85, 250 75, 300 60 C350 50, 400 45, 450 35 L500 30"
                    fill="none" stroke="hsl(221 83% 53%)" strokeWidth="2"
                  />
                  <path
                    d="M0 120 C60 115, 100 105, 150 95 C200 85, 250 75, 300 60 C350 50, 400 45, 450 35 L500 30 L500 150 L0 150Z"
                    fill="hsl(221 83% 53% / 0.06)"
                  />
                  {/* Replies line */}
                  <path
                    d="M0 140 C60 138, 100 132, 150 125 C200 120, 250 110, 300 105 C350 100, 400 95, 450 88 L500 85"
                    fill="none" stroke="hsl(152 69% 31%)" strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 rounded bg-primary" />
                  <span className="text-xs text-muted-foreground">Emails Sent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 rounded bg-green-accent" />
                  <span className="text-xs text-muted-foreground">Replies</span>
                </div>
              </div>
            </div>

            {/* Active Agents */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Active Agents</h3>
              <div className="space-y-4">
                {[
                  { name: "Agent Alpha", status: "Running", emails: 847, meetings: 16 },
                  { name: "Agent Beta", status: "Running", emails: 400, meetings: 8 },
                ].map((agent) => (
                  <div key={agent.name} className="bg-secondary rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">{agent.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-green-light uppercase tracking-wider">{agent.status}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{agent.emails} emails sent</span>
                      <span>{agent.meetings} meetings</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 bg-card rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === "reply" ? "bg-green-light" :
                      item.status === "booked" ? "bg-primary" :
                      item.status === "qualified" ? "bg-blue-light" :
                      "bg-muted-foreground"
                    }`} />
                    <span className="text-sm text-foreground">
                      <span className="font-medium">{item.agent}</span> {item.action} <span className="font-medium">{item.target}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPreview;
