import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small businesses getting started",
    price: 29,
    popular: false,
    features: [
      "1 Workspace",
      "1 Channel (WhatsApp or Instagram)",
      "500 AI Messages/month",
      "Basic Flow Builder",
      "CRM with 1,000 contacts",
      "Email Support",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Pro",
    description: "For growing businesses scaling automation",
    price: 99,
    popular: true,
    features: [
      "5 Workspaces",
      "All Channels Included",
      "5,000 AI Messages/month",
      "Advanced Flow Builder",
      "Unlimited CRM Contacts",
      "Broadcasts & Campaigns",
      "Automation Engine",
      "Analytics Dashboard",
      "Priority Support",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Agency",
    description: "For agencies managing multiple clients",
    price: 299,
    popular: false,
    features: [
      "Unlimited Workspaces",
      "All Channels Included",
      "Unlimited AI Messages",
      "Full White Label",
      "Custom Domain",
      "Template Marketplace Access",
      "Sub-accounts for Clients",
      "API Access",
      "Dedicated Account Manager",
      "Custom Integrations",
    ],
    cta: "Contact Sales",
  },
];

export function Pricing() {
  return (
    <section className="py-24 relative" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="gradient" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple, <span className="text-gradient">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free for 7 days. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              variant={plan.popular ? "popular" : "pricing"}
              className="relative animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="gradient" className="gap-1 px-4 py-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="w-5 h-5 text-success shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  className="w-full" 
                  size="lg"
                  asChild
                >
                  <Link to="/signup">{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise */}
        <div className="mt-16 text-center">
          <Card variant="glass" className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                  <p className="text-muted-foreground">
                    Custom pricing, SLAs, dedicated infrastructure, and premium support for large organizations.
                  </p>
                </div>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
