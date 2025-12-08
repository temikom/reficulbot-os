import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Star,
  Tag,
  Calendar,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  ArrowUpDown,
  ChevronDown,
  Grid3X3,
  List,
  Kanban,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  leadScore: number;
  stage: string;
  source: string;
  tags: string[];
  lastContact: string;
  createdAt: string;
  avatar?: string;
  value: number;
}

interface Deal {
  id: string;
  title: string;
  contact: string;
  value: number;
  stage: string;
  probability: number;
  expectedClose: string;
  owner: string;
}

const pipelineStages = [
  { id: "new", name: "New Leads", color: "bg-primary" },
  { id: "contacted", name: "Contacted", color: "bg-warning" },
  { id: "qualified", name: "Qualified", color: "bg-accent" },
  { id: "proposal", name: "Proposal", color: "bg-success" },
  { id: "won", name: "Won", color: "bg-success" },
  { id: "lost", name: "Lost", color: "bg-destructive" },
];

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Corp",
    location: "San Francisco, CA",
    leadScore: 85,
    stage: "qualified",
    source: "WhatsApp",
    tags: ["enterprise", "hot-lead"],
    lastContact: "2 hours ago",
    createdAt: "Dec 1, 2024",
    value: 15000,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@startup.io",
    phone: "+1 (555) 234-5678",
    company: "Startup Inc",
    location: "New York, NY",
    leadScore: 72,
    stage: "contacted",
    source: "Instagram",
    tags: ["startup", "demo-scheduled"],
    lastContact: "1 day ago",
    createdAt: "Nov 28, 2024",
    value: 8000,
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@agency.co",
    phone: "+1 (555) 345-6789",
    company: "Creative Agency",
    location: "Los Angeles, CA",
    leadScore: 91,
    stage: "proposal",
    source: "Website",
    tags: ["agency", "priority"],
    lastContact: "5 hours ago",
    createdAt: "Nov 25, 2024",
    value: 25000,
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@retail.com",
    phone: "+1 (555) 456-7890",
    company: "Retail Plus",
    location: "Chicago, IL",
    leadScore: 45,
    stage: "new",
    source: "Telegram",
    tags: ["retail"],
    lastContact: "3 days ago",
    createdAt: "Nov 20, 2024",
    value: 5000,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa@consulting.biz",
    phone: "+1 (555) 567-8901",
    company: "Anderson Consulting",
    location: "Boston, MA",
    leadScore: 68,
    stage: "contacted",
    source: "Email",
    tags: ["consulting", "follow-up"],
    lastContact: "12 hours ago",
    createdAt: "Nov 18, 2024",
    value: 12000,
  },
];

const mockDeals: Deal[] = [
  { id: "1", title: "Tech Corp Enterprise Deal", contact: "Sarah Johnson", value: 15000, stage: "qualified", probability: 60, expectedClose: "Dec 15", owner: "John" },
  { id: "2", title: "Startup Growth Package", contact: "Michael Chen", value: 8000, stage: "contacted", probability: 30, expectedClose: "Dec 20", owner: "Jane" },
  { id: "3", title: "Agency Full Suite", contact: "Emma Wilson", value: 25000, stage: "proposal", probability: 80, expectedClose: "Dec 10", owner: "John" },
  { id: "4", title: "Retail Automation", contact: "David Brown", value: 5000, stage: "new", probability: 10, expectedClose: "Jan 5", owner: "Jane" },
  { id: "5", title: "Consulting Upgrade", contact: "Lisa Anderson", value: 12000, stage: "contacted", probability: 40, expectedClose: "Dec 18", owner: "John" },
];

