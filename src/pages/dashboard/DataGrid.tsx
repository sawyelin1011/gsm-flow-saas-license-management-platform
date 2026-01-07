import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Server,
  Loader2,
  Copy,
  Globe,
  Check
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
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Tenant } from '@shared/types';
export function DataGrid() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const { data, isLoading } = useQuery<{ items: Tenant[] }>({
    queryKey: ['tenants'],
    queryFn: () => api<{ items: Tenant[] }>('/api/tenants'),
  });
  const addMutation = useMutation({
    mutationFn: (vals: any) => api<Tenant>('/api/tenants', { method: 'POST', body: JSON.stringify(vals) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsAddOpen(false);
      toast.success('Tenant provisioned successfully');
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/tenants/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant record purged');
    }
  });
  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('License key copied to clipboard');
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
            placeholder="Search clusters or domains..."
            className="pl-9 h-10 text-xs font-medium border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient font-black h-10 text-xs px-6 uppercase tracking-widest"><Plus className="mr-2 h-4 w-4" /> Provision Node</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-black uppercase tracking-widest">New GSM Installation</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">Register a new self-hosted cluster and generate its signed key.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              addMutation.mutate({
                name: fd.get('name') as string,
                domain: fd.get('domain') as string
              });
            }} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] uppercase font-bold text-muted-foreground">Cluster Name</Label>
                <Input id="name" name="name" placeholder="e.g. EU-West-01" required className="h-10 text-xs" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-[10px] uppercase font-bold text-muted-foreground">Target Domain</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/40" />
                  <Input id="domain" name="domain" placeholder="gsm.cluster.local" className="h-10 text-xs pl-10" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={addMutation.isPending} className="btn-gradient w-full h-11 text-xs font-black uppercase tracking-widest">
                  {addMutation.isPending ? "Generating Authority..." : "Issue License & Provision"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="border-b bg-muted/5 py-3 px-4">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Server className="w-3 h-3" /> Tenant Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em] pl-6 h-10">Installation</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em] h-10">Target Domain</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em] h-10">Status</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.15em] h-10">License Key</TableHead>
                <TableHead className="text-right pr-6 h-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="h-48 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic text-xs">No active installations found.</TableCell></TableRow>
              ) : (
                filteredItems.map((tenant) => (
                  <TableRow key={tenant.id} className="group hover:bg-primary/[0.02] transition-colors border-b last:border-0">
                    <TableCell className="pl-6 py-3 font-bold text-xs">{tenant.name}</TableCell>
                    <TableCell className="py-3 text-[10px] font-mono text-muted-foreground">{tenant.domain}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className={cn(
                        "text-[9px] uppercase font-black px-1.5 h-5 border-none",
                        tenant.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                      )}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <code className="text-[10px] bg-muted/50 px-2 py-1 rounded font-mono text-primary font-bold">{tenant.license.key.slice(0, 10)}...</code>
                    </TableCell>
                    <TableCell className="text-right pr-6 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyKey(tenant.license.key)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="text-destructive font-bold text-xs" onClick={() => deleteMutation.mutate(tenant.id)}>
                              <Trash2 className="mr-2 h-3 w-3" /> Revoke & Purge
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}