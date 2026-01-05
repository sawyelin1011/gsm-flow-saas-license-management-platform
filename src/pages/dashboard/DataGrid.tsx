import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, MoreHorizontal, Trash2, Loader2, Copy, Globe, Key, Clock, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Tenant, UserProfile } from '@shared/types';
import { cn } from '@/lib/utils';
export function DataGrid() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const { data: profile } = useQuery<UserProfile>({ queryKey: ['me'], queryFn: () => api<UserProfile>('/api/me') });
  const { data, isLoading } = useQuery<{ items: Tenant[] }>({ queryKey: ['tenants'], queryFn: () => api<{ items: Tenant[] }>('/api/tenants') });
  const addMutation = useMutation({
    mutationFn: (vals: { name: string; domain: string }) => api<Tenant>('/api/tenants', { method: 'POST', body: JSON.stringify(vals) }),
    onSuccess: (newTenant) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setIsAddOpen(false);
      toast.success('GSM Tenant provisioned successfully');
      // Post-provisioning workflow: Automatic copy
      if (navigator?.clipboard) {
        navigator.clipboard.writeText(newTenant.license.key);
        toast.info('Signed license key copied to clipboard for node deployment', {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        });
      }
    },
    onError: (err: any) => {
      if (err.code === 'PLAN_LIMIT_REACHED') {
        toast.error('Authority limit reached. Please upgrade your GSM plan.');
      } else {
        toast.error(err.message || 'Provisioning failed');
      }
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/tenants/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Registry record purged from Edge authority');
      setDeletingId(null);
    }
  });
  const filteredItems = data?.items?.filter(it => 
    it.name.toLowerCase().includes(search.toLowerCase()) || 
    it.domain.toLowerCase().includes(search.toLowerCase())
  ) ?? [];
  const atLimit = profile ? profile.tenantCount >= profile.plan.tenantLimit : false;
  const handleCopyKey = async (key: string) => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(key);
      toast.success('Cluster license key copied to registry buffer');
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search operator registry..." 
            className="pl-10 h-12 text-xs font-bold border-border/50 bg-background/50 focus:ring-primary shadow-sm" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button disabled={atLimit} className="btn-gradient font-black h-12 px-10 text-[10px] uppercase tracking-widest shadow-glow w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> {atLimit ? 'Authority Limit Reached' : 'Provision GSM Tenant'}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Register GSM Cluster
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-tight opacity-70">Generate a cryptographically signed license for a new service domain node.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              addMutation.mutate({ name: fd.get('name') as string, domain: fd.get('domain') as string });
            }} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Cluster Identifier</Label>
                <Input name="name" placeholder="GSM-NODE-SOUTH-01" required className="h-12 text-xs font-bold border-border/50 bg-background/50 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Service Domain Binding</Label>
                <Input name="domain" placeholder="gsm.cluster.local" required className="h-12 text-xs font-bold border-border/50 bg-background/50 focus:ring-primary" />
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-1">
                <p className="text-[10px] font-black uppercase text-primary">Authority Note</p>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter leading-relaxed">License keys are domain-locked. Ensure the domain matches your target node deployment precisely.</p>
              </div>
              <DialogFooter className="pt-2">
                <Button type="submit" disabled={addMutation.isPending} className="btn-gradient w-full h-12 text-[10px] font-black uppercase tracking-widest shadow-glow">
                  {addMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
                  Authorize & Sign GSM License
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 shadow-soft overflow-hidden rounded-2xl">
        <CardHeader className="border-b bg-muted/5 py-4 px-8">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Global Tenant Authority Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="h-14 border-b">
                  <TableHead className="text-[10px] font-black uppercase pl-8 tracking-widest text-muted-foreground">Tenant / Installation</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service Domain Binding</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-center tracking-widest text-muted-foreground">License State</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Auth Pulse</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-right pr-8 tracking-widest text-muted-foreground">Commands</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="h-64 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-primary opacity-50" /></TableCell></TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-64 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">No records found in authority database registry.</TableCell></TableRow>
                ) : filteredItems.map((tenant) => (
                  <TableRow key={tenant.id} className="group hover:bg-primary/[0.02] border-b last:border-0 transition-colors h-16">
                    <TableCell className="pl-8 py-4 font-black text-xs uppercase tracking-tighter group-hover:text-primary transition-colors">{tenant.name}</TableCell>
                    <TableCell className="py-4 text-[10px] font-mono font-black text-muted-foreground uppercase opacity-80 tracking-tight">{tenant.domain}</TableCell>
                    <TableCell className="py-4 text-center">
                      <Badge variant="outline" className={cn(
                        "text-[9px] uppercase font-black border-none py-1 px-3", 
                        tenant.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                      )}>
                        {tenant.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-70">
                      {tenant.lastValidated ? format(tenant.lastValidated, 'MMM dd, HH:mm') : 'NO SIGNAL'}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                          onClick={() => handleCopyKey(tenant.license.key)}
                          title="Quick Copy Key"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-muted transition-all">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass w-64 p-2">
                            <DropdownMenuItem 
                              onClick={() => handleCopyKey(tenant.license.key)}
                              className="text-[10px] font-black uppercase py-3 cursor-pointer focus:bg-primary/5 rounded-lg mb-1"
                            >
                              <Key className="mr-3 h-4 w-4 text-primary" /> Copy Signed Cluster Key
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeletingId(tenant.id)} 
                              className="text-[10px] font-black uppercase py-3 text-destructive cursor-pointer focus:bg-destructive/10 rounded-lg"
                            >
                              <Trash2 className="mr-3 h-4 w-4" /> Revoke Node Authority
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-destructive mb-2">
              <AlertTriangle className="w-6 h-6" />
              <AlertDialogTitle className="text-sm font-black uppercase tracking-widest">Revocation Protocol Triggered</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs font-medium leading-relaxed uppercase opacity-80">
              Permanently revoke GSM Tenant authority? This causes immediate service termination for the bound cluster node and purges the signed license from the Edge Registry. <span className="text-destructive font-black">This action cannot be reversed.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-6">
            <AlertDialogCancel className="text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl border-border/50">Abort Command</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingId && deleteMutation.mutate(deletingId)} 
              className="bg-destructive text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 hover:bg-destructive/90 rounded-xl shadow-glow shadow-destructive/20"
            >
              Confirm Revocation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}