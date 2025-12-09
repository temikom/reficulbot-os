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
  Eye,
  Filter,
  Image,
  Paperclip,
  Smile,
  Target,
  TrendingUp,
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
  message: string;
}

const audiences = [
  { name: "All Contacts", count: 0 },
  { name: "Active Leads", count: 0 },
  { name: "Customers", count: 0 },
  { name: "Enterprise", count: 0 },
  { name: "Hot Leads", count: 0 },
  { name: "Inactive (30 days)", count: 0 },
];

export function BroadcastsView() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [showComposer, setShowComposer] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("whatsapp");

  if (showComposer) {
    return (
      <div className="h-full flex flex-col">
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card variant="gradient">
              <CardContent className="p-4">
                <label className="text-sm font-medium mb-2 block">Campaign Name</label>
                <Input placeholder="Enter campaign name..." />
              </CardContent>
            </Card>

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
              </CardContent>
            </Card>

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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{broadcasts.length}</div>
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
                <div className="text-2xl font-bold">0</div>
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
                <div className="text-2xl font-bold">--%</div>
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
                <div className="text-2xl font-bold">--%</div>
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
                <div className="text-2xl font-bold">0</div>
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

          {broadcasts.length === 0 ? (
            <Card variant="gradient" className="border-dashed">
              <CardContent className="p-12 text-center">
                <Megaphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Broadcasts Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first broadcast to send mass messages to your audience.
                </p>
                <Button variant="hero" onClick={() => setShowComposer(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Broadcast
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
