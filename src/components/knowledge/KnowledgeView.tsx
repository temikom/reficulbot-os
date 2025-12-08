import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Plus,
  Search,
  Upload,
  FileText,
  Globe,
  File,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  MoreVertical,
  Link,
  FolderOpen,
  Bot,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  ExternalLink,
  Database,
  Sparkles,
} from "lucide-react";

interface KnowledgeSource {
  id: string;
  name: string;
  type: "pdf" | "txt" | "url" | "website" | "catalog";
  status: "indexed" | "indexing" | "error" | "pending";
  size?: string;
  pages?: number;
  url?: string;
  chunks: number;
  lastUpdated: string;
  createdAt: string;
  usedBy: string[];
}

const mockSources: KnowledgeSource[] = [
  {
    id: "1",
    name: "Product Catalog 2024.pdf",
    type: "pdf",
    status: "indexed",
    size: "4.2 MB",
    pages: 45,
    chunks: 234,
    lastUpdated: "2 hours ago",
    createdAt: "Nov 15, 2024",
    usedBy: ["Sales Closer", "Product Recommender"],
  },
  {
    id: "2",
    name: "FAQ Database.txt",
    type: "txt",
    status: "indexed",
    size: "156 KB",
    chunks: 89,
    lastUpdated: "1 day ago",
    createdAt: "Nov 20, 2024",
    usedBy: ["Support Agent", "FAQ Agent"],
  },
  {
    id: "3",
    name: "Company Website",
    type: "website",
    status: "indexing",
    url: "https://company.com",
    chunks: 156,
    lastUpdated: "Indexing...",
    createdAt: "Dec 1, 2024",
    usedBy: [],
  },
  {
    id: "4",
    name: "Pricing Guide.pdf",
    type: "pdf",
    status: "indexed",
    size: "1.8 MB",
    pages: 12,
    chunks: 67,
    lastUpdated: "3 days ago",
    createdAt: "Nov 25, 2024",
    usedBy: ["Sales Closer", "Lead Qualifier"],
  },
  {
    id: "5",
    name: "API Documentation",
    type: "url",
    status: "indexed",
    url: "https://docs.company.com/api",
    chunks: 423,
    lastUpdated: "1 week ago",
    createdAt: "Nov 10, 2024",
    usedBy: ["Support Agent"],
  },
  {
    id: "6",
    name: "Return Policy.txt",
    type: "txt",
    status: "error",
    size: "24 KB",
    chunks: 0,
    lastUpdated: "Failed to index",
    createdAt: "Dec 3, 2024",
    usedBy: [],
  },
];

const stats = {
  totalSources: mockSources.length,
  totalChunks: mockSources.reduce((acc, s) => acc + s.chunks, 0),
  indexed: mockSources.filter((s) => s.status === "indexed").length,
  activeAgents: 4,
};

