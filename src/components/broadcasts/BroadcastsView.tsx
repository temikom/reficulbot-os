import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Megaphone,
  Plus,
  Search,
  Send,
  Clock,
  Users,
  MessageSquare,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Copy,
  Trash2,
  Calendar,
  Filter,
  MoreVertical,
  Image,
  Paperclip,
  Smile,
  Target,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface Broadcast {
  id: string;
  name: string;
  channel: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  audience: number;
  delivered: number;
  opened: number;
  clicked: number;
  scheduledAt?: string;
  sentAt?: string;
  message: string;
}

const mockBroadcasts: Broadcast[] = [
  {
    id: "1",
    name: "Holiday Sale Announcement",
    channel: "WhatsApp",
    status: "sent",
    audience: 5420,
    delivered: 5234,
    opened: 4180,
    clicked: 1520,
    sentAt: "Dec 5, 2024 10:00 AM",
    message: "🎄 Holiday Sale is LIVE! Get 30% off on all products...",
  },
  {
    id: "2",
    name: "New Feature Launch",
    channel: "Email",
    status: "scheduled",
    audience: 8900,
    delivered: 0,
    opened: 0,
    clicked: 0,
    scheduledAt: "Dec 10, 2024 9:00 AM",
    message: "We're excited to announce our new AI automation features...",
  },
  {
    id: "3",
    name: "Flash Sale Reminder",
    channel: "Instagram",
    status: "sent",
    audience: 3200,
    delivered: 3050,
    opened: 2400,
    clicked: 890,
    sentAt: "Dec 3, 2024 2:00 PM",
    message: "⚡ Only 2 hours left! Don't miss out on our flash sale...",
  },
  {
    id: "4",
    name: "Weekly Newsletter",
    channel: "Telegram",
    status: "draft",
    audience: 2100,
    delivered: 0,
    opened: 0,
    clicked: 0,
    message: "This week's updates and tips for growing your business...",
  },
  {
    id: "5",
    name: "Customer Survey",
    channel: "SMS",
    status: "sent",
    audience: 1500,
    delivered: 1480,
    opened: 1200,
    clicked: 450,
    sentAt: "Dec 1, 2024 11:00 AM",
    message: "We value your feedback! Take a 2-min survey...",
  },
];

const audiences = [
  { name: "All Contacts", count: 12847 },
  { name: "Active Leads", count: 3421 },
  { name: "Customers", count: 2890 },
  { name: "Enterprise", count: 456 },
  { name: "Hot Leads", count: 234 },
  { name: "Inactive (30 days)", count: 1890 },
];

