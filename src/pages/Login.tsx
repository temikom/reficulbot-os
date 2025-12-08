import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Mail, Lock, ArrowRight, Chrome } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-glow animate-pulse-slow opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-glow animate-pulse-slow opacity-50" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Bot className="w-7 h-7 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your ReficulBot account</p>
        </div>

        <Card variant="glass" className="animate-scale-in">
          <CardContent className="p-6 space-y-6">
            {/* Social Login */}
            <Button variant="outline" className="w-full gap-2" size="lg">
              <Chrome className="w-5 h-5" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="you@company.com" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" className="pl-10" />
                </div>
              </div>

              <Button variant="hero" className="w-full gap-2" size="lg">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Start free trial
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
