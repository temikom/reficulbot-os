import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Menu, 
  X, 
  ChevronDown,
  MessageSquare,
  Workflow,
  Users,
  BarChart3,
  Zap,
  Building2
} from "lucide-react";

const features = [
  { name: "AI Agents", icon: Bot, description: "Intelligent conversation automation" },
  { name: "Flow Builder", icon: Workflow, description: "Visual automation designer" },
  { name: "Unified Inbox", icon: MessageSquare, description: "All channels in one place" },
  { name: "CRM", icon: Users, description: "Lead & contact management" },
  { name: "Analytics", icon: BarChart3, description: "Deep insights & reporting" },
  { name: "Automations", icon: Zap, description: "Trigger-based workflows" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ReficulBot</span>
            <Badge variant="gradient" className="ml-1 text-[10px] px-1.5 py-0">BETA</Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <div 
              className="relative"
              onMouseEnter={() => setShowFeatures(true)}
              onMouseLeave={() => setShowFeatures(false)}
            >
              <Button variant="ghost" className="gap-1">
                Features
                <ChevronDown className={`w-4 h-4 transition-transform ${showFeatures ? 'rotate-180' : ''}`} />
              </Button>
              
              {showFeatures && (
                <div className="absolute top-full left-0 pt-2 w-80 animate-scale-in">
                  <div className="glass rounded-xl p-2 shadow-elevated">
                    {features.map((feature) => (
                      <Link
                        key={feature.name}
                        to="/dashboard"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{feature.name}</div>
                          <div className="text-xs text-muted-foreground">{feature.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button variant="ghost" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/docs">Docs</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/blog">Blog</Link>
            </Button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-border/50 animate-slide-up">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/features">Features</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/docs">Docs</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/blog">Blog</Link>
            </Button>
            <div className="pt-4 space-y-2 border-t border-border">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="hero" className="w-full" asChild>
                <Link to="/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
