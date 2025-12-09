import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  MessageSquare,
  Bot,
  DollarSign,
  Clock,
  Calendar,
  Download,
  TrendingUp,
} from "lucide-react";

export function AnalyticsView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("7d");

  const stats = [
    { name: "Total Conversations", value: "0", icon: MessageSquare, color: "text-primary" },
    { name: "Active Leads", value: "0", icon: Users, color: "text-success" },
    { name: "AI Accuracy", value: "--%", icon: Bot, color: "text-accent" },
    { name: "Revenue", value: "$0", icon: DollarSign, color: "text-success" },
    { name: "Avg Response Time", value: "--", icon: Clock, color: "text-warning" },
    { name: "Conversion Rate", value: "--%", icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="p-6 space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} variant="gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
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
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Conversations by Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No data available yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Connect channels and start conversations to see analytics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No data available yet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card variant="gradient">
            <CardHeader>
              <CardTitle>AI Agent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No AI agents active yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Create and activate AI agents to track their performance
                  </p>
                </div>
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
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No conversation data yet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6 mt-6">
          <Card variant="gradient">
            <CardHeader>
              <CardTitle>AI Accuracy & Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No AI performance data yet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          <Card variant="gradient">
            <CardHeader>
              <CardTitle>Revenue & Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No revenue data yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Close deals in your CRM to track revenue
                  </p>
                </div>
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
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No funnel data yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add leads and track conversions to visualize your funnel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
