import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  Plus,
  Search,
  Settings,
  Zap,
  MessageSquare,
  Brain,
  Target,
  Shield,
  Clock,
  BarChart3,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  ChevronRight,
  Sparkles,
  BookOpen,
  Users,
  Phone,
  Calendar,
  ShoppingCart,
  HelpCircle,
  TrendingUp,
  Star,
} from "lucide-react";

interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: string;
  status: "active" | "paused" | "training";
  conversations: number;
  accuracy: number;
  avgResponseTime: string;
  lastActive: string;
  personality: string;
  icon: any;
}

const agentTemplates = [
  { id: "sales", name: "Sales Closer", icon: TrendingUp, description: "Close deals and handle objections" },
  { id: "support", name: "Support Agent", icon: HelpCircle, description: "Answer questions and resolve issues" },
  { id: "qualifier", name: "Lead Qualifier", icon: Target, description: "Qualify and score incoming leads" },
  { id: "scheduler", name: "Appointment Scheduler", icon: Calendar, description: "Book meetings and demos" },
  { id: "product", name: "Product Recommender", icon: ShoppingCart, description: "Suggest products based on needs" },
  { id: "faq", name: "FAQ Agent", icon: BookOpen, description: "Answer frequently asked questions" },
  { id: "followup", name: "Follow-Up Agent", icon: Clock, description: "Re-engage inactive leads" },
  { id: "onboarding", name: "Onboarding Agent", icon: Users, description: "Guide new customers" },
];

const mockAgents: AIAgent[] = [
  {
    id: "1",
    name: "Sales Closer Pro",
    description: "Expert at handling objections and closing deals through WhatsApp and DMs",
    type: "sales",
    status: "active",
    conversations: 2345,
    accuracy: 94,
    avgResponseTime: "1.2s",
    lastActive: "Just now",
    personality: "Professional, persuasive, friendly",
    icon: TrendingUp,
  },
  {
    id: "2",
    name: "Support Genius",
    description: "24/7 customer support with product knowledge and troubleshooting",
    type: "support",
    status: "active",
    conversations: 5678,
    accuracy: 97,
    avgResponseTime: "0.8s",
    lastActive: "2 mins ago",
    personality: "Helpful, patient, knowledgeable",
    icon: HelpCircle,
  },
  {
    id: "3",
    name: "Lead Qualifier",
    description: "Automatically qualify leads based on budget, timeline, and needs",
    type: "qualifier",
    status: "active",
    conversations: 1892,
    accuracy: 91,
    avgResponseTime: "1.5s",
    lastActive: "5 mins ago",
    personality: "Curious, analytical, efficient",
    icon: Target,
  },
  {
    id: "4",
    name: "Appointment Setter",
    description: "Book demos and meetings with calendar integration",
    type: "scheduler",
    status: "paused",
    conversations: 456,
    accuracy: 89,
    avgResponseTime: "2.1s",
    lastActive: "1 hour ago",
    personality: "Organized, clear, accommodating",
    icon: Calendar,
  },
];

