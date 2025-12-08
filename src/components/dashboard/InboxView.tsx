import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Send, 
  Paperclip,
  Smile,
  MoreVertical,
  Bot,
  User,
  Phone,
  Mail,
  Tag,
  Star,
  Archive,
  Trash2,
  Clock,
  CheckCheck
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "SJ",
    lastMessage: "I'd like to know more about your pricing plans",
    channel: "WhatsApp",
    time: "2m",
    unread: 3,
    status: "active",
    isAI: false,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "MC",
    lastMessage: "The AI agent was super helpful with my inquiry!",
    channel: "Instagram",
    time: "15m",
    unread: 0,
    status: "resolved",
    isAI: true,
  },
  {
    id: 3,
    name: "Emma Wilson",
    avatar: "EW",
    lastMessage: "Can I schedule a demo for tomorrow at 3 PM?",
    channel: "Email",
    time: "32m",
    unread: 1,
    status: "pending",
    isAI: false,
  },
  {
    id: 4,
    name: "David Brown",
    avatar: "DB",
    lastMessage: "Thanks for the quick response!",
    channel: "Telegram",
    time: "1h",
    unread: 0,
    status: "resolved",
    isAI: true,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    avatar: "LA",
    lastMessage: "I need help with my subscription",
    channel: "WhatsApp",
    time: "2h",
    unread: 2,
    status: "active",
    isAI: false,
  },
];

const messages = [
  { id: 1, sender: "customer", content: "Hi, I'm interested in your Pro plan", time: "10:30 AM" },
  { id: 2, sender: "ai", content: "Hello Sarah! Thank you for your interest in ReficulBot Pro. The Pro plan includes 5 workspaces, all channels, 5,000 AI messages per month, and much more. Would you like me to explain the features in detail?", time: "10:30 AM" },
  { id: 3, sender: "customer", content: "Yes, please tell me more about the AI messages limit", time: "10:32 AM" },
  { id: 4, sender: "ai", content: "Great question! With the Pro plan, you get 5,000 AI-powered message credits per month. Each credit covers one AI-generated response. If you need more, additional credits are available at $0.01 per message. Most businesses find 5,000 more than enough to handle their daily conversations.", time: "10:32 AM" },
  { id: 5, sender: "customer", content: "I'd like to know more about your pricing plans", time: "10:35 AM" },
];

export function InboxView() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-full">
      {/* Conversation List */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Search & Filter */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input variant="filled" placeholder="Search conversations..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1">All</Button>
            <Button variant="ghost" size="sm" className="flex-1">Unread</Button>
            <Button variant="ghost" size="sm" className="flex-1">AI</Button>
            <Button variant="ghost" size="icon" className="w-9">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors ${
                selectedConversation.id === conv.id ? 'bg-secondary/50' : ''
              }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="flex gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                    {conv.avatar}
                  </div>
                  {conv.isAI && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm truncate">{conv.name}</span>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="channel" className="text-[10px]">{conv.channel}</Badge>
                    {conv.unread > 0 && (
                      <Badge variant="default" className="text-[10px] px-1.5 min-w-[18px] justify-center">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
              {selectedConversation.avatar}
            </div>
            <div>
              <div className="font-medium">{selectedConversation.name}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="channel" className="text-[10px]">{selectedConversation.channel}</Badge>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Online
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Tag className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[70%] ${msg.sender === 'customer' ? '' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.sender === 'customer'
                      ? 'bg-secondary rounded-tl-none'
                      : 'bg-primary text-primary-foreground rounded-tr-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                  msg.sender === 'customer' ? '' : 'justify-end'
                }`}>
                  {msg.sender === 'ai' && (
                    <Badge variant="channel" className="text-[10px] gap-1">
                      <Bot className="w-3 h-3" />
                      AI
                    </Badge>
                  )}
                  <span>{msg.time}</span>
                  {msg.sender !== 'customer' && <CheckCheck className="w-4 h-4 text-primary" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Paperclip className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="pr-10"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8">
                <Smile className="w-5 h-5" />
              </Button>
            </div>
            <Button variant="hero" size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="gap-1 text-xs">
                <Bot className="w-3 h-3" />
                AI Reply
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <Clock className="w-3 h-3" />
                Schedule
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details Sidebar */}
      <div className="w-72 border-l border-border p-4 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-xl font-semibold text-primary-foreground mx-auto mb-3">
            {selectedConversation.avatar}
          </div>
          <h3 className="font-semibold">{selectedConversation.name}</h3>
          <p className="text-sm text-muted-foreground">Lead • High Value</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>sarah.johnson@email.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span>WhatsApp</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="channel">Lead</Badge>
            <Badge variant="channel">Pro Interest</Badge>
            <Badge variant="channel">Pricing</Badge>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">AI Summary</h4>
          <Card variant="glass" className="p-3">
            <p className="text-sm text-muted-foreground">
              Customer interested in Pro plan. Has questions about AI message limits. High intent to purchase.
            </p>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Archive className="w-4 h-4" />
            Archive
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1 text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
