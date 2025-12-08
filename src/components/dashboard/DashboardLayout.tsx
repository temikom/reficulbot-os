import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  MessageSquare, 
  Workflow, 
  Users, 
  BarChart3, 
  Zap,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Plus,
  Home,
  Megaphone,
  BookOpen,
  CreditCard,
  Building2,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardLayoutProps {
  children: ReactNode;
}

const mainNav = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Inbox", icon: MessageSquare, href: "/dashboard/inbox", badge: "12" },
  { name: "AI Agents", icon: Bot, href: "/dashboard/agents" },
  { name: "Flows", icon: Workflow, href: "/dashboard/flows" },
  { name: "CRM", icon: Users, href: "/dashboard/crm" },
  { name: "Broadcasts", icon: Megaphone, href: "/dashboard/broadcasts" },
  { name: "Automations", icon: Zap, href: "/dashboard/automations" },
  { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { name: "Knowledge", icon: BookOpen, href: "/dashboard/knowledge" },
];

const bottomNav = [
  { name: "Billing", icon: CreditCard, href: "/dashboard/billing" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  { name: "Help", icon: HelpCircle, href: "/dashboard/help" },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          collapsed ? 'w-16' : 'w-64'
        } flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && <span className="font-bold">ReficulBot</span>}
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </Button>
        </div>

        {/* Workspace Selector */}
        {!collapsed && (
          <div className="p-3 border-b border-sidebar-border">
            <Button variant="outline" className="w-full justify-start gap-2 text-left">
              <Building2 className="w-4 h-4" />
              <div className="flex-1 truncate">
                <div className="text-sm font-medium truncate">My Business</div>
                <div className="text-xs text-muted-foreground">Pro Plan</div>
              </div>
            </Button>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {mainNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} gap-3`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge variant="channel" className="text-xs px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          {bottomNav.map((item) => (
            <Link key={item.name} to={item.href}>
              <Button 
                variant="ghost" 
                className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} gap-3`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          ))}
          <Button 
            variant="ghost" 
            className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} gap-3 text-destructive hover:text-destructive hover:bg-destructive/10`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                variant="filled"
                placeholder="Search conversations, contacts..." 
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </Button>
            <Button variant="hero" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              New Agent
            </Button>
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
              JD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
