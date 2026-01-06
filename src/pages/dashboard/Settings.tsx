import React from 'react';
import {
  User,
  Shield,
  Bell,
  Download,
  Trash2,
  Loader2,
  Lock,
  History,
  Camera
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
    <div className="space-y-6 md:space-y-8 max-w-full overflow-hidden">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground font-medium">Manage preferences and security parameters.</p>
      </div>
      <Tabs defaultValue="profile" className="space-y-6">
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-lg bg-muted/50 p-1 text-muted-foreground w-auto">
            <TabsTrigger value="profile" className="inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <User className="w-3.5 h-3.5" /> Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <Shield className="w-3.5 h-3.5" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <Bell className="w-3.5 h-3.5" /> Notifications
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-xl">Profile Details</CardTitle>
              <CardDescription className="text-xs">Update your global operator identity.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="p-4 md:p-6 space-y-8 pt-0">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-2 border-primary/20">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left">
                    <Button variant="outline" size="sm" type="button" className="h-8 font-bold text-xs">Update Identity Image</Button>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">JPG/PNG · Max 2MB</p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">Operator Name</Label>
                    <Input id="name" defaultValue="John Doe" className="bg-muted/10 border-border/50 h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">Registry Email</Label>
                    <Input id="email" type="email" defaultValue="john@gsmflow.com" className="bg-muted/10 border-border/50 h-11" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t bg-muted/5 flex justify-end">
                <Button type="submit" className="btn-gradient w-full sm:w-auto px-10 h-10 font-bold">Commit Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base">Authentication</CardTitle>
              <CardDescription className="text-xs">Secure your licensing authority access.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-6 pt-0">
              <div className="space-y-2 max-w-md">
                <Label htmlFor="current" className="text-xs font-bold">Current Secret</Label>
                <Input id="current" type="password" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="new" className="text-xs font-bold">New Secret</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-xs font-bold">Verify Secret</Label>
                  <Input id="confirm" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t bg-muted/5">
              <Button onClick={() => toast.success('Password changed')} className="font-bold">Update Secret</Button>
            </CardFooter>
          </Card>
          <Card className="border-border/50 border-dashed bg-primary/5">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Global Export
              </CardTitle>
              <CardDescription className="text-xs">Download a full cryptographic snapshot of your account data.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-background border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Download Registry Data</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">JSON Structure · Profiling · Nodes · Invoices</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full sm:w-auto font-bold h-10 min-w-[140px]"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                  Generate Export
                </Button>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t border-dashed">
              <Button variant="ghost" className="text-destructive hover:bg-destructive/10 text-xs font-bold">
                <Trash2 className="w-4 h-4 mr-2" /> Decommission Authority
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base">System Alerts</CardTitle>
              <CardDescription className="text-xs">Configure real-time monitoring notifications.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-6 pt-0">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Expiry Warnings</Label>
                  <p className="text-[10px] text-muted-foreground">Alerts for pending node deactivations.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2 border-t pt-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Audit Notifications</Label>
                  <p className="text-[10px] text-muted-foreground">Alerts for login and configuration changes.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2 border-t pt-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Validation Failures</Label>
                  <p className="text-[10px] text-muted-foreground">Alerts for unauthorized cluster access attempts.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}