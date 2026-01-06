import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Server, Plus, Copy, Check, ExternalLink, MoreVertical, Trash2, ShieldAlert, ShieldCheck, Search, Globe } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { Tenant } from '@shared/types';
import { cn } from '@/lib/utils';
const DOMAIN_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
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
    onError: (err: any) => {
      toast.error(err?.message || 'Provisioning failed');
    },
  });
  const statusMutation = useMutation({
    mutationFn: (id: string) => api<Tenant>(`/api/tenants/${id}/status`, { method: 'PATCH' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/tenants/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants'] }),
  });
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string).trim();
    const domain = (formData.get('domain') as string).trim();
    if (name.length < 3) return toast.error('Identifier too short');
    if (!DOMAIN_REGEX.test(domain)) return toast.error('Invalid domain');
    createMutation.mutate({ name, domain });
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success('Key copied');
    setTimeout(() => setCopiedKey(null), 2000);
  };
  return (
    <div className="space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Active Nodes</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage distributed GSM service installations.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient shadow-glow font-bold h-11 w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" /> Provision Node
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] w-[95vw] rounded-2xl glass">
            <form onSubmit={handleCreate} className="space-y-6">
              <DialogHeader>
                <DialogTitle>Provision New Node</DialogTitle>
                <DialogDescription>Enter details for the target deployment cluster.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Node Identifier</Label>
                  <Input id="name" name="name" placeholder="EU Production" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="domain">Target Domain</Label>
                  <Input id="domain" name="domain" placeholder="gsm.cluster.local" required />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending} className="btn-gradient font-bold">
                  {createMutation.isPending ? "Deploying..." : "Finalize Deployment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {isLoading ? (
          <div className="py-20 flex justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div>
        ) : data?.items.length === 0 ? (
          <Card className="border-dashed py-16 text-center bg-muted/5 col-span-full px-4">
            <Server className="text-muted-foreground w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold">No nodes provisioned</h3>
            <p className="text-sm text-muted-foreground mb-6">Start by creating your first cluster installation.</p>
            <Button onClick={() => setIsCreateOpen(true)} className="btn-gradient px-8 h-10">Create First Node</Button>
          </Card>
        ) : (
          data?.items.map((tenant) => (
            <Card key={tenant.id} className={cn(
              "overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-glow transition-all duration-300",
              tenant.status === 'suspended' && "opacity-75 grayscale-[0.2]"
            )}>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      tenant.status === 'active' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <Server className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold truncate">{tenant.name}</h3>
                        <Badge className={cn(
                          "text-[9px] uppercase font-bold h-5 px-1.5",
                          tenant.status === 'active' ? "bg-cyan-500" : "bg-rose-500"
                        )}>
                          {tenant.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono truncate">
                        <Globe className="w-3 h-3 text-primary shrink-0" /> {tenant.domain}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 w-full max-w-sm lg:max-w-md">
                    <div className="bg-muted/30 p-3 rounded-xl border border-border/50 flex items-center justify-between gap-3 group">
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-wider truncate">Signature</p>
                        <code className="text-xs font-mono font-bold text-primary truncate block">{tenant.licenseKey}</code>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-background shrink-0"
                        onClick={() => copyToClipboard(tenant.licenseKey)}
                      >
                        {copiedKey === tenant.licenseKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end shrink-0">
                    <Button variant="outline" size="sm" className="h-9 px-4 font-bold border-primary/20 hover:bg-primary/5 hidden sm:flex">Details</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 glass">
                        <DropdownMenuItem onClick={() => statusMutation.mutate(tenant.id)}>
                          <ShieldCheck className="w-4 h-4 mr-2" /> {tenant.status === 'active' ? 'Suspend' : 'Authorize'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(tenant.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Node
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