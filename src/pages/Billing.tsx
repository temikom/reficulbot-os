import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Package, Receipt, TrendingUp, Check } from "lucide-react";

const plans = [
  { name: "Starter", price: 29, features: ["1 workspace", "1 channel", "500 AI messages", "Basic flows", "Basic CRM"] },
  { name: "Pro", price: 99, features: ["5 workspaces", "All channels", "5,000 AI messages", "Full flow builder", "CRM pipeline", "Broadcasts"], popular: true },
  { name: "Agency", price: 299, features: ["Unlimited workspaces", "Unlimited channels", "Unlimited AI", "White label", "Custom domain", "Priority support"] },
];

const Billing = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Billing & Plans</h1>
          <p className="text-muted-foreground">Manage your subscription and billing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div><div className="text-2xl font-bold">Free Trial</div><div className="text-sm text-muted-foreground">Current Plan</div></div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card variant="gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div><div className="text-2xl font-bold">7 days</div><div className="text-sm text-muted-foreground">Trial Remaining</div></div>
                <TrendingUp className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card variant="gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div><div className="text-2xl font-bold">0</div><div className="text-sm text-muted-foreground">AI Messages Used</div></div>
                <Receipt className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card variant="gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div><div className="text-2xl font-bold">--</div><div className="text-sm text-muted-foreground">Next Invoice</div></div>
                <CreditCard className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} variant="gradient" className={plan.popular ? "border-primary" : ""}>
                <CardContent className="p-6">
                  {plan.popular && <Badge variant="channel" className="mb-4">Most Popular</Badge>}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2"><span className="text-4xl font-bold">${plan.price}</span><span className="text-muted-foreground">/mo</span></div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-success" />{f}</li>
                    ))}
                  </ul>
                  <Button variant={plan.popular ? "hero" : "outline"} className="w-full mt-6">
                    {plan.popular ? "Get Started" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card variant="gradient">
          <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
          <CardContent>
            <div className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payment method added yet</p>
              <Button variant="outline" className="mt-4">Add Payment Method</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
