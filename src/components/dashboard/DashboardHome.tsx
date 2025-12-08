import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Users, 
  Bot, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  Plus
} from "lucide-react";

const stats = [
  { 
    name: "Total Conversations", 
    value: "12,847", 
    change: "+12%", 
    trend: "up",
    icon: MessageSquare,
    color: "text-primary"
  },
  { 
    name: "Active Leads", 
    value: "3,421", 
    change: "+8%", 
    trend: "up",
    icon: Users,
    color: "text-success"
  },
  { 
    name: "AI Messages", 
    value: "89,234", 
    change: "+24%", 
    trend: "up",
    icon: Bot,
    color: "text-accent"
  },
  { 
    name: "Conversion Rate", 
    value: "24.8%", 
    change: "-2%", 
    trend: "down",
    icon: TrendingUp,
    color: "text-warning"
  },
];

const recentConversations = [
  { 
    name: "Sarah Johnson", 
    message: "I'd like to know more about your pricing...",
    channel: "WhatsApp",
    time: "2m ago",
    status: "active"
  },
  { 
    name: "Michael Chen", 
    message: "Thanks for the quick response!",
    channel: "Instagram",
    time: "15m ago",
    status: "resolved"
  },
  { 
    name: "Emma Wilson", 
    message: "Can I schedule a demo for tomorrow?",
    channel: "Email",
    time: "32m ago",
    status: "pending"
  },
  { 
    name: "David Brown", 
    message: "The AI agent was super helpful!",
    channel: "Telegram",
    time: "1h ago",
    status: "resolved"
  },
];

const activeAgents = [
  { name: "Sales Closer", conversations: 234, accuracy: "94%", status: "active" },
  { name: "Support Agent", conversations: 567, accuracy: "97%", status: "active" },
  { name: "Lead Qualifier", conversations: 189, accuracy: "91%", status: "active" },
];

export function DashboardHome() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Last updated: Just now
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} variant="gradient">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <Badge 
                  variant={stat.trend === 'up' ? 'success' : 'destructive'}
                  className="gap-1"
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Conversations */}
        <Card variant="gradient" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Conversations</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConversations.map((conv, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                    {conv.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{conv.name}</span>
                      <Badge variant="channel" className="text-[10px]">{conv.channel}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.message}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{conv.time}</div>
                    <Badge 
                      variant={conv.status === 'active' ? 'success' : conv.status === 'pending' ? 'warning' : 'secondary'}
                      className="text-[10px] mt-1"
                    >
                      {conv.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Agents */}
        <Card variant="gradient">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Active AI Agents</CardTitle>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAgents.map((agent, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{agent.name}</span>
                      <Badge variant="online" className="text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-success mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{agent.conversations} convos</span>
                      <span>{agent.accuracy} accuracy</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4 gap-2">
              <Zap className="w-4 h-4" />
              Create New Agent
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
