import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Server, Plus, Copy, Check, ExternalLink, MoreVertical, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react';
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
      toast.success('Tenant created successfully!');
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to create tenant'),
  });
  const statusMutation = useMutation({
    mutationFn: (id: string) => api<Tenant>(`/api/tenants/${id}/status`, { method: 'PATCH' }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success(`Tenant ${updated.status === 'active' ? 'activated' : 'suspended'}`);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/tenants/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Tenant deleted');
    },
  });
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success('License key copied');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
            <p className="text-muted-foreground">Manage your GSM service installations and licenses.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="mr-2 h-4 w-4" /> New Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create New Tenant</DialogTitle>
                  <DialogDescription>
                    Add a new GSM installation. The license will bind strictly to the provided domain.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Installation Name</Label>
                    <Input id="name" name="name" placeholder="e.g. Asia Branch Hub" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="domain">Target Domain</Label>
                    <Input id="domain" name="domain" placeholder="gsm.example.com" required />
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Crucial: Must match production domain exactly.</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Provisioning..." : "Create Tenant"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : data?.items.length === 0 ? (
            <Card className="border-dashed py-24 text-center border-2 bg-muted/5">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6 shadow-sm">
                <Server className="text-muted-foreground w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">No tenants found</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Start protecting your GSM services by creating your first installation.</p>
              <Button onClick={() => setIsCreateOpen(true)} size="lg" className="rounded-full px-8">Create First Tenant</Button>
            </Card>
          ) : (
            data?.items.map((tenant) => (
              <Card key={tenant.id} className={cn(
                "overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300",
                tenant.status === 'suspended' && "opacity-80 grayscale-[0.5]"
              )}>
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                        tenant.status === 'active' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        <Server className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold tracking-tight">{tenant.name}</h3>
                          <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'} className={cn(
                            "text-[10px] uppercase font-bold tracking-wider h-5 px-1.5",
                            tenant.status === 'active' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          )}>
                            {tenant.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <ExternalLink className="w-3 h-3" /> <span className="font-mono">{tenant.domain}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 max-w-sm">
                      <div className="bg-muted/40 dark:bg-muted/20 p-3 rounded-xl border border-border/50 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-widest">Signed License Key</p>
                          <code className="text-[11px] font-mono font-bold tracking-tight">{tenant.licenseKey}</code>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-background"
                          onClick={() => copyToClipboard(tenant.licenseKey)}
                        >
                          {copiedKey === tenant.licenseKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 opacity-50" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-9 px-4 font-semibold">Manage</Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => statusMutation.mutate(tenant.id)}>
                            {tenant.status === 'active' ? (
                              <>
                                <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />
                                <span>Suspend License</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" />
                                <span>Activate License</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(tenant.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Installation
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
    </div>
  );
}