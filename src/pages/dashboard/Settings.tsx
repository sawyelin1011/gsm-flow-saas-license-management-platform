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
  Camera,
  Check
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
import { cn } from "@/lib/utils";
export function Settings() {
  const [isExporting, setIsExporting] = React.useState(false);
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuration synchronized to authority registry');
  };
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await api<any>('/api/tenants');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gsm-flow-registry-snapshot-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Registry snapshot successfully exported');
    } catch (err) {
      toast.error('Authority export protocol failed');
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-6">
      <div className="space-y-1 mb-8">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Node Configuration</h1>
        <p className="text-sm text-muted-foreground font-medium">Manage your operator identity and security parameters.</p>
      </div>
      <Tabs defaultValue="profile" className="space-y-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="h-11 p-1 bg-muted/30 border border-border/50 rounded-xl">
            <TabsTrigger value="profile" className="px-8 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary rounded-lg transition-all">
              Operator Identity
            </TabsTrigger>
            <TabsTrigger value="account" className="px-8 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary rounded-lg transition-all">
              Security & Auth
            </TabsTrigger>
            <TabsTrigger value="notifications" className="px-8 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary rounded-lg transition-all">
              System Vitals
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="profile" className="space-y-4 animate-fade-in">
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="py-4 border-b bg-muted/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest">Operator Profile</CardTitle>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="p-6 md:p-8 space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-2 border-primary/20 group-hover:border-primary transition-colors">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback className="font-black text-lg">OP</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-2 border-primary shadow-glow">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-center sm:text-left">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Registry Access Token</p>
                    <p className="text-sm font-mono text-primary font-black uppercase tracking-tight">FLOW-OP-8291-ZXCV-Authority</p>
                    <Badge variant="secondary" className="text-[9px] uppercase font-black px-2 py-0.5 bg-primary/10 text-primary border-none">Active Authority</Badge>
                  </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground ml-1">Legal Entity / Name</Label>
                    <Input id="name" defaultValue="GSM Flow Global Admin" className="h-11 text-xs font-bold border-border/50 bg-background/50 focus:border-primary" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground ml-1">Registry Email</Label>
                    <Input id="email" type="email" defaultValue="admin@gsmflow.com" className="h-11 text-xs font-bold border-border/50 bg-background/50 focus:border-primary" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="py-4 border-t bg-muted/5 flex justify-end px-8">
                <Button type="submit" className="btn-gradient h-11 px-10 text-[10px] font-black uppercase tracking-widest shadow-glow">
                  <Check className="w-4 h-4 mr-2" /> Sync Node Identity
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="space-y-6 animate-fade-in">
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="py-4 border-b bg-muted/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest">Master Authority Key</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-3 max-w-sm">
                <Label htmlFor="current" className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">Current Secret</Label>
                <Input id="current" type="password" placeholder="••••••••••••" className="h-11 text-xs border-border/50 bg-background/50" />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="new" className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">New Master Secret</Label>
                  <Input id="new" type="password" placeholder="••••••••••••" className="h-11 text-xs border-border/50 bg-background/50" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="confirm" className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">Verify New Secret</Label>
                  <Input id="confirm" type="password" placeholder="••••••••••••" className="h-11 text-xs border-border/50 bg-background/50" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="py-4 px-8 border-t bg-muted/5 flex justify-between items-center">
               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight italic">Recommended to rotate secrets every 90 days.</p>
               <Button onClick={() => toast.success('Secret authority rotated')} className="h-10 text-[10px] font-black uppercase tracking-widest px-8">Update Master Key</Button>
            </CardFooter>
          </Card>
          <Card className="border-border/50 border-dashed bg-muted/5 overflow-hidden">
            <CardHeader className="py-6 px-8">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-primary" /> Data Sovereignty Protocol
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-tight opacity-70">Download or decommission your distributed registry node data.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-card border border-border/50 gap-6 shadow-sm">
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-tighter">Full Registry Export</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50">Global JSON authority snapshot</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="h-11 text-[10px] font-black uppercase tracking-widest w-full sm:w-auto min-w-[180px] border-border/50 hover:border-primary hover:text-primary transition-all"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                  Generate Snapshot
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4 animate-fade-in">
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="py-4 border-b bg-muted/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest">Protocol Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              {[
                { label: 'Latency Anomalies', desc: 'Alert when node validation exceeds 100ms.' },
                { label: 'Auth Failures', desc: 'Real-time alert for unauthorized domain pings.' },
                { label: 'Registry Synchronization', desc: 'Confirm on every successful DO write.' },
              ].map((item, i) => (
                <div key={item.label} className={cn("flex items-center justify-between pb-6", i !== 2 && "border-b border-dashed border-border/30")}>
                  <div className="space-y-1">
                    <Label className="text-xs font-black uppercase tracking-tighter">{item.label}</Label>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-60 leading-relaxed">{item.desc}</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-primary" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}