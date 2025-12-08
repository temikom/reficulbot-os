import { useState, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  MessageSquare,
  Bot,
  GitBranch,
  Clock,
  Zap,
  Webhook,
  Tag,
  User,
  RotateCcw,
  Square,
  ArrowRight,
  Plus,
  Trash2,
  Copy,
  Settings,
  X,
  GripVertical,
} from "lucide-react";

interface FlowNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  config?: Record<string, any>;
}

interface Connection {
  from: string;
  to: string;
  fromOutput?: string;
}

const nodeTypes = [
  { type: "trigger", label: "Start Trigger", icon: Play, color: "text-success" },
  { type: "keyword", label: "Keyword Match", icon: Tag, color: "text-primary" },
  { type: "message", label: "Send Message", icon: MessageSquare, color: "text-primary" },
  { type: "ai", label: "AI Decision", icon: Bot, color: "text-accent" },
  { type: "condition", label: "Condition", icon: GitBranch, color: "text-warning" },
  { type: "delay", label: "Delay", icon: Clock, color: "text-muted-foreground" },
  { type: "action", label: "Action", icon: Zap, color: "text-accent" },
  { type: "webhook", label: "Webhook", icon: Webhook, color: "text-primary" },
  { type: "assign", label: "Assign Staff", icon: User, color: "text-success" },
  { type: "loop", label: "Loop", icon: RotateCcw, color: "text-warning" },
  { type: "stop", label: "Stop Flow", icon: Square, color: "text-destructive" },
];

interface FlowCanvasProps {
  flowId?: string;
}

