import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Search,
  Bell,
  Plus,
  Home,
  Megaphone,
  BookOpen,
  CreditCard,
  Building2,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: ReactNode;
}

const mainNav = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Inbox", icon: MessageSquare, href: "/dashboard/inbox" },
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
  const navigate = useNavigate();

  const NavItem = ({ item, isBottom = false }: { item: typeof mainNav[0], isBottom?: boolean }) => {
    const isActive = location.pathname === item.href;
    
    const button = (
      <Link to={item.href} className="block">
        <div
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
            ${collapsed ? 'justify-center' : ''}
            ${isActive 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }
          `}
        >
          <item.icon className={`w-5 h-5 shrink-0 ${isActive ? '' : ''}`} />
          {!collapsed && (
            <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {item.name}
            </span>
          )}
        </div>
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.name}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`
          ${collapsed ? 'w-[72px]' : 'w-64'} 
          flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out
        `}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} border-b border-border`}>
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight">ReficulBot</span>
                <span className="text-[10px] text-muted-foreground font-medium">AI Automation</span>
              </div>
            )}
          </Link>
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 text-muted-foreground hover:text-foreground"
              onClick={() => setCollapsed(true)}
            >
              <PanelLeftClose className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Collapse button when collapsed */}
        {collapsed && (
          <div className="p-2 border-b border-border">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-full h-9 text-muted-foreground hover:text-foreground"
                  onClick={() => setCollapsed(false)}
                >
                  <PanelLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Workspace Selector */}
        {!collapsed && (
          <div className="p-3 border-b border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between h-auto py-2 px-3 hover:bg-secondary/80"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">My Workspace</div>
                      <div className="text-xs text-muted-foreground">Free Plan</div>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>
                  <Building2 className="w-4 h-4 mr-2" />
                  My Workspace
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {mainNav.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-3 border-t border-border space-y-1">
          {bottomNav.map((item) => (
            <NavItem key={item.name} item={item} isBottom />
          ))}
          
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Log Out</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-10 bg-secondary/50 border-transparent focus:border-primary"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
            
            <Button variant="default" size="sm" className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  U
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/billing')}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/login')} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