export function CRMView() {
  const [activeTab, setActiveTab] = useState("contacts");
  const [viewMode, setViewMode] = useState<"table" | "grid" | "kanban">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = mockContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-muted-foreground";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success/20";
    if (score >= 50) return "bg-warning/20";
    return "bg-secondary";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockContacts.length}</div>
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
                <div className="text-2xl font-bold">{mockDeals.length}</div>
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
                <div className="text-2xl font-bold">
                  ${mockDeals.reduce((acc, d) => acc + d.value, 0).toLocaleString()}
                </div>
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
                <div className="text-2xl font-bold">
                  {Math.round(mockContacts.reduce((acc, c) => acc + c.leadScore, 0) / mockContacts.length)}
                </div>
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
                <div className="text-2xl font-bold">24%</div>
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
          {/* Search & Filters */}
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

          {viewMode === "table" && (
            <Card variant="gradient">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          <div className="flex items-center gap-2">
                            Contact
                            <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Company</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Score</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Stage</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Source</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Tags</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Last Contact</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact) => (
                        <tr
                          key={contact.id}
                          className="border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedContact(contact)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{contact.name}</div>
                                <div className="text-sm text-muted-foreground">{contact.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{contact.company}</div>
                            <div className="text-sm text-muted-foreground">{contact.location}</div>
                          </td>
                          <td className="p-4">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full ${getScoreBg(contact.leadScore)}`}>
                              <Star className={`w-3 h-3 mr-1 ${getScoreColor(contact.leadScore)}`} />
                              <span className={`text-sm font-medium ${getScoreColor(contact.leadScore)}`}>
                                {contact.leadScore}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={
                              contact.stage === 'qualified' ? 'success' :
                              contact.stage === 'proposal' ? 'warning' :
                              contact.stage === 'contacted' ? 'secondary' : 'outline'
                            }>
                              {contact.stage}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant="channel">{contact.source}</Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {contact.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {contact.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{contact.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {contact.lastContact}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map((contact) => (
                <Card
                  key={contact.id}
                  variant="gradient"
                  className="hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedContact(contact)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-semibold text-primary-foreground">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">{contact.company}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full ${getScoreBg(contact.leadScore)}`}>
                        <span className={`text-sm font-bold ${getScoreColor(contact.leadScore)}`}>
                          {contact.leadScore}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {contact.location}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {contact.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <Badge variant="channel">{contact.source}</Badge>
                      <span>{contact.lastContact}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {viewMode === "kanban" && (
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-x-auto">
              {pipelineStages.map((stage) => {
                const stageContacts = filteredContacts.filter(c => c.stage === stage.id);
                return (
                  <div key={stage.id} className="min-w-[280px]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                        <span className="font-medium">{stage.name}</span>
                      </div>
                      <Badge variant="secondary">{stageContacts.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {stageContacts.map((contact) => (
                        <Card
                          key={contact.id}
                          variant="gradient"
                          className="cursor-pointer hover:border-primary/50"
                          onClick={() => setSelectedContact(contact)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{contact.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{contact.company}</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <Badge variant="channel">{contact.source}</Badge>
                              <span className={`font-medium ${getScoreColor(contact.leadScore)}`}>
                                {contact.leadScore}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-x-auto">
            {pipelineStages.map((stage) => {
              const stageDeals = mockDeals.filter(d => d.stage === stage.id);
              const stageValue = stageDeals.reduce((acc, d) => acc + d.value, 0);
              
              return (
                <div key={stage.id} className="min-w-[280px]">
                  <div className="p-3 rounded-lg bg-secondary/30 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                        <span className="font-medium">{stage.name}</span>
                      </div>
                      <Badge variant="secondary">{stageDeals.length}</Badge>
                    </div>
                    <div className="text-lg font-bold">${stageValue.toLocaleString()}</div>
                  </div>
                  <div className="space-y-3">
                    {stageDeals.map((deal) => (
                      <Card key={deal.id} variant="gradient" className="cursor-pointer hover:border-primary/50">
                        <CardContent className="p-3">
                          <div className="font-medium text-sm mb-2">{deal.title}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Users className="w-3 h-3" />
                            {deal.contact}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-success">${deal.value.toLocaleString()}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {deal.expectedClose}
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Probability</span>
                              <span className="font-medium">{deal.probability}%</span>
                            </div>
                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${deal.probability}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4 mt-4">
          <Card variant="gradient">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">Deal</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Contact</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Value</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Stage</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Probability</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Expected Close</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Owner</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDeals.map((deal) => (
                      <tr key={deal.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="font-medium">{deal.title}</div>
                        </td>
                        <td className="p-4 text-muted-foreground">{deal.contact}</td>
                        <td className="p-4 font-bold text-success">${deal.value.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge variant={
                            deal.stage === 'won' ? 'success' :
                            deal.stage === 'lost' ? 'destructive' :
                            deal.stage === 'proposal' ? 'warning' : 'secondary'
                          }>
                            {deal.stage}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${deal.probability}%` }}
                              />
                            </div>
                            <span className="text-sm">{deal.probability}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{deal.expectedClose}</td>
                        <td className="p-4">
                          <Badge variant="secondary">{deal.owner}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
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
      </Tabs>
    </div>
  );
}
