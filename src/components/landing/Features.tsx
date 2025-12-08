import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  MessageSquare, 
  Workflow, 
  Users, 
  Zap, 
  BarChart3,
  Globe,
  Shield,
  Sparkles,
  Layers,
  Brain,
  Megaphone
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Agents",
    description: "Deploy intelligent agents for sales, support, scheduling, and more. Each with custom personalities, knowledge bases, and goals.",
    badge: "GPT-4 Powered",
  },
  {
    icon: MessageSquare,
    title: "Unified Inbox",
    description: "Every conversation from WhatsApp, Instagram, Telegram, Email, and more in one real-time inbox with AI assistance.",
    badge: "10+ Channels",
  },
  {
    icon: Workflow,
    title: "Visual Flow Builder",
    description: "Design complex automations with our drag-and-drop builder. Triggers, conditions, AI nodes, and integrations.",
    badge: "No Code",
  },
  {
    icon: Users,
    title: "Smart CRM",
    description: "Automatically capture leads, score prospects, manage pipelines, and track every touchpoint across channels.",
    badge: "Auto-Enrichment",
  },
  {
    icon: Zap,
    title: "Automation Engine",
    description: "Trigger workflows based on any event. Time-based sequences, keyword matches, tag changes, and more.",
    badge: "50+ Triggers",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Track AI performance, channel metrics, conversion rates, team productivity, and ROI in real-time.",
    badge: "Real-time",
  },
  {
    icon: Brain,
    title: "Knowledge Base RAG",
    description: "Upload PDFs, websites, and docs. AI learns your business and answers accurately using retrieval augmented generation.",
    badge: "Context-Aware",
  },
  {
    icon: Megaphone,
    title: "Multi-Channel Broadcasts",
    description: "Send campaigns across WhatsApp, Instagram, Telegram, Email, and SMS with segmentation and scheduling.",
    badge: "Scheduled",
  },
  {
    icon: Globe,
    title: "Global Payments",
    description: "Accept Stripe, PayPal, M-Pesa, Crypto, and 20+ payment methods. Usage-based billing built in.",
    badge: "20+ Gateways",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant, end-to-end encryption, SSO, role-based access, audit logs, and data residency options.",
    badge: "SOC 2",
  },
  {
    icon: Layers,
    title: "White Label",
    description: "Rebrand the entire platform for your agency. Custom domains, logos, colors, and client workspaces.",
    badge: "Agency Plan",
  },
  {
    icon: Sparkles,
    title: "Template Marketplace",
    description: "50+ ready-made automations for any industry. One-click deploy and customize for your business.",
    badge: "50+ Templates",
  },
];

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden" id="features">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="gradient" className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="text-gradient">Dominate</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for businesses that want to automate conversations, capture leads, and scale operations across every channel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="feature"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{feature.title}</h3>
                      <Badge variant="channel" className="text-[10px]">{feature.badge}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
