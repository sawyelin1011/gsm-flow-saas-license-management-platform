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
      toast.success('GSM Tenant provisioned');
      navigator.clipboard.writeText(newTenant.license.key);
      toast.info('Signed license key copied to clipboard');
    },
    onError: (err: any) => {
      if (err.code === 'PLAN_LIMIT_REACHED') {
        toast.error('Authority limit reached. Please upgrade your plan.');
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search registry..." className="pl-9 h-10 text-xs font-bold" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button disabled={atLimit} className="btn-gradient font-black h-10 text-xs px-6 uppercase tracking-widest shadow-glow">
              <Plus className="mr-2 h-4 w-4" /> {atLimit ? 'Limit Reached' : 'Provision GSM Tenant'}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle className="text-sm font-black uppercase tracking-widest">Register Cluster</DialogTitle>
              <DialogDescription className="text-xs">Generate a cryptographically signed license for a new service domain.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              addMutation.mutate({ name: fd.get('name') as string, domain: fd.get('domain') as string });
            }} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Cluster Name</Label>
                <Input name="name" placeholder="Service Node 01" required className="h-10 text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Service Domain Binding</Label>
                <Input name="domain" placeholder="gsm.cluster.com" required className="h-10 text-xs" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addMutation.isPending} className="btn-gradient w-full h-11 text-xs font-black">
                  {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize & Sign License"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 shadow-soft overflow-hidden">
        <CardHeader className="border-b bg-muted/5 py-4 px-6">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Authority Database
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="h-12 border-b">
                <TableHead className="text-[9px] font-black uppercase pl-6">Tenant</TableHead>
                <TableHead className="text-[9px] font-black uppercase">Domain</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-center">Status</TableHead>
                <TableHead className="text-[9px] font-black uppercase">Last Active</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-right pr-6">Commands</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="h-48 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : filteredItems.map((tenant) => (
                <TableRow key={tenant.id} className="group hover:bg-primary/[0.02]">
                  <TableCell className="pl-6 py-4 font-bold text-xs uppercase">{tenant.name}</TableCell>
                  <TableCell className="py-4 text-[10px] font-mono text-muted-foreground uppercase">{tenant.domain}</TableCell>
                  <TableCell className="py-4 text-center">
                    <Badge variant="outline" className={cn("text-[9px] uppercase font-black border-none", tenant.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-[10px] font-bold text-muted-foreground">
                    {tenant.lastValidated ? format(tenant.lastValidated, 'MMM dd, HH:mm') : 'Never'}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(tenant.license.key); toast.success('Key copied'); }} className="text-[10px] font-bold uppercase"><Copy className="mr-2 h-3 w-3" /> Copy Key</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeletingId(tenant.id)} className="text-[10px] font-bold uppercase text-destructive"><Trash2 className="mr-2 h-3 w-3" /> Decommission</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-black uppercase">Revocation Warning</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">Permanently revoke cluster authority? This causes immediate service termination for the bound node.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[10px] font-bold uppercase">Abort</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)} className="bg-destructive text-[10px] font-bold uppercase">Confirm Revocation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}