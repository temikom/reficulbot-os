import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechStart",
    avatar: "SC",
    content: "ReficulBot replaced 3 different tools we were paying for. Our response time went from hours to seconds, and leads are converting 40% better.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Operations Lead, GrowthCo",
    avatar: "MJ",
    content: "The AI agents are incredible. They handle 80% of our customer inquiries without human intervention. Our team can finally focus on complex cases.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Founder, AgencyPro",
    avatar: "ER",
    content: "The white-label solution is perfect for our agency. We've onboarded 15 clients in the first month. The ROI is unreal.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Sales Director, SalesForce",
    avatar: "DK",
    content: "Our WhatsApp broadcast campaigns now reach 50,000+ contacts with 70% open rates. Nothing else comes close.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "CMO, E-Commerce Plus",
    avatar: "PS",
    content: "Integration took 10 minutes. Now all our Instagram DMs, WhatsApp, and email are in one place with AI auto-replies. Game changer.",
    rating: 5,
  },
  {
    name: "Tom Anderson",
    role: "CTO, ScaleUp Inc",
    avatar: "TA",
    content: "The API is clean, documentation is excellent, and the team ships features faster than any other vendor we've worked with.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-glow opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="gradient" className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Loved by <span className="text-gradient">10,000+</span> Businesses
          </h2>
          <p className="text-lg text-muted-foreground">
            See why teams around the world trust ReficulBot to power their conversations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name} 
              variant="gradient"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                
                <p className="text-sm leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
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
