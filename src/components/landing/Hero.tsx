import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Play, 
  MessageSquare, 
  Instagram, 
  Send,
  Twitter,
  Mail,
  Bot,
  Sparkles,
  CheckCircle2
} from "lucide-react";

const channels = [
  { name: "WhatsApp", icon: MessageSquare, color: "text-green-400" },
  { name: "Instagram", icon: Instagram, color: "text-pink-400" },
  { name: "Telegram", icon: Send, color: "text-blue-400" },
  { name: "Twitter", icon: Twitter, color: "text-sky-400" },
  { name: "Email", icon: Mail, color: "text-amber-400" },
];

const stats = [
  { value: "50M+", label: "Messages Automated" },
  { value: "10K+", label: "Active Businesses" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "AI Support" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-glow animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-glow animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Announcement Badge */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Badge variant="glass" className="mb-6 px-4 py-2 text-sm gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Now with GPT-4 Turbo & Claude 3.5</span>
              <ArrowRight className="w-4 h-4" />
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <span className="block">The AI Automation OS</span>
            <span className="text-gradient">for Every Channel</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Unify WhatsApp, Instagram, Telegram, Email & more. Automate conversations with AI agents. 
            Close more deals. Deliver 24/7 support. All from one powerful platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" className="gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Channel Icons */}
          <div className="flex items-center justify-center gap-6 mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {channels.map((channel) => (
              <div 
                key={channel.name}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center group-hover:scale-110 transition-transform">
                  <channel.icon className={`w-6 h-6 ${channel.color}`} />
                </div>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {channel.name}
                </span>
              </div>
            ))}
            <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
              <span className="text-xs text-muted-foreground">+5</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 relative animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="glass rounded-2xl p-2 shadow-elevated max-w-5xl mx-auto">
            <div className="bg-background rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <Bot className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
                <p className="text-muted-foreground">Interactive Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
