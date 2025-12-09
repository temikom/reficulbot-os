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
  Link,
  FolderOpen,
  Bot,
  CheckCircle2,
  Database,
  Sparkles,
} from "lucide-react";

interface KnowledgeSource {
  id: string;
  name: string;
  type: "pdf" | "txt" | "url" | "website";
  status: "indexed" | "indexing" | "error" | "pending";
  size?: string;
  pages?: number;
  url?: string;
  chunks: number;
}

export function KnowledgeView() {
  const [activeTab, setActiveTab] = useState("sources");
  const [showUploader, setShowUploader] = useState(false);
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadType, setUploadType] = useState<"file" | "url" | "website">("file");

  if (showUploader) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setShowUploader(false)}>
              ← Back to Knowledge Base
            </Button>
            <div className="h-6 w-px bg-border" />
            <h2 className="font-semibold">Add Knowledge Source</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
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
                      </select>
                    </div>
                  </div>
                  <Button variant="hero" className="w-full">
                    <Globe className="w-4 h-4 mr-2" />
                    Start Crawling
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Assign to AI Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Select which AI agents should have access to this knowledge
                </p>
                <div className="p-4 rounded-lg bg-secondary/30 text-center">
                  <Bot className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No AI agents created yet</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{sources.length}</div>
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
                <div className="text-2xl font-bold">0</div>
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
                <div className="text-2xl font-bold">0</div>
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
                <div className="text-2xl font-bold">0</div>
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
          )}

          {activeTab !== "test" && sources.length === 0 ? (
            <Card variant="gradient" className="border-dashed">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Knowledge Sources Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Upload documents, add web pages, or crawl websites to build your AI knowledge base.
                </p>
                <Button variant="hero" onClick={() => setShowUploader(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Source
                </Button>
              </CardContent>
            </Card>
          ) : null}

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

                <div className="p-8 rounded-lg bg-secondary/30 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Add knowledge sources to test retrieval</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
