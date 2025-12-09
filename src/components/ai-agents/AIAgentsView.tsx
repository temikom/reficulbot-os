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
  Zap,
  MessageSquare,
  Target,
  Clock,
  Edit,
  Play,
  Pause,
  Sparkles,
  BookOpen,
  Users,
  Calendar,
  ShoppingCart,
  HelpCircle,
  TrendingUp,
  Trash2,
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

export function AIAgentsView() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("agents");

  const filteredAgents = agents.filter(
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
        <Button variant="hero">
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
                <div className="text-2xl font-bold">{agents.length}</div>
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
                  {agents.filter((a) => a.status === "active").length}
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
                <div className="text-2xl font-bold">0</div>
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
                <div className="text-2xl font-bold">--%</div>
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

          {filteredAgents.length === 0 ? (
            <Card variant="gradient" className="border-dashed">
              <CardContent className="p-12 text-center">
                <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No AI Agents Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first AI agent to automate conversations, qualify leads, and provide 24/7 support.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Agent
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("templates")}>
                    Browse Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
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
          )}
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

      <div className="flex-1 overflow-y-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="escalation">Escalation</TabsTrigger>
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
          </TabsContent>

          <TabsContent value="personality" className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>System Prompt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  placeholder="Enter the system prompt for your AI agent..."
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
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Knowledge Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Knowledge Sources</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add documents, websites, or FAQs to power this agent
                  </p>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Source
                  </Button>
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
                  { name: "Update CRM Record", description: "Modify contact information", enabled: false },
                  { name: "Apply Tags", description: "Add or remove tags from contacts", enabled: false },
                  { name: "Book Appointment", description: "Schedule meetings via calendar", enabled: false },
                  { name: "Send Email", description: "Send follow-up emails", enabled: false },
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
              <CardContent>
                <div className="p-4 rounded-lg bg-secondary/30 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    No escalation rules configured yet
                  </p>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
