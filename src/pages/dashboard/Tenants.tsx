import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Server, Plus, Copy, Check, ExternalLink, MoreVertical, Trash2, ShieldAlert, ShieldCheck, Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { Tenant } from '@shared/types';
import { cn } from '@/lib/utils';
export function Tenants() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const { data, isLoading } = useQuery<{ items: Tenant[] }>({
    queryKey: ['tenants'],
    queryFn: () => api<{ items: Tenant[] }>('/api/tenants'),
  });
  const createMutation = useMutation({
    mutationFn: (vals: { name: string; domain: string }) => api<Tenant>('/api/tenants', {
      method: 'POST',
      body: JSON.stringify(vals),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setIsCreateOpen(false);
      toast.success('Tenant provisioned successfully');
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Provisioning failed'),
  });
  const statusMutation = useMutation({
    mutationFn: (id: string) => api<Tenant>(`/api/tenants/${id}/status`, { method: 'PATCH' }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success(`Node ${updated.status === 'active' ? 'authorized' : 'deauthorized'}`);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/tenants/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Node data purged');
    },
  });
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success('Key copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      name: formData.get('name') as string,
      domain: formData.get('domain') as string,
    });
  };
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Active Nodes</h1>
          <p className="text-muted-foreground font-medium">Provision and manage distributed GSM service installations.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient shadow-glow font-bold h-11 px-6">
              <Plus className="mr-2 h-5 w-5" /> Provision Node
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] glass">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle className="text-2xl">Provision New Node</DialogTitle>
                <DialogDescription>
                  A cryptographically signed license will be generated for the target domain.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Node Identifier</Label>
                  <Input id="name" name="name" placeholder="e.g. EU-West Production" className="bg-background/50" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="domain" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Authorized Domain</Label>
                  <Input id="domain" name="domain" placeholder="gsm.deployment.com" className="bg-background/50" required />
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Note: Validation fails if hostname mismatch occurs.</p>
                </div>
              </div>
              <DialogFooter className="bg-muted/5 -mx-6 -mb-6 p-6 border-t">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending} className="btn-gradient font-bold px-8">
                  {createMutation.isPending ? "Provisioning..." : "Finalize Deployment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : data?.items.length === 0 ? (
          <Card className="border-dashed py-24 text-center border-2 bg-muted/5 flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 shadow-sm border border-primary/20 floating">
              <Server className="text-primary w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Zero Nodes Configured</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto font-medium">Your license authority is idle. Start by provisioning your first installation node.</p>
            <Button onClick={() => setIsCreateOpen(true)} size="lg" className="btn-gradient rounded-full px-10 h-12 font-bold shadow-glow">Begin Provisioning</Button>
          </Card>
        ) : (
          data?.items.map((tenant) => (
            <Card key={tenant.id} className={cn(
              "overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-glow transition-all duration-500 bg-card/50",
              tenant.status === 'suspended' && "opacity-75 grayscale-[0.2]"
            )}>
              <div className="p-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors",
                      tenant.status === 'active' ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
                    )}>
                      <Server className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold tracking-tight">{tenant.name}</h3>
                        <Badge className={cn(
                          "text-[10px] uppercase font-bold tracking-widest h-6 px-2.5 border-none",
                          tenant.status === 'active' 
                            ? "bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                            : "bg-rose-500 text-white"
                        )}>
                          {tenant.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                        <Globe className="w-3.5 h-3.5 text-primary" /> <span className="font-mono text-xs">{tenant.domain}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 max-w-lg">
                    <div className="bg-muted/30 dark:bg-muted/10 p-4 rounded-2xl border border-border/50 flex items-center justify-between gap-4 group hover:bg-muted/50 transition-colors">
                      <div className="space-y-1.5">
                        <p className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-[0.2em]">License Signature</p>
                        <code className="text-xs font-mono font-bold text-primary tracking-tight truncate block">{tenant.licenseKey}</code>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 hover:bg-background/80 hover:text-primary shrink-0 transition-all active:scale-90"
                        onClick={() => copyToClipboard(tenant.licenseKey)}
                      >
                        {copiedKey === tenant.licenseKey ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 px-6 font-bold border-primary/20 hover:bg-primary/5 transition-all">Node Details</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary/10">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 glass">
                        <DropdownMenuItem onClick={() => statusMutation.mutate(tenant.id)} className="py-2.5 cursor-pointer">
                          {tenant.status === 'active' ? (
                            <>
                              <ShieldAlert className="w-4 h-4 mr-3 text-rose-500" />
                              <span className="font-semibold">Suspend Node</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4 mr-3 text-cyan-500" />
                              <span className="font-semibold">Authorize Node</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive py-2.5 font-semibold cursor-pointer" onClick={() => deleteMutation.mutate(tenant.id)}>
                          <Trash2 className="w-4 h-4 mr-3" /> Purge Node Data
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
function Globe(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}