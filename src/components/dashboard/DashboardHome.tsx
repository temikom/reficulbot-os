import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Users, 
  Bot, 
  TrendingUp,
  Clock,
  Zap,
  Plus,
  Inbox,
  Workflow,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const emptyStats = [
  { 
    name: "Total Conversations", 
    value: "0", 
    icon: MessageSquare,
    color: "text-primary",
    description: "Start a conversation"
  },
  { 
    name: "Active Leads", 
    value: "0", 
    icon: Users,
    color: "text-success",
    description: "Import or add leads"
  },
  { 
    name: "AI Messages", 
    value: "0", 
    icon: Bot,
    color: "text-accent",
    description: "Configure AI agents"
  },
  { 
    name: "Conversion Rate", 
    value: "--", 
    icon: TrendingUp,
    color: "text-warning",
    description: "Tracking enabled"
  },
];

const quickActions = [
  { 
    title: "Create AI Agent",
    description: "Build an intelligent bot to handle conversations",
    icon: Bot,
    href: "/dashboard/agents",
    color: "bg-primary/10 text-primary"
  },
  { 
    title: "Build Automation",
    description: "Set up trigger-based workflows",
    icon: Zap,
    href: "/dashboard/automations",
    color: "bg-accent/10 text-accent"
  },
  { 
    title: "Design Flow",
    description: "Create visual conversation flows",
    icon: Workflow,
    href: "/dashboard/flows",
    color: "bg-success/10 text-success"
  },
  { 
    title: "Import Contacts",
    description: "Add leads and customers to CRM",
    icon: Users,
    href: "/dashboard/crm",
    color: "bg-warning/10 text-warning"
  },
];

export function DashboardHome() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to ReficulBot. Let's get started.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Last updated: Just now
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {emptyStats.map((stat) => (
          <Card key={stat.name} variant="gradient">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <div className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/30 transition-all cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Conversations - Empty State */}
        <Card variant="gradient" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Conversations</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/inbox">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">No conversations yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                Connect a channel or embed the web chat widget to start receiving conversations.
              </p>
              <Button variant="outline" asChild>
                <Link to="/dashboard/inbox" className="gap-2">
                  Go to Inbox
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Agents - Empty State */}
        <Card variant="gradient">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">AI Agents</CardTitle>
            <Button variant="ghost" size="icon" className="w-8 h-8" asChild>
              <Link to="/dashboard/agents">
                <Plus className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <Bot className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">No agents created</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first AI agent to automate conversations.
              </p>
              <Button variant="outline" className="gap-2" asChild>
                <Link to="/dashboard/agents">
                  <Zap className="w-4 h-4" />
                  Create Agent
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}