export function BroadcastsView() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [showComposer, setShowComposer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("whatsapp");

  const filteredBroadcasts = mockBroadcasts.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "success";
      case "scheduled":
        return "warning";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "email":
        return Mail;
      case "sms":
        return Phone;
      default:
        return MessageSquare;
    }
  };

  if (showComposer) {
    return (
      <div className="h-full flex flex-col">
        {/* Composer Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setShowComposer(false)}>
              ← Back to Broadcasts
            </Button>
            <div className="h-6 w-px bg-border" />
            <h2 className="font-semibold">Create Broadcast</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Save Draft
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button variant="hero" size="sm">
              <Send className="w-4 h-4 mr-2" />
              Send Now
            </Button>
          </div>
        </div>

        {/* Composer Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Campaign Name */}
            <Card variant="gradient">
              <CardContent className="p-4">
                <label className="text-sm font-medium mb-2 block">Campaign Name</label>
                <Input placeholder="Enter campaign name..." />
              </CardContent>
            </Card>

            {/* Channel Selection */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Select Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {["whatsapp", "instagram", "telegram", "email", "sms"].map((channel) => (
                    <Button
                      key={channel}
                      variant={selectedChannel === channel ? "secondary" : "outline"}
                      className="h-20 flex-col gap-2"
                      onClick={() => setSelectedChannel(channel)}
                    >
                      <MessageSquare className="w-6 h-6" />
                      <span className="capitalize">{channel}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Audience Selection */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Select Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {audiences.map((audience) => (
                    <div
                      key={audience.name}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{audience.name}</span>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-bold mt-2">{audience.count.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">contacts</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span className="font-medium">Add Custom Filter</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Filter by tags, location, lead score, or custom fields
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Message Composer */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Compose Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message Content</label>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <textarea
                      placeholder="Type your message here... Use {{name}} for personalization"
                      className="w-full min-h-[200px] p-4 bg-transparent resize-none focus:outline-none"
                    />
                    <div className="flex items-center justify-between p-3 border-t border-border bg-secondary/20">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Image className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Smile className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">0/1000 characters</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Add Buttons (optional)</label>
                  <div className="flex gap-2">
                    <Input placeholder="Button text" className="flex-1" />
                    <Input placeholder="Button URL" className="flex-1" />
                    <Button variant="outline">Add</Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30">
                  <h4 className="font-medium mb-2">Preview</h4>
                  <div className="bg-card rounded-lg p-4 max-w-sm">
                    <div className="text-sm">Your message preview will appear here...</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Schedule (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input type="time" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Send in recipient's local timezone</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Broadcasts</h1>
          <p className="text-muted-foreground">
            Send mass messages across all channels
          </p>
        </div>
        <Button variant="hero" onClick={() => setShowComposer(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Broadcast
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockBroadcasts.length}</div>
                <div className="text-sm text-muted-foreground">Total Campaigns</div>
              </div>
              <Megaphone className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {mockBroadcasts.reduce((acc, b) => acc + b.delivered, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Messages Sent</div>
              </div>
              <Send className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (mockBroadcasts.reduce((acc, b) => acc + b.opened, 0) /
                      mockBroadcasts.reduce((acc, b) => acc + b.delivered, 0)) *
                      100
                  )}%
                </div>
                <div className="text-sm text-muted-foreground">Open Rate</div>
              </div>
              <Eye className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (mockBroadcasts.reduce((acc, b) => acc + b.clicked, 0) /
                      mockBroadcasts.reduce((acc, b) => acc + b.opened, 0)) *
                      100
                  )}%
                </div>
                <div className="text-sm text-muted-foreground">Click Rate</div>
              </div>
              <TrendingUp className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {mockBroadcasts.filter((b) => b.status === "scheduled").length}
                </div>
                <div className="text-sm text-muted-foreground">Scheduled</div>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="campaigns">All Campaigns</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {/* Search & Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                variant="filled"
                placeholder="Search broadcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Broadcasts List */}
          <div className="space-y-4">
            {filteredBroadcasts
              .filter((b) =>
                activeTab === "campaigns"
                  ? true
                  : activeTab === "scheduled"
                  ? b.status === "scheduled"
                  : activeTab === "sent"
                  ? b.status === "sent"
                  : b.status === "draft"
              )
              .map((broadcast) => {
                const ChannelIcon = getChannelIcon(broadcast.channel);
                return (
                  <Card
                    key={broadcast.id}
                    variant="gradient"
                    className="hover:border-primary/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <ChannelIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{broadcast.name}</h3>
                              <Badge variant="channel">{broadcast.channel}</Badge>
                              <Badge variant={getStatusColor(broadcast.status)}>
                                {broadcast.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                              {broadcast.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {broadcast.audience.toLocaleString()} recipients
                              </span>
                              {broadcast.status === "scheduled" && broadcast.scheduledAt && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Scheduled: {broadcast.scheduledAt}
                                </span>
                              )}
                              {broadcast.status === "sent" && broadcast.sentAt && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Sent: {broadcast.sentAt}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {broadcast.status === "sent" && (
                            <div className="flex items-center gap-6 text-center">
                              <div>
                                <div className="text-lg font-bold">
                                  {Math.round((broadcast.delivered / broadcast.audience) * 100)}%
                                </div>
                                <div className="text-xs text-muted-foreground">Delivered</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold">
                                  {Math.round((broadcast.opened / broadcast.delivered) * 100)}%
                                </div>
                                <div className="text-xs text-muted-foreground">Opened</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold">
                                  {Math.round((broadcast.clicked / broadcast.opened) * 100)}%
                                </div>
                                <div className="text-xs text-muted-foreground">Clicked</div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
