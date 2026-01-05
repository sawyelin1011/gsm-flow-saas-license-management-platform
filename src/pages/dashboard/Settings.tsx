import React from 'react';
import {
  User,
  Shield,
  Bell,
  Download,
  Trash2,
  Loader2,
  Lock,
  History
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
export function Settings() {
  const [isExporting, setIsExporting] = React.useState(false);
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings updated successfully');
  };
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await api<any>('/api/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gsm-flow-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (err) {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences, security, and data portability.</p>
        </div>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="profile" className="gap-2 px-4 rounded-md">
              <User className="w-4 h-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2 px-4 rounded-md">
              <Shield className="w-4 h-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 px-4 rounded-md">
              <Bell className="w-4 h-4" /> Notifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and how others see you on the platform.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSave}>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20 border-2 border-primary/10">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">Change Avatar</Button>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Format: JPG, PNG · Max: 2MB</p>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input id="name" defaultValue="John Doe" className="bg-muted/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Public Email</Label>
                      <Input id="email" type="email" defaultValue="john@gsmflow.com" className="bg-muted/20" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button type="submit" className="btn-gradient px-8">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="account" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>Update your credentials to keep your licensing authority secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-w-md">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input id="new" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <Input id="confirm" type="password" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button onClick={() => toast.success('Password changed')} className="px-6">Update Password</Button>
              </CardFooter>
            </Card>
            <Card className="border-border/50 border-dashed bg-muted/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" /> Data Portability
                </CardTitle>
                <CardDescription>Download a comprehensive snapshot of all your data for your records.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border bg-background gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Export Account Data</p>
                    <p className="text-xs text-muted-foreground">Includes profile, tenants, tickets, and billing history in JSON format.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleExport} 
                    disabled={isExporting}
                    className="w-full sm:w-auto min-w-[140px]"
                  >
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                    Export Data
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="border-t border-dashed pt-6">
                <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Account Permanently
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>Stay informed about your license traffic and account status.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-2">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">License Expiry Alerts</Label>
                    <p className="text-xs text-muted-foreground">Emails sent 30, 7, and 1 day before renewals.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-2 border-t pt-6">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">New Validation Attempts</Label>
                    <p className="text-xs text-muted-foreground">Alerts for unauthorized domain access attempts.</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-2 border-t pt-6">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">Security Critical Events</Label>
                    <p className="text-xs text-muted-foreground">Mandatory alerts for logins and key changes.</p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}