import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import Flows from "./pages/Flows";
import Agents from "./pages/Agents";
import CRM from "./pages/CRM";
import Analytics from "./pages/Analytics";
import Broadcasts from "./pages/Broadcasts";
import Automations from "./pages/Automations";
import Knowledge from "./pages/Knowledge";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/inbox" element={<Inbox />} />
          <Route path="/dashboard/flows" element={<Flows />} />
          <Route path="/dashboard/agents" element={<Agents />} />
          <Route path="/dashboard/crm" element={<CRM />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/broadcasts" element={<Broadcasts />} />
          <Route path="/dashboard/automations" element={<Automations />} />
          <Route path="/dashboard/knowledge" element={<Knowledge />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/billing" element={<Billing />} />
          <Route path="/dashboard/help" element={<Help />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