export function KnowledgeView() {
  const [activeTab, setActiveTab] = useState("sources");
  const [showUploader, setShowUploader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadType, setUploadType] = useState<"file" | "url" | "website">("file");

  const filteredSources = mockSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return FileText;
      case "txt":
        return File;
      case "url":
        return Link;
      case "website":
        return Globe;
      case "catalog":
        return Database;
      default:
        return FileText;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "indexed":
        return <Badge variant="success">Indexed</Badge>;
      case "indexing":
        return (
          <Badge variant="warning" className="gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Indexing
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (showUploader) {
    return (
      <div className="h-full flex flex-col">
        {/* Uploader Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setShowUploader(false)}>
              ← Back to Knowledge Base
            </Button>
            <div className="h-6 w-px bg-border" />
            <h2 className="font-semibold">Add Knowledge Source</h2>
          </div>
        </div>

        {/* Uploader Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Source Type Selection */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Select Source Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={uploadType === "file" ? "secondary" : "outline"}
                    className="h-24 flex-col gap-2"
                    onClick={() => setUploadType("file")}
                  >
                    <Upload className="w-8 h-8" />
                    <span>Upload Files</span>
                  </Button>
                  <Button
                    variant={uploadType === "url" ? "secondary" : "outline"}
                    className="h-24 flex-col gap-2"
                    onClick={() => setUploadType("url")}
                  >
                    <Link className="w-8 h-8" />
                    <span>Web Page URL</span>
                  </Button>
                  <Button
                    variant={uploadType === "website" ? "secondary" : "outline"}
                    className="h-24 flex-col gap-2"
                    onClick={() => setUploadType("website")}
                  >
                    <Globe className="w-8 h-8" />
                    <span>Crawl Website</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            {uploadType === "file" && (
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Drop files here or click to upload</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supported formats: PDF, TXT, DOCX, CSV, JSON
                    </p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Maximum file size: 50MB. Files will be processed and indexed for AI retrieval.
                  </div>
                </CardContent>
              </Card>
            )}

            {uploadType === "url" && (
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Add Web Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Page URL</label>
                    <Input placeholder="https://example.com/page" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name (optional)</label>
                    <Input placeholder="Enter a name for this source" />
                  </div>
                  <Button variant="hero" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Page
                  </Button>
                </CardContent>
              </Card>
            )}

            {uploadType === "website" && (
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Crawl Website</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website URL</label>
                    <Input placeholder="https://example.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Max Pages</label>
                      <Input type="number" defaultValue={100} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Depth</label>
                      <select className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                        <option>1 level</option>
                        <option>2 levels</option>
                        <option>3 levels</option>
                        <option>Unlimited</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Include subdomains</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <span className="text-sm">Respect robots.txt</span>
                  </div>
                  <Button variant="hero" className="w-full">
                    <Globe className="w-4 h-4 mr-2" />
                    Start Crawling
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* AI Agent Assignment */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Assign to AI Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Select which AI agents should have access to this knowledge
                </p>
                <div className="space-y-2">
                  {["Sales Closer", "Support Agent", "Lead Qualifier", "FAQ Agent"].map((agent) => (
                    <div
                      key={agent}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                    >
                      <div className="flex items-center gap-3">
                        <Bot className="w-5 h-5 text-primary" />
                        <span className="font-medium">{agent}</span>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </div>
                  ))}
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
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Upload documents and websites to power your AI agents
          </p>
        </div>
        <Button variant="hero" onClick={() => setShowUploader(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Source
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalSources}</div>
                <div className="text-sm text-muted-foreground">Total Sources</div>
              </div>
              <FolderOpen className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalChunks.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Text Chunks</div>
              </div>
              <Database className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.indexed}</div>
                <div className="text-sm text-muted-foreground">Indexed</div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.activeAgents}</div>
                <div className="text-sm text-muted-foreground">Active Agents</div>
              </div>
              <Bot className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sources">All Sources</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="websites">Websites</TabsTrigger>
          <TabsTrigger value="test">Test Knowledge</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {activeTab !== "test" && (
            <>
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  variant="filled"
                  placeholder="Search sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSources
                  .filter((source) =>
                    activeTab === "sources"
                      ? true
                      : activeTab === "documents"
                      ? ["pdf", "txt"].includes(source.type)
                      : ["url", "website"].includes(source.type)
                  )
                  .map((source) => {
                    const TypeIcon = getTypeIcon(source.type);
                    return (
                      <Card
                        key={source.id}
                        variant="gradient"
                        className="hover:border-primary/50 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <TypeIcon className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-sm line-clamp-1">{source.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {source.type.toUpperCase()}
                                  </Badge>
                                  {getStatusBadge(source.status)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm mb-4">
                            {source.size && (
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span>Size</span>
                                <span>{source.size}</span>
                              </div>
                            )}
                            {source.pages && (
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span>Pages</span>
                                <span>{source.pages}</span>
                              </div>
                            )}
                            {source.url && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <ExternalLink className="w-3 h-3" />
                                <span className="truncate text-xs">{source.url}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between text-muted-foreground">
                              <span>Chunks</span>
                              <span>{source.chunks}</span>
                            </div>
                          </div>

                          {source.usedBy.length > 0 && (
                            <div className="mb-4">
                              <div className="text-xs text-muted-foreground mb-2">Used by:</div>
                              <div className="flex flex-wrap gap-1">
                                {source.usedBy.map((agent) => (
                                  <Badge key={agent} variant="channel" className="text-xs">
                                    {agent}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <span className="text-xs text-muted-foreground">{source.lastUpdated}</span>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </>
          )}

          {activeTab === "test" && (
            <Card variant="gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Test Knowledge Retrieval
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ask a question to test what your AI agents will retrieve from the knowledge base
                </p>
                <div className="flex gap-2">
                  <Input placeholder="e.g., What is our return policy?" className="flex-1" />
                  <Button variant="hero">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30">
                  <h4 className="font-medium mb-3">Sample Results:</h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="channel">FAQ Database.txt</Badge>
                        <span className="text-xs text-success">98% match</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "Our return policy allows customers to return products within 30 days of purchase
                        for a full refund. Items must be in original condition with tags attached..."
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="channel">Pricing Guide.pdf</Badge>
                        <span className="text-xs text-warning">72% match</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "For enterprise customers, custom return arrangements can be negotiated as part
                        of the service agreement..."
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
