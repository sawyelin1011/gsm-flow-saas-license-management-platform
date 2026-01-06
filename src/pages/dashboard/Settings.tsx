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
export function Settings() {
  const [isExporting, setIsExporting] = React.useState(false);
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuration synchronized');
  };
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await api<any>('/api/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `v2-registry-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Registry export successful');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="h-10 p-1 bg-muted/50 border border-border/50 rounded-lg">
            <TabsTrigger value="profile" className="px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary">
              Identity
            </TabsTrigger>
            <TabsTrigger value="account" className="px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary">
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary">
              Vitals
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="py-4 border-b bg-muted/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest">Operator Profile</CardTitle>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="p-6 space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="w-20 h-20 border border-primary/20">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>OP</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Registry Token</p>
                    <p className="text-xs font-mono text-primary font-bold">OP-4829-XJ-992</p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operator Name</Label>
                    <Input id="name" defaultValue="Default Admin" className="h-10 text-xs font-medium border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registry Email</Label>
                    <Input id="email" type="email" defaultValue="admin@v2-engine.local" className="h-10 text-xs font-medium border-border/50" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="py-4 border-t bg-muted/5 flex justify-end px-6">
                <Button type="submit" className="btn-gradient h-10 px-8 text-[10px] font-black uppercase tracking-widest">
                  <Check className="w-3 h-3 mr-2" /> Sync Profile
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="py-4 border-b bg-muted/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest">Master Auth</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2 max-w-sm">
                <Label htmlFor="current" className="text-[10px] font-black uppercase tracking-widest">Current Secret</Label>
                <Input id="current" type="password" placeholder="••••••••" className="h-10 text-xs border-border/50" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new" className="text-[10px] font-black uppercase tracking-widest">New Secret</Label>
                  <Input id="new" type="password" placeholder="••••••••" className="h-10 text-xs border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-[10px] font-black uppercase tracking-widest">Verify Secret</Label>
                  <Input id="confirm" type="password" placeholder="••••••••" className="h-10 text-xs border-border/50" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="py-3 px-6 border-t bg-muted/5">
              <Button onClick={() => toast.success('Secret rotated')} className="h-9 text-[10px] font-black uppercase tracking-widest">Update Secret</Button>
            </CardFooter>
          </Card>
          <Card className="border-border/50 border-dashed bg-muted/5">
            <CardHeader className="py-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <History className="w-3 h-3 text-primary" /> Data Sovereignty
              </CardTitle>
              <CardDescription className="text-[10px] font-bold">Securely export or decommission your registry node data.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-background border border-border/50 gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold uppercase tracking-tighter">Full Registry Export</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50">JSON Snapshot</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleExport} 
                  disabled={isExporting}
                  className="h-10 text-[10px] font-black uppercase tracking-widest w-full sm:w-auto min-w-[140px]"
                >
                  {isExporting ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Download className="w-3 h-3 mr-2" />}
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="py-4 border-b bg-muted/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest">Signal Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {[
                { label: 'Latency Outliers', desc: 'Notify on signals above 100ms.' },
                { label: 'Auth Failures', desc: 'Real-time alert for unauthorized access.' },
                { label: 'Registry Sync', desc: 'Confirmation on every successful write.' },
              ].map((item, i) => (
                <div key={item.label} className={cn("flex items-center justify-between pb-4", i !== 2 && "border-b border-dashed")}>
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold uppercase tracking-tighter">{item.label}</Label>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50">{item.desc}</p>
                  </div>
                  <Switch />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}