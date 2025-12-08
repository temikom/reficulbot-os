import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow animate-pulse-slow" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm">Join 10,000+ businesses already automating</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Ready to <span className="text-gradient">Transform</span> Your Business?
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Start automating conversations, capturing leads, and scaling your operations today. 
            7-day free trial, no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                <Zap className="w-5 h-5" />
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link to="/demo">Schedule a Demo</Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Setup in 5 minutes • No credit card • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
