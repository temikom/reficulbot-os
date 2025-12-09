import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, MessageSquare, Video, FileText, ExternalLink, Mail } from "lucide-react";

const helpTopics = [
  { icon: BookOpen, title: "Getting Started", description: "Learn the basics of ReficulBot" },
  { icon: MessageSquare, title: "Channel Setup", description: "Connect WhatsApp, Instagram & more" },
  { icon: Video, title: "Video Tutorials", description: "Step-by-step video guides" },
  { icon: FileText, title: "API Documentation", description: "Developer resources & API docs" },
];

const Help = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">How can we help?</h1>
          <p className="text-muted-foreground mb-6">Search our knowledge base or browse topics below</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input variant="filled" placeholder="Search for help..." className="pl-12 h-14 text-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {helpTopics.map((topic) => (
            <Card key={topic.title} variant="gradient" className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <topic.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{topic.title}</h3>
                <p className="text-sm text-muted-foreground">{topic.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="gradient">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Support</h3>
              <p className="text-muted-foreground mb-4">Can't find what you're looking for? Our support team is here to help.</p>
              <Button variant="hero"><Mail className="w-4 h-4 mr-2" />Contact Support</Button>
            </CardContent>
          </Card>
          <Card variant="gradient">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Community</h3>
              <p className="text-muted-foreground mb-4">Join our community to connect with other ReficulBot users.</p>
              <Button variant="outline"><ExternalLink className="w-4 h-4 mr-2" />Join Community</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help;
