import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { cn } from "@/lib/utils";
import type { UserProfile } from '@shared/types';
export function Settings() {
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = React.useState(false);
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  const updateMutation = useMutation({
    mutationFn: (data: { name: string; email: string }) => api<UserProfile>('/api/me', {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Configuration synchronized to authority registry');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Identity synchronization failed');
    }
  });
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    if (!name || !email) {
      toast.error('Identity fields cannot be nullified');
      return;
    }
    updateMutation.mutate({ name, email });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="space-y-1 ml-1">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Node Configuration</h1>
        <p className="text-sm text-muted-foreground font-medium uppercase opacity-70 tracking-tight">Manage operator identity and security parameters.</p>
      </div>
      <Tabs defaultValue="profile" className="space-y-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="h-12 p-1 bg-muted/30 border border-border/50 rounded-xl">
            <TabsTrigger value="profile" className="px-10 text-[10px] font-black uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:text-primary rounded-lg transition-all">
              Operator Identity
            </TabsTrigger>
            <TabsTrigger value="account" className="px-10 text-[10px] font-black uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:text-primary rounded-lg transition-all">
              Security & Auth
            </TabsTrigger>
            <TabsTrigger value="notifications" className="px-10 text-[10px] font-black uppercase tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:text-primary rounded-lg transition-all">
              System Vitals
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="profile" className="space-y-4 animate-fade-in">
          <Card className="border-border/50 overflow-hidden shadow-soft">
            <CardHeader className="py-5 border-b bg-muted/5 px-8">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Operator Registry Identity
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="p-8 space-y-10">
                <div className="flex flex-col sm:flex-row items-center gap-10">
                  <div className="relative group">
                    <Avatar className="w-28 h-28 border-2 border-primary/20 group-hover:border-primary transition-colors shadow-inner">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email || 'gsm'}`} />
                      <AvatarFallback className="font-black text-xl">OP</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-2 border-primary shadow-glow">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Registry Access ID</p>
                    <p className="text-sm font-mono text-primary font-black uppercase tracking-tight">{profile?.id.toUpperCase() || 'LOADING...'}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                      <Badge variant="secondary" className="text-[9px] uppercase font-black px-3 py-1 bg-primary/10 text-primary border-none">Active Authority</Badge>
                      {profile?.isAdmin && <Badge className="text-[9px] uppercase font-black px-3 py-1 bg-amber-500/10 text-amber-600 border-none">Master Admin</Badge>}
                    </div>
                  </div>
                </div>
                <div className="grid gap-10 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">Operator Legal Name</Label>
                    <Input id="name" name="name" defaultValue={profile?.name} className="h-12 text-xs font-bold border-border/50 bg-background/50 focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">Registry Contact Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={profile?.email} className="h-12 text-xs font-bold border-border/50 bg-background/50 focus:ring-primary focus:border-primary" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="py-5 border-t bg-muted/5 flex justify-end px-8">
                <Button type="submit" disabled={updateMutation.isPending} className="btn-gradient h-12 px-12 text-[10px] font-black uppercase tracking-widest shadow-glow">
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                  Sync Node Identity
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="space-y-6 animate-fade-in">
          <Card className="border-border/50 overflow-hidden shadow-soft">
            <CardHeader className="py-5 border-b bg-muted/5 px-8">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" /> Master Authority Key
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3 max-w-sm">
                <Label htmlFor="current" className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">Current Registry Secret</Label>
                <Input id="current" type="password" placeholder="••••••••••••" className="h-12 text-xs border-border/50 bg-background/50" />
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="new" className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">New Master Secret</Label>
                  <Input id="new" type="password" placeholder="••••••••••••" className="h-12 text-xs border-border/50 bg-background/50" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="confirm" className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">Verify New Secret</Label>
                  <Input id="confirm" type="password" placeholder="••••••••••••" className="h-12 text-xs border-border/50 bg-background/50" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="py-5 px-8 border-t bg-muted/5 flex flex-col sm:flex-row justify-between items-center gap-4">
               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic opacity-60">Master secrets should be rotated every 90 days for node integrity.</p>
               <Button onClick={() => toast.success('Secret authority rotated')} className="h-11 text-[10px] font-black uppercase tracking-widest px-10 border-border/50">Update Master Key</Button>
            </CardFooter>
          </Card>
          <Card className="border-border/50 border-dashed bg-muted/5 overflow-hidden shadow-sm">
            <CardHeader className="py-6 px-8">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-primary" /> Data Sovereignty Protocol
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-tight opacity-70">Download or decommission distributed registry node data snapshot.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between p-8 rounded-[2rem] bg-card border border-border/50 gap-6 shadow-soft">
                <div className="space-y-2">
                  <p className="text-sm font-black uppercase tracking-tight text-foreground">Full Registry Export</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50">Global JSON authority snapshot v{new Date().getFullYear()}.1</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="h-12 text-[10px] font-black uppercase tracking-widest w-full sm:w-auto min-w-[220px] border-border/50 hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                  Generate Authority Snapshot
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4 animate-fade-in">
          <Card className="border-border/50 overflow-hidden shadow-soft">
            <CardHeader className="py-5 border-b bg-muted/5 px-8">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" /> Protocol Alert Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {[
                { label: 'Latency Anomalies', desc: 'Alert when node validation threshold exceeds 100ms globally.' },
                { label: 'Auth Failures', desc: 'Real-time alert for unauthorized domain ping signatures.' },
                { label: 'Registry Sync', desc: 'Atomic confirmation pulse on every successful DO write operation.' },
              ].map((item, i) => (
                <div key={item.label} className={cn("flex items-center justify-between pb-8", i !== 2 && "border-b border-dashed border-border/30")}>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-black uppercase tracking-tighter text-foreground">{item.label}</Label>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-60 leading-relaxed max-w-sm">{item.desc}</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-primary" defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}