export function AIAgentsView() {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("agents");

  const filteredAgents = mockAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedAgent) {
    return <AgentEditor agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">
            Create and manage intelligent AI agents for your business
          </p>
        </div>
        <Button variant="hero" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockAgents.length}</div>
                <div className="text-sm text-muted-foreground">Total Agents</div>
              </div>
              <Bot className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {mockAgents.filter((a) => a.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">Active Now</div>
              </div>
              <Zap className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {mockAgents.reduce((acc, a) => acc + a.conversations, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Conversations</div>
              </div>
              <MessageSquare className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(mockAgents.reduce((acc, a) => acc + a.accuracy, 0) / mockAgents.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Accuracy</div>
              </div>
              <Target className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="agents">My Agents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4 mt-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              variant="filled"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                variant="gradient"
                className="hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => setSelectedAgent(agent)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                        <agent.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{agent.type}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        agent.status === "active"
                          ? "success"
                          : agent.status === "training"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {agent.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {agent.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div className="p-2 rounded-lg bg-secondary/30">
                      <div className="text-lg font-bold">{agent.accuracy}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/30">
                      <div className="text-lg font-bold">{agent.conversations}</div>
                      <div className="text-xs text-muted-foreground">Convos</div>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/30">
                      <div className="text-lg font-bold">{agent.avgResponseTime}</div>
                      <div className="text-xs text-muted-foreground">Speed</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Edit className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      {agent.status === "active" ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 mt-4">
          <p className="text-muted-foreground">
            Start with a pre-built template and customize it for your business
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentTemplates.map((template) => (
              <Card
                key={template.id}
                variant="gradient"
                className="hover:border-primary/50 transition-colors cursor-pointer"
              >
                <CardContent className="p-4 text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <template.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{template.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AgentEditorProps {
  agent: AIAgent;
  onBack: () => void;
}

function AgentEditor({ agent, onBack }: AgentEditorProps) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Agents
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <agent.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">{agent.name}</h2>
              <p className="text-xs text-muted-foreground">{agent.type} agent</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={agent.status === "active" ? "success" : "secondary"}>
            {agent.status}
          </Badge>
          <Button variant="outline" size="sm">
            Test Agent
          </Button>
          <Button variant="hero" size="sm">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="escalation">Escalation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Agent Name</label>
                    <Input defaultValue={agent.name} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Agent Type</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                      <option>Sales Closer</option>
                      <option>Support Agent</option>
                      <option>Lead Qualifier</option>
                      <option>Appointment Scheduler</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    defaultValue={agent.description}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Response Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Response Length</label>
                    <Input type="number" defaultValue={500} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Delay (ms)</label>
                    <Input type="number" defaultValue={1000} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <div className="font-medium">Enable Memory</div>
                    <div className="text-sm text-muted-foreground">
                      Remember context from previous conversations
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personality" className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>System Prompt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  defaultValue={`You are ${agent.name}, a ${agent.type} AI assistant for our business.

Your personality traits:
- ${agent.personality}

Guidelines:
1. Always be helpful and professional
2. Answer questions accurately using the knowledge base
3. If you don't know something, admit it and offer to connect with a human
4. Keep responses concise but informative
5. Use emojis sparingly for friendliness`}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm min-h-[200px] font-mono"
                />
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Improve
                  </Button>
                  <Button variant="outline" size="sm">
                    Load Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Tone & Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Communication Style</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Formal</option>
                      <option>Friendly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>Portuguese</option>
                      <option>Auto-detect</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Knowledge Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Upload Knowledge Documents</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    PDF, TXT, DOCX, or paste website URLs
                  </p>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Source
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Product Catalog.pdf</div>
                        <div className="text-xs text-muted-foreground">2.4 MB • Uploaded 3 days ago</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">FAQ Database.txt</div>
                        <div className="text-xs text-muted-foreground">156 KB • Uploaded 1 week ago</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Available Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Update CRM Record", description: "Modify contact information", enabled: true },
                  { name: "Apply Tags", description: "Add or remove tags from contacts", enabled: true },
                  { name: "Book Appointment", description: "Schedule meetings via calendar", enabled: false },
                  { name: "Send Email", description: "Send follow-up emails", enabled: true },
                  { name: "Create Ticket", description: "Create support tickets", enabled: false },
                  { name: "Trigger Workflow", description: "Start automation flows", enabled: true },
                ].map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <div className="font-medium">{action.name}</div>
                      <div className="text-sm text-muted-foreground">{action.description}</div>
                    </div>
                    <input type="checkbox" defaultChecked={action.enabled} className="w-5 h-5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escalation" className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Human Handoff Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { trigger: "Customer requests human agent", action: "Immediate transfer" },
                  { trigger: "Sentiment is negative (3+ messages)", action: "Alert team + option to transfer" },
                  { trigger: "Agent confidence below 60%", action: "Suggest human review" },
                  { trigger: "Pricing/billing questions", action: "Transfer to sales" },
                  { trigger: "Technical issues", action: "Create support ticket" },
                ].map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <div className="font-medium">{rule.trigger}</div>
                      <div className="text-sm text-muted-foreground">{rule.action}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="gradient">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary">{agent.accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </CardContent>
              </Card>
              <Card variant="gradient">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-success">{agent.conversations}</div>
                  <div className="text-sm text-muted-foreground">Conversations</div>
                </CardContent>
              </Card>
              <Card variant="gradient">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-accent">{agent.avgResponseTime}</div>
                  <div className="text-sm text-muted-foreground">Avg Response</div>
                </CardContent>
              </Card>
            </div>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12" />
                  <span className="ml-4">Chart visualization coming soon</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
