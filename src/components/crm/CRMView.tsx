import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  Search,
  Filter,
  Star,
  Tag,
  Download,
  Upload,
  Grid3X3,
  List,
  Kanban,
  DollarSign,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  leadScore: number;
  stage: string;
  source: string;
  tags: string[];
}

interface Deal {
  id: string;
  title: string;
  contact: string;
  value: number;
  stage: string;
  probability: number;
}

const pipelineStages = [
  { id: "new", name: "New Leads", color: "bg-primary" },
  { id: "contacted", name: "Contacted", color: "bg-warning" },
  { id: "qualified", name: "Qualified", color: "bg-accent" },
  { id: "proposal", name: "Proposal", color: "bg-success" },
  { id: "won", name: "Won", color: "bg-success" },
  { id: "lost", name: "Lost", color: "bg-destructive" },
];

export function CRMView() {
  const [activeTab, setActiveTab] = useState("contacts");
  const [viewMode, setViewMode] = useState<"table" | "grid" | "kanban">("table");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CRM & Leads</h1>
          <p className="text-muted-foreground">
            Manage contacts, track deals, and grow revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{contacts.length}</div>
                <div className="text-sm text-muted-foreground">Total Contacts</div>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{deals.length}</div>
                <div className="text-sm text-muted-foreground">Active Deals</div>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">$0</div>
                <div className="text-sm text-muted-foreground">Pipeline Value</div>
              </div>
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">--</div>
                <div className="text-sm text-muted-foreground">Avg Lead Score</div>
              </div>
              <Star className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">--%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("kanban")}
            >
              <Kanban className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="contacts" className="space-y-4 mt-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                variant="filled"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Tag className="w-4 h-4 mr-2" />
              Tags
            </Button>
          </div>

          {contacts.length === 0 ? (
            <Card variant="gradient" className="border-dashed">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Contacts Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add your first contact to start tracking leads and building relationships.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4 mt-4">
          {deals.length === 0 ? (
            <Card variant="gradient" className="border-dashed">
              <CardContent className="p-12 text-center">
                <Kanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Pipeline Empty</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create deals to track your sales pipeline and visualize progress.
                </p>
                <Button variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Deal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-x-auto">
              {pipelineStages.map((stage) => (
                <div key={stage.id} className="min-w-[280px]">
                  <div className="p-3 rounded-lg bg-secondary/30 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                        <span className="font-medium">{stage.name}</span>
                      </div>
                      <Badge variant="secondary">0</Badge>
                    </div>
                    <div className="text-lg font-bold">$0</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="deals" className="space-y-4 mt-4">
          {deals.length === 0 ? (
            <Card variant="gradient" className="border-dashed">
              <CardContent className="p-12 text-center">
                <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Deals Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first deal to track revenue opportunities.
                </p>
                <Button variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Deal
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
