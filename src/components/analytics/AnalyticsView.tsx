import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Bot,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const conversationData = [
  { name: "Mon", whatsapp: 420, instagram: 280, telegram: 120, email: 80 },
  { name: "Tue", whatsapp: 380, instagram: 320, telegram: 150, email: 90 },
  { name: "Wed", whatsapp: 520, instagram: 290, telegram: 180, email: 110 },
  { name: "Thu", whatsapp: 490, instagram: 350, telegram: 140, email: 85 },
  { name: "Fri", whatsapp: 580, instagram: 400, telegram: 160, email: 120 },
  { name: "Sat", whatsapp: 340, instagram: 250, telegram: 100, email: 60 },
  { name: "Sun", whatsapp: 280, instagram: 220, telegram: 80, email: 45 },
];

const aiPerformanceData = [
  { name: "Mon", accuracy: 94, responseTime: 1.2, handoffs: 12 },
  { name: "Tue", accuracy: 96, responseTime: 1.1, handoffs: 8 },
  { name: "Wed", accuracy: 93, responseTime: 1.4, handoffs: 15 },
  { name: "Thu", accuracy: 97, responseTime: 1.0, handoffs: 6 },
  { name: "Fri", accuracy: 95, responseTime: 1.3, handoffs: 10 },
  { name: "Sat", accuracy: 92, responseTime: 1.5, handoffs: 18 },
  { name: "Sun", accuracy: 94, responseTime: 1.2, handoffs: 11 },
];

const channelDistribution = [
  { name: "WhatsApp", value: 45, color: "hsl(var(--success))" },
  { name: "Instagram", value: 25, color: "hsl(var(--accent))" },
  { name: "Telegram", value: 15, color: "hsl(var(--primary))" },
  { name: "Email", value: 10, color: "hsl(var(--warning))" },
  { name: "Web Chat", value: 5, color: "hsl(var(--muted-foreground))" },
];

const funnelData = [
  { stage: "Visitors", value: 10000, percentage: 100 },
  { stage: "Conversations", value: 4500, percentage: 45 },
  { stage: "Leads", value: 2200, percentage: 22 },
  { stage: "Qualified", value: 880, percentage: 8.8 },
  { stage: "Customers", value: 220, percentage: 2.2 },
];

const agentPerformance = [
  { name: "Sales Closer", conversations: 2345, accuracy: 94, satisfaction: 4.8 },
  { name: "Support Agent", conversations: 5678, accuracy: 97, satisfaction: 4.9 },
  { name: "Lead Qualifier", conversations: 1892, accuracy: 91, satisfaction: 4.6 },
  { name: "Scheduler", conversations: 456, accuracy: 89, satisfaction: 4.5 },
];

const revenueData = [
  { month: "Jul", revenue: 12000, deals: 8 },
  { month: "Aug", revenue: 18500, deals: 12 },
  { month: "Sep", revenue: 24000, deals: 15 },
  { month: "Oct", revenue: 31000, deals: 20 },
  { month: "Nov", revenue: 42000, deals: 28 },
  { month: "Dec", revenue: 38000, deals: 25 },
];

export function AnalyticsView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("7d");

  const stats = [
    {
      name: "Total Conversations",
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      icon: MessageSquare,
      color: "text-primary",
    },
    {
      name: "Active Leads",
      value: "3,421",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-success",
    },
    {
      name: "AI Accuracy",
      value: "94.5%",
      change: "+2.1%",
      trend: "up",
      icon: Bot,
      color: "text-accent",
    },
    {
      name: "Revenue",
      value: "$165,500",
      change: "+24.8%",
      trend: "up",
      icon: DollarSign,
      color: "text-success",
    },
    {
      name: "Avg Response Time",
      value: "1.2s",
      change: "-15%",
      trend: "up",
      icon: Clock,
      color: "text-warning",
    },
    {
      name: "Conversion Rate",
      value: "24.8%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "text-destructive",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track performance, measure growth, and optimize operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? "secondary" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setDateRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Custom
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} variant="gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <Badge
                  variant={stat.trend === "up" ? "success" : "destructive"}
                  className="text-xs gap-1"
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="ai">AI Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Conversations Over Time */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Conversations by Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={conversationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="whatsapp"
                        stackId="1"
                        stroke="hsl(var(--success))"
                        fill="hsl(var(--success) / 0.5)"
                        name="WhatsApp"
                      />
                      <Area
                        type="monotone"
                        dataKey="instagram"
                        stackId="1"
                        stroke="hsl(var(--accent))"
                        fill="hsl(var(--accent) / 0.5)"
                        name="Instagram"
                      />
                      <Area
                        type="monotone"
                        dataKey="telegram"
                        stackId="1"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.5)"
                        name="Telegram"
                      />
                      <Area
                        type="monotone"
                        dataKey="email"
                        stackId="1"
                        stroke="hsl(var(--warning))"
                        fill="hsl(var(--warning) / 0.5)"
                        name="Email"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Channel Distribution */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {channelDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {channelDistribution.map((channel) => (
                      <div key={channel.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: channel.color }}
                        />
                        <span className="text-sm">{channel.name}</span>
                        <span className="text-sm font-bold ml-auto">{channel.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent Performance Table */}
          <Card variant="gradient">
            <CardHeader>
              <CardTitle>AI Agent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">Agent</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Conversations</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Accuracy</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Satisfaction</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformance.map((agent) => (
                      <tr key={agent.name} className="border-b border-border">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-medium">{agent.name}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold">{agent.conversations.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge variant={agent.accuracy >= 95 ? "success" : agent.accuracy >= 90 ? "warning" : "destructive"}>
                            {agent.accuracy}%
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <span className="text-warning">★</span>
                            <span className="font-medium">{agent.satisfaction}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-primary rounded-full"
                              style={{ width: `${agent.accuracy}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-6 mt-6">
          <Card variant="gradient">
            <CardHeader>
              <CardTitle>Conversations Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="whatsapp" fill="hsl(var(--success))" name="WhatsApp" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="instagram" fill="hsl(var(--accent))" name="Instagram" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="telegram" fill="hsl(var(--primary))" name="Telegram" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="email" fill="hsl(var(--warning))" name="Email" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>AI Accuracy & Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={aiPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="accuracy"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Accuracy %"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="responseTime"
                        stroke="hsl(var(--warning))"
                        strokeWidth={2}
                        name="Response Time (s)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Human Handoffs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={aiPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="handoffs" fill="hsl(var(--destructive))" name="Handoffs" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          <Card variant="gradient">
            <CardHeader>
              <CardTitle>Revenue & Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number, name: string) => [
                        name === "revenue" ? `$${value.toLocaleString()}` : value,
                        name === "revenue" ? "Revenue" : "Deals",
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--success))" name="Revenue" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="deals" fill="hsl(var(--primary))" name="Deals" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6 mt-6">
          <Card variant="gradient">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold">{stage.value.toLocaleString()}</span>
                        <Badge variant={index === 0 ? "success" : "secondary"}>
                          {stage.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="h-12 bg-secondary rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary rounded-lg transition-all duration-500"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                    {index < funnelData.length - 1 && (
                      <div className="flex items-center justify-center py-2">
                        <ArrowDownRight className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground ml-2">
                          {Math.round((funnelData[index + 1].value / stage.value) * 100)}% conversion
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
