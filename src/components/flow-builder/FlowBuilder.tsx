import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Play,
  Pause,
  Copy,
  Edit,
  Eye,
  Clock,
  Workflow,
  ArrowRight,
  Filter,
  Download,
  Upload,
} from "lucide-react";
import { FlowCanvas } from "./FlowCanvas";

interface Flow {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  trigger: string;
  nodesCount: number;
  executions: number;
  lastEdited: string;
}

export function FlowBuilder() {
  const [view, setView] = useState<"list" | "canvas">("list");
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFlows = flows.filter(
    (flow) =>
      flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === "canvas") {
    return (
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setView("list")}>
              ← Back to Flows
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h2 className="font-semibold">
                {selectedFlow ? flows.find(f => f.id === selectedFlow)?.name : "New Flow"}
              </h2>
              <p className="text-xs text-muted-foreground">Unsaved changes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="hero" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <FlowCanvas flowId={selectedFlow || undefined} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Flow Builder</h1>
          <p className="text-muted-foreground">
            Create visual automation workflows with drag-and-drop
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button
            variant="hero"
            onClick={() => {
              setSelectedFlow(null);
              setView("canvas");
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Flow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{flows.length}</div>
                <div className="text-sm text-muted-foreground">Total Flows</div>
              </div>
              <Workflow className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card variant="gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {flows.filter((f) => f.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">Active Flows</div>
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
                <div className="text-sm text-muted-foreground">Total Nodes</div>
              </div>
              <Workflow className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            variant="filled"
            placeholder="Search flows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {filteredFlows.length === 0 ? (
        <Card variant="gradient" className="border-dashed">
          <CardContent className="p-12 text-center">
            <Workflow className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Flows Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first automation flow to automate conversations, route leads, and trigger actions.
            </p>
            <Button
              variant="hero"
              onClick={() => {
                setSelectedFlow(null);
                setView("canvas");
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Flow
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFlows.map((flow) => (
            <Card
              key={flow.id}
              variant="gradient"
              className="hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => {
                setSelectedFlow(flow.id);
                setView("canvas");
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Workflow className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{flow.name}</h3>
                      <p className="text-xs text-muted-foreground">{flow.trigger}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      flow.status === "active"
                        ? "success"
                        : flow.status === "paused"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {flow.status}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {flow.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{flow.nodesCount} nodes</span>
                    <span>{flow.executions.toLocaleString()} runs</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {flow.lastEdited}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {flow.status === "active" ? (
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
    </div>
  );
}
