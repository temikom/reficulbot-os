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
  Phone,
  Mail,
  Tag,
  Star,
  Archive,
  Trash2,
  Clock,
  CheckCheck,
  Inbox,
  Plus,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  channel: string;
  time: string;
  unread: number;
  status: string;
  isAI: boolean;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
}

export function InboxView() {
  const [conversations] = useState<Conversation[]>([]);
  const [messages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");

  // Empty state when no conversations
  if (conversations.length === 0) {
    return (
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 border-r border-border flex flex-col">
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

          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">No conversations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Conversations will appear here when customers message you.
            </p>
          </div>
        </div>

        {/* Empty Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-secondary/10">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
              <MessageSquare className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Welcome to ReficulBot Inbox</h2>
            <p className="text-muted-foreground mb-6">
              Connect your channels to start receiving messages from WhatsApp, Instagram, Telegram, Email, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" className="gap-2">
                <Plus className="w-4 h-4" />
                Connect Channel
              </Button>
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Configure Widget
              </Button>
            </div>
          </div>
        </div>

        {/* Empty Contact Sidebar */}
        <div className="w-72 border-l border-border p-4 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
            <MessageSquare className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Select a conversation</h3>
          <p className="text-sm text-muted-foreground">
            Contact details will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Conversation List */}
      <div className="w-80 border-r border-border flex flex-col">
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

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors ${
                selectedConversation?.id === conv.id ? 'bg-secondary/50' : ''
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
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                {selectedConversation.avatar}
              </div>
              <div>
                <div className="font-medium">{selectedConversation.name}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="channel" className="text-[10px]">{selectedConversation.channel}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Phone className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><Mail className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><Tag className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><Star className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[70%]`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.sender === 'customer'
                      ? 'bg-secondary rounded-tl-none'
                      : 'bg-primary text-primary-foreground rounded-tr-none'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                    msg.sender === 'customer' ? '' : 'justify-end'
                  }`}>
                    {msg.sender === 'ai' && (
                      <Badge variant="channel" className="text-[10px] gap-1">
                        <Bot className="w-3 h-3" />AI
                      </Badge>
                    )}
                    <span>{msg.time}</span>
                    {msg.sender !== 'customer' && <CheckCheck className="w-4 h-4 text-primary" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon"><Paperclip className="w-5 h-5" /></Button>
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
              <Button variant="hero" size="icon"><Send className="w-5 h-5" /></Button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="gap-1 text-xs">
                  <Bot className="w-3 h-3" />AI Reply
                </Button>
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  <Clock className="w-3 h-3" />Schedule
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Press Enter to send</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-secondary/10">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Select a conversation</h3>
            <p className="text-sm text-muted-foreground">Choose a conversation to view messages</p>
          </div>
        </div>
      )}

      {/* Contact Details */}
      <div className="w-72 border-l border-border p-4 space-y-6">
        {selectedConversation ? (
          <>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-xl font-semibold text-primary-foreground mx-auto mb-3">
                {selectedConversation.avatar}
              </div>
              <h3 className="font-semibold">{selectedConversation.name}</h3>
              <p className="text-sm text-muted-foreground">Contact</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span>{selectedConversation.channel}</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Tags</h4>
              <p className="text-sm text-muted-foreground">No tags added</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Archive className="w-4 h-4" />Archive
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />Delete
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Select a conversation</h3>
            <p className="text-sm text-muted-foreground">Contact details will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}