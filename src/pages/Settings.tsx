import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, Bell, Shield, Key, Palette, Globe, Users } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and workspace settings</p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card variant="gradient">
              <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />Profile Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">U</div>
                  <Button variant="outline">Change Avatar</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-sm font-medium">First Name</label><Input placeholder="Enter first name" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Last Name</label><Input placeholder="Enter last name" /></div>
                </div>
                <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input type="email" placeholder="Enter email" /></div>
                <Button variant="hero">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workspace" className="space-y-6 mt-6">
            <Card variant="gradient">
              <CardHeader><CardTitle className="flex items-center gap-2"><Building className="w-5 h-5" />Workspace Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><label className="text-sm font-medium">Workspace Name</label><Input placeholder="My Business" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Timezone</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                    <option>UTC</option><option>America/New_York</option><option>Europe/London</option>
                  </select>
                </div>
                <Button variant="hero">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6 mt-6">
            <Card variant="gradient">
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Team Members</CardTitle></CardHeader>
              <CardContent>
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No team members yet</p>
                  <Button variant="outline" className="mt-4">Invite Team Member</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card variant="gradient">
              <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" />Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {["New conversations", "AI handoffs", "Daily digest", "Weekly reports"].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <span>{item}</span><input type="checkbox" className="w-5 h-5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-6">
            <Card variant="gradient">
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" />Security Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><label className="text-sm font-medium">Current Password</label><Input type="password" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">New Password</label><Input type="password" /></div>
                <Button variant="hero">Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6 mt-6">
            <Card variant="gradient">
              <CardHeader><CardTitle className="flex items-center gap-2"><Key className="w-5 h-5" />API Keys</CardTitle></CardHeader>
              <CardContent>
                <div className="p-8 text-center">
                  <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No API keys created yet</p>
                  <Button variant="outline" className="mt-4">Create API Key</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
