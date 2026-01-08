import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, MoreHorizontal, Trash2, Loader2, Copy, Globe, Key, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
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
      if (navigator?.clipboard) {
        navigator.clipboard.writeText(newTenant.license.key);
        toast.info('Signed license key copied to clipboard');
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
      toast.success('Registry record purged');
      setDeletingId(null);
    }
  });
  const filteredItems = data?.items?.filter(it => it.name.toLowerCase().includes(search.toLowerCase()) || it.domain.toLowerCase().includes(search.toLowerCase())) ?? [];
  const atLimit = profile ? profile.tenantCount >= profile.plan.tenantLimit : false;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search operator registry..." className="pl-10 h-11 text-xs font-bold border-border/50 bg-background/50" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button disabled={atLimit} className="btn-gradient font-black h-11 text-[10px] px-8 uppercase tracking-widest shadow-glow">
                <Plus className="mr-2 h-4 w-4" /> {atLimit ? 'Authority Limit Reached' : 'Provision GSM Tenant'}
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader>
                <DialogTitle className="text-sm font-black uppercase tracking-[0.15em]">Register GSM Cluster</DialogTitle>
                <DialogDescription className="text-[10px] font-bold uppercase tracking-tight opacity-70">Generate a cryptographically signed license for a new service domain node.</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                addMutation.mutate({ name: fd.get('name') as string, domain: fd.get('domain') as string });
              }} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Cluster Identifier</Label>
                  <Input name="name" placeholder="GSM-NODE-SOUTH-01" required className="h-11 text-xs font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Service Domain Binding</Label>
                  <Input name="domain" placeholder="gsm.cluster.local" required className="h-11 text-xs font-bold" />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={addMutation.isPending} className="btn-gradient w-full h-12 text-[10px] font-black uppercase tracking-widest">
                    {addMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize & Sign GSM License"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="border-border/50 shadow-soft overflow-hidden">
          <CardHeader className="border-b bg-muted/5 py-4 px-6">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Global Tenant Authority Registry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="h-12 border-b">
                  <TableHead className="text-[9px] font-black uppercase pl-8 tracking-widest">Tenant / Installation</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest">Service Domain Binding</TableHead>
                  <TableHead className="text-[9px] font-black uppercase text-center tracking-widest">License Status</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest">Last Auth Pulse</TableHead>
                  <TableHead className="text-[9px] font-black uppercase text-right pr-8 tracking-widest">Commands</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="h-64 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-64 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">No records found in authority database.</TableCell></TableRow>
                ) : filteredItems.map((tenant) => (
                  <TableRow key={tenant.id} className="group hover:bg-primary/[0.02] border-b last:border-0">
                    <TableCell className="pl-8 py-5 font-black text-xs uppercase tracking-tighter group-hover:text-primary transition-colors">{tenant.name}</TableCell>
                    <TableCell className="py-5 text-[10px] font-mono font-bold text-muted-foreground uppercase opacity-80">{tenant.domain}</TableCell>
                    <TableCell className="py-5 text-center">
                      <Badge variant="outline" className={cn("text-[9px] uppercase font-black border-none py-0.5 px-2", tenant.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 text-[10px] font-bold text-muted-foreground uppercase">
                      {tenant.lastValidated ? format(tenant.lastValidated, 'MMM dd, HH:mm') : 'NO PULSE'}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass w-56">
                          <DropdownMenuItem onClick={async () => { if (navigator?.clipboard) { await navigator.clipboard.writeText(tenant.license.key); toast.success('License key copied'); } }} className="text-[10px] font-black uppercase py-2 cursor-pointer focus:bg-primary/5"><Copy className="mr-2 h-3.5 w-3.5" /> Copy Signed Key</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletingId(tenant.id)} className="text-[10px] font-black uppercase py-2 text-destructive cursor-pointer focus:bg-destructive/10"><Trash2 className="mr-2 h-3.5 w-3.5" /> Revoke Authority</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-black uppercase tracking-widest">Revocation Protocol Triggered</AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-medium leading-relaxed">
              Permanently revoke GSM Tenant authority? This causes immediate service termination for the bound service cluster node and purges the signed license from the Edge Registry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel className="text-[10px] font-black uppercase tracking-widest h-11 px-6">Abort Command</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)} className="bg-destructive text-white text-[10px] font-black uppercase tracking-widest h-11 px-6 hover:bg-destructive/90">Confirm Revocation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}