import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  Plus,
  Search,
  Play,
  Pause,
  Clock,
  ArrowRight,
  MessageSquare,
  Users,
  Tag,
  Mail,
  Webhook,
  Filter,
  Trash2,
  Bot,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: { type: string; icon: any; description: string };
  actions: { type: string; icon: any; description: string }[];
  status: "active" | "paused" | "error";
  executions: number;
}

const triggerTypes = [
  { type: "new_conversation", label: "New Conversation", icon: MessageSquare, description: "When a new conversation starts" },
  { type: "keyword_match", label: "Keyword Match", icon: Tag, description: "When a message contains specific keywords" },
  { type: "tag_applied", label: "Tag Applied", icon: Tag, description: "When a tag is added to a contact" },
  { type: "lead_stage", label: "Lead Stage Changed", icon: Users, description: "When a lead moves to a new stage" },
  { type: "time_based", label: "Time Based", icon: Clock, description: "Run at scheduled times" },
  { type: "missed_message", label: "Missed Message", icon: AlertCircle, description: "When a message isn't replied within X time" },
  { type: "form_submit", label: "Form Submitted", icon: CheckCircle2, description: "When a form is completed" },
  { type: "webhook", label: "Webhook Received", icon: Webhook, description: "When an external webhook is received" },
];

const actionTypes = [
  { type: "send_message", label: "Send Message", icon: MessageSquare, description: "Send a WhatsApp/DM message" },
  { type: "trigger_ai", label: "Trigger AI Agent", icon: Bot, description: "Activate an AI agent" },
  { type: "assign_staff", label: "Assign to Staff", icon: Users, description: "Assign conversation to team member" },
  { type: "add_tag", label: "Add/Remove Tag", icon: Tag, description: "Modify contact tags" },
  { type: "update_crm", label: "Update CRM", icon: Users, description: "Update contact or deal information" },
  { type: "send_email", label: "Send Email", icon: Mail, description: "Send an email notification" },
  { type: "trigger_flow", label: "Trigger Flow", icon: ArrowRight, description: "Start a flow automation" },
  { type: "webhook", label: "Fire Webhook", icon: Webhook, description: "Call an external API" },
  { type: "delay", label: "Add Delay", icon: Clock, description: "Wait before next action" },
  { type: "schedule", label: "Schedule Action", icon: Calendar, description: "Schedule for specific time" },
];

export function AutomationsView() {
  const [activeTab, setActiveTab] = useState("automations");
  const [showBuilder, setShowBuilder] = useState(false);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  if (showBuilder) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setShowBuilder(false)}>
              ← Back to Automations
            </Button>
            <div className="h-6 w-px bg-border" />
            <h2 className="font-semibold">Create Automation</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Save Draft
            </Button>
            <Button variant="hero" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Activate
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card variant="gradient">
              <CardContent className="p-4">
                <label className="text-sm font-medium mb-2 block">Automation Name</label>
                <Input placeholder="Enter automation name..." />
                <label className="text-sm font-medium mb-2 block mt-4">Description</label>
                <textarea
                  placeholder="Describe what this automation does..."
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm min-h-[80px]"
                />
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-warning" />
                  When this happens... (Trigger)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {triggerTypes.map((trigger) => (
                    <div
                      key={trigger.type}
                      onClick={() => setSelectedTrigger(trigger.type)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedTrigger === trigger.type
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <trigger.icon className="w-6 h-6 text-primary mb-2" />
                      <div className="font-medium text-sm">{trigger.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{trigger.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-success" />
                  Do this... (Actions)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {selectedActions.map((actionType, index) => {
                    const action = actionTypes.find((a) => a.type === actionType);
                    if (!action) return null;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <action.icon className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{action.label}</div>
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedActions(selectedActions.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {actionTypes.map((action) => (
                    <Button
                      key={action.type}
                      variant="outline"
                      className="h-auto py-3 flex-col gap-2"
                      onClick={() => setSelectedActions([...selectedActions, action.type])}
                    >
                      <action.icon className="w-5 h-5" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-accent" />
                  Only if... (Conditions)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-secondary/30 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Add conditions to run this automation only when specific criteria are met
                  </p>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Condition
                  </Button>
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
          <h1 className="text-2xl font-bold">Automations</h1>
          <p className="text-muted-foreground">
            Create trigger-based workflows to automate your business
          </p>
        </div>
        <Button variant="hero" onClick={() => setShowBuilder(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Automation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{automations.length}</div>
                <div className="text-sm text-muted-foreground">Total Automations</div>
              </div>
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {automations.filter((a) => a.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <Play className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Total Executions</div>
              </div>
              <ArrowRight className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="automations">All Automations</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              variant="filled"
              placeholder="Search automations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {automations.length === 0 ? (
            <Card variant="gradient" className="border-dashed">
              <CardContent className="p-12 text-center">
                <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Automations Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first automation to trigger actions based on events.
                </p>
                <Button variant="hero" onClick={() => setShowBuilder(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Automation
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
