import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Server, Plus, Copy, Check, MoreVertical, Trash2, ShieldAlert, ShieldCheck, Globe, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
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
      setIsCreateOpen(false);
      toast.success('Node provisioned');
    },
    onError: (err: any) => toast.error(err?.message || 'Failed'),
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
    if (!DOMAIN_REGEX.test(domain)) return toast.error('Invalid domain');
    createMutation.mutate({ name, domain });
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success('Copied');
    setTimeout(() => setCopiedKey(null), 2000);
  };
  return (
    <div className="space-y-6 max-w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Active Nodes</h1>
          <p className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-widest font-black">Cluster Fleet</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="btn-gradient shadow-glow font-bold">
              <Plus className="mr-1 h-4 w-4" /> Provision
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] sm:max-w-md rounded-xl">
            <form onSubmit={handleCreate} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Provision Node</DialogTitle>
                <DialogDescription>Add a new installation target.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <Label>Identifier</Label>
                  <Input name="name" placeholder="Production EU" required />
                </div>
                <div className="space-y-1">
                  <Label>FQDN Domain</Label>
                  <Input name="domain" placeholder="node.gsmflow.com" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending} className="w-full btn-gradient">
                  {createMutation.isPending ? "Signing..." : "Provision Node"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.items.map((tenant) => (
            <Card key={tenant.id} className="overflow-hidden border-border/50 group">
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm",
                      tenant.status === 'active' ? "bg-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold truncate max-w-[120px]">{tenant.name}</h3>
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-mono">
                        <Globe className="w-2.5 h-2.5" /> {tenant.domain}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => statusMutation.mutate(tenant.id)}>
                        {tenant.status === 'active' ? <ShieldAlert className="w-4 h-4 mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                        Toggle Auth
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(tenant.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Purge
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="bg-muted/30 p-2 rounded-lg border border-border/50 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] uppercase font-black text-muted-foreground/60 tracking-widest mb-0.5">Key Signature</p>
                    <code className="text-[10px] font-mono font-bold text-primary truncate block">{tenant.licenseKey}</code>
                  </div>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copyToClipboard(tenant.licenseKey)}>
                    {copiedKey === tenant.licenseKey ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}