export function FlowCanvas({ flowId }: FlowCanvasProps) {
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: "1", type: "trigger", label: "Start", x: 100, y: 100 },
    { id: "2", type: "message", label: "Welcome Message", x: 100, y: 220 },
    { id: "3", type: "ai", label: "AI Classification", x: 100, y: 340 },
    { id: "4", type: "condition", label: "Is Lead?", x: 100, y: 460 },
    { id: "5", type: "message", label: "Send Offer", x: 250, y: 580 },
    { id: "6", type: "assign", label: "Assign to Sales", x: -50, y: 580 },
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { from: "1", to: "2" },
    { from: "2", to: "3" },
    { from: "3", to: "4" },
    { from: "4", to: "5", fromOutput: "yes" },
    { from: "4", to: "6", fromOutput: "no" },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    setDraggedNode(nodeId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 100;
    const y = e.clientY - rect.top - 30;

    setNodes(nodes.map(node => 
      node.id === draggedNode ? { ...node, x, y } : node
    ));
    setDraggedNode(null);
  };

  const handleAddNode = (type: string) => {
    const newNode: FlowNode = {
      id: Date.now().toString(),
      type,
      label: nodeTypes.find(n => n.type === type)?.label || "Node",
      x: 300,
      y: 200,
    };
    setNodes([...nodes, newNode]);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    setSelectedNode(null);
  };

  const handleConnect = (fromId: string, toId: string) => {
    if (fromId !== toId && !connections.find(c => c.from === fromId && c.to === toId)) {
      setConnections([...connections, { from: fromId, to: toId }]);
    }
    setConnecting(null);
  };

  const getNodeIcon = (type: string) => {
    const nodeType = nodeTypes.find(n => n.type === type);
    return nodeType ? nodeType.icon : Play;
  };

  const getNodeColor = (type: string) => {
    const nodeType = nodeTypes.find(n => n.type === type);
    return nodeType?.color || "text-primary";
  };

  return (
    <div className="flex h-full">
      {/* Node Palette */}
      <div className="w-64 border-r border-border bg-card/50 p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Flow Nodes</h3>
        <div className="space-y-2">
          {nodeTypes.map((node) => (
            <div
              key={node.type}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => handleAddNode(node.type)}
            >
              <div className={`w-8 h-8 rounded-lg bg-background flex items-center justify-center ${node.color}`}>
                <node.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{node.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-auto bg-[radial-gradient(circle_at_center,_hsl(var(--secondary))_1px,_transparent_1px)] bg-[length:24px_24px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, index) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const fromX = fromNode.x + 100;
            const fromY = fromNode.y + 60;
            const toX = toNode.x + 100;
            const toY = toNode.y;

            const midY = (fromY + toY) / 2;

            return (
              <g key={index}>
                <path
                  d={`M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`}
                  fill="none"
                  stroke="hsl(var(--primary) / 0.5)"
                  strokeWidth="2"
                  strokeDasharray={conn.fromOutput ? "5,5" : "none"}
                />
                <circle
                  cx={toX}
                  cy={toY}
                  r="4"
                  fill="hsl(var(--primary))"
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const Icon = getNodeIcon(node.type);
          const color = getNodeColor(node.type);
          const isSelected = selectedNode === node.id;

          return (
            <div
              key={node.id}
              draggable
              onDragStart={(e) => handleDragStart(e, node.id)}
              onClick={() => setSelectedNode(node.id)}
              className={`absolute w-[200px] cursor-move transition-all ${
                isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
              }`}
              style={{ left: node.x, top: node.y }}
            >
              <Card className="p-0 overflow-hidden shadow-elevated">
                <div className={`h-1 ${
                  node.type === 'trigger' ? 'bg-success' :
                  node.type === 'ai' ? 'bg-accent' :
                  node.type === 'condition' ? 'bg-warning' :
                  node.type === 'stop' ? 'bg-destructive' :
                  'bg-primary'
                }`} />
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{node.label}</div>
                      <div className="text-xs text-muted-foreground capitalize">{node.type}</div>
                    </div>
                  </div>
                </div>

                {/* Connection points */}
                {node.type !== 'trigger' && (
                  <div 
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background cursor-crosshair"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (connecting) {
                        handleConnect(connecting, node.id);
                      }
                    }}
                  />
                )}
                {node.type !== 'stop' && (
                  <div 
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background cursor-crosshair"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConnecting(node.id);
                    }}
                  />
                )}

                {node.type === 'condition' && (
                  <>
                    <div className="absolute -bottom-2 left-4 w-4 h-4 rounded-full bg-success border-2 border-background cursor-crosshair" />
                    <div className="absolute -bottom-2 right-4 w-4 h-4 rounded-full bg-destructive border-2 border-background cursor-crosshair" />
                  </>
                )}
              </Card>
            </div>
          );
        })}

        {/* Connecting indicator */}
        {connecting && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium animate-pulse">
            Click another node to connect
          </div>
        )}
      </div>

      {/* Node Config Panel */}
      {selectedNode && (
        <div className="w-80 border-l border-border bg-card/50 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Node Settings</h3>
            <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            const Icon = getNodeIcon(node.type);

            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <Icon className={`w-5 h-5 ${getNodeColor(node.type)}`} />
                  <div>
                    <div className="font-medium">{node.label}</div>
                    <div className="text-xs text-muted-foreground capitalize">{node.type} node</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Node Label</label>
                  <input
                    type="text"
                    value={node.label}
                    onChange={(e) => setNodes(nodes.map(n => 
                      n.id === node.id ? { ...n, label: e.target.value } : n
                    ))}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                  />
                </div>

                {node.type === 'message' && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Message Content</label>
                    <textarea
                      placeholder="Enter your message..."
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Badge variant="channel">Text</Badge>
                      <Badge variant="secondary">Buttons</Badge>
                      <Badge variant="secondary">Image</Badge>
                    </div>
                  </div>
                )}

                {node.type === 'ai' && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">AI Agent</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                      <option>Sales Closer</option>
                      <option>Support Agent</option>
                      <option>Lead Qualifier</option>
                    </select>
                    <label className="text-sm font-medium">Context</label>
                    <textarea
                      placeholder="Additional context for AI..."
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm min-h-[80px]"
                    />
                  </div>
                )}

                {node.type === 'delay' && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Delay Duration</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        defaultValue={5}
                        className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                      />
                      <select className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                        <option>Seconds</option>
                        <option>Minutes</option>
                        <option>Hours</option>
                        <option>Days</option>
                      </select>
                    </div>
                  </div>
                )}

                {node.type === 'condition' && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Condition Type</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                      <option>Tag Exists</option>
                      <option>Field Value</option>
                      <option>Time Condition</option>
                      <option>Custom Expression</option>
                    </select>
                    <label className="text-sm font-medium">Expression</label>
                    <input
                      type="text"
                      placeholder="e.g., {{lead_score}} > 50"
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => handleDeleteNode(node.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
