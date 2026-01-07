import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Loader2,
  Copy,
  Globe,
  Key,
  Clock,
  AlertTriangle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Tenant } from '@shared/types';
export function DataGrid() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const { data, isLoading } = useQuery<{ items: Tenant[] }>({
    queryKey: ['tenants'],
    queryFn: () => api<{ items: Tenant[] }>('/api/tenants'),
  });
  const addMutation = useMutation({
    mutationFn: (vals: { name: string; domain: string }) =>
      api<Tenant>('/api/tenants', { method: 'POST', body: JSON.stringify(vals) }),
    onSuccess: (newTenant) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setIsAddOpen(false);
      toast.success(`GSM Tenant ${newTenant.name} provisioned`);
      navigator.clipboard.writeText(newTenant.license.key);
      toast.info('Signed license key copied to clipboard');
    },
    onError: (err: any) => toast.error(err.message || 'Provisioning failed')
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/tenants/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Tenant record purged from authority registry');
      setDeletingId(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Deletion failed');
      setDeletingId(null);
    }
  });
  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('License key synchronized to clipboard');
  };
  const filteredItems = data?.items?.filter(it =>
    it.name.toLowerCase().includes(search.toLowerCase()) ||
    it.domain.toLowerCase().includes(search.toLowerCase())
  ) ?? [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search GSM licenses or service domains..."
            className="pl-9 h-10 text-xs font-medium border-border/50 bg-background/50 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient font-black h-10 text-xs px-6 uppercase tracking-widest shadow-glow hover:scale-[1.02] transition-transform">
              <Plus className="mr-2 h-4 w-4" /> Provision GSM Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md glass">
            <DialogHeader>
              <DialogTitle className="text-sm font-black uppercase tracking-widest">New GSM Tenant Installation</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">Register a new service cluster to generate a bound cryptographic license.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const name = fd.get('name') as string;
              const domain = (fd.get('domain') as string).toLowerCase().trim();
              if (!domain.includes('.')) {
                return toast.error('Invalid domain: Must be a fully qualified domain name (FQDN)');
              }
              addMutation.mutate({ name, domain });
            }} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Tenant Identity</Label>
                <Input id="name" name="name" placeholder="e.g. London-Service-Cluster" required className="h-10 text-xs bg-background/50" minLength={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Service Domain Binding</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/40" />
                  <Input id="domain" name="domain" placeholder="gsm.london.service" className="h-10 text-xs pl-10 bg-background/50" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addMutation.isPending} className="btn-gradient w-full h-11 text-xs font-black uppercase tracking-widest">
                  {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Generate GSM License"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 overflow-hidden shadow-soft">
        <CardHeader className="border-b bg-muted/5 py-4 px-6">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Key className="w-3 h-3 text-primary" /> License Management Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b h-12">
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em] pl-6">Tenant Identity</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em]">Service Domain</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em] text-center">Status</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em]">Last Validated</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em]">Signed Key</TableHead>
                <TableHead className="text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="h-48 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center space-y-3">
                    <p className="text-xs text-muted-foreground font-black italic uppercase tracking-widest opacity-40">Registry empty: No active licenses found</p>
                    <Button variant="outline" size="sm" onClick={() => setIsAddOpen(true)} className="h-8 text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary">
                      Provision First Cluster
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((tenant) => (
                  <TableRow key={tenant.id} className="group hover:bg-primary/[0.02] transition-colors border-b last:border-0">
                    <TableCell className="pl-6 py-4 font-bold text-xs uppercase text-foreground">{tenant.name}</TableCell>
                    <TableCell className="py-4 text-[10px] font-mono text-muted-foreground uppercase">{tenant.domain}</TableCell>
                    <TableCell className="py-4 text-center">
                      <Badge variant="outline" className={cn(
                        "text-[9px] uppercase font-black px-1.5 h-5 border-none",
                        tenant.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                      )}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-[10px] font-bold text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {tenant.lastValidated ? format(tenant.lastValidated, 'MMM dd, HH:mm') : 'Never'}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-[10px] bg-muted px-2 py-1 rounded font-mono text-primary font-black uppercase">{tenant.license.key.slice(0, 12)}...</code>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground/50 hover:text-primary" onClick={() => copyKey(tenant.license.key)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 glass">
                          <DropdownMenuItem className="text-destructive font-black text-[10px] uppercase tracking-widest focus:bg-destructive/10 cursor-pointer" onClick={() => setDeletingId(tenant.id)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Decommission Node
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-destructive mb-2">
              <AlertTriangle className="w-6 h-6" />
              <AlertDialogTitle className="text-lg font-black uppercase tracking-tight">Critical Revocation</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm font-medium leading-relaxed">
              You are about to permanently decommission this GSM Tenant installation. This action will <span className="text-destructive font-bold">revoke all active licenses</span> bound to this node, causing immediate service interruption for the cluster.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 text-[10px] font-black uppercase tracking-widest rounded-lg border-border/50">Abort Mission</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="h-10 text-[10px] font-black uppercase tracking-widest rounded-lg bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20 border-none"
            >
              Confirm Decommission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}