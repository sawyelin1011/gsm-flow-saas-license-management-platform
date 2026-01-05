import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Shield,
  Ban,
  Mail,
  Loader2,
  Lock,
  ChevronRight,
  Database
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
export function UserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const { data: users, isLoading } = useQuery<any[]>({
    queryKey: ['admin-users'],
    queryFn: () => api<any[]>('/api/admin/users'),
  });
  const updatePlanMutation = useMutation({
    mutationFn: ({ id, planId }: { id: string; planId: string }) =>
      api(`/api/admin/users/${id}/plan`, {
        method: 'POST',
        body: JSON.stringify({ planId })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('GSM Operator subscription tier successfully elevated');
    },
    onError: (err: any) => toast.error(err?.message || 'Authority update failed')
  });
  const filteredUsers = React.useMemo(() => {
    return users?.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    ) ?? [];
  }, [users, search]);
  const handleProvisionRequest = () => {
    toast.info('Direct GSM Operator Provisioning is restricted to Master Admin terminals.');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground">GSM Operator Registry</h1>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-primary" />
              Manage global GSM cluster subscription authority and operator access tiers.
            </p>
          </div>
          <Button onClick={handleProvisionRequest} className="btn-gradient w-full sm:w-auto font-black h-11 text-[10px] uppercase tracking-widest px-8 shadow-glow">
            <UserPlus className="mr-2 h-4 w-4" /> Provision GSM Operator
          </Button>
        </div>
        <Card className="border-border/50 shadow-soft overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/5 border-b p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-primary" /> Operator Directory
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Global database of {users?.length || 0} distributed GSM operators.</CardDescription>
              </div>
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search operator identity or registry email..."
                  className="pl-10 bg-background/50 border-border/50 h-11 text-xs font-bold focus:ring-primary shadow-inner"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="min-w-[250px] text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-8 h-12">GSM Operator Identity</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Authority Tier</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Registry Date</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground pr-8 h-12">Command</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="h-10 w-10 animate-spin text-primary" />
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Syncing Master Operator Registry...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center text-muted-foreground italic text-sm uppercase font-black tracking-widest opacity-30">
                        No matching identities found in operator database.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-primary/[0.02] transition-colors group border-b last:border-0">
                        <TableCell className="pl-8 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="font-black text-xs uppercase text-foreground group-hover:text-primary transition-colors tracking-tighter">{user.name}</span>
                            <span className="text-[10px] font-mono font-bold text-muted-foreground opacity-70 tracking-tight">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "capitalize text-[9px] font-black px-2.5 py-1 border-none",
                            user.planId === 'agency' ? "bg-indigo-500/10 text-indigo-600" :
                            user.planId === 'growth' ? "bg-cyan-500/10 text-cyan-600" : "bg-slate-500/10 text-slate-600"
                          )}>
                            {user.planId.toUpperCase()} TIER
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="relative h-2 w-2">
                              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                              <div className="h-full w-full rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Authorized</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-[10px] font-mono font-black uppercase">
                          {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : format(new Date(), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right pr-8 py-5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted text-muted-foreground transition-colors">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass w-64">
                              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 py-3 px-3">GSM Operator Management</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => window.location.href = `mailto:${user.email}`} className="text-[10px] font-black uppercase py-2.5 focus:bg-primary/5 cursor-pointer px-3">
                                <Mail className="mr-2 h-4 w-4 text-primary" /> Contact Operator
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-[10px] font-black uppercase py-2.5 focus:bg-cyan-500/10 cursor-pointer px-3"
                                disabled={user.planId === 'growth' || updatePlanMutation.isPending}
                                onClick={() => updatePlanMutation.mutate({ id: user.id, planId: 'growth' })}
                              >
                                <Shield className="mr-2 h-4 w-4 text-cyan-500" /> Elevate: GROWTH TIER
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-[10px] font-black uppercase py-2.5 focus:bg-indigo-500/10 cursor-pointer px-3"
                                disabled={user.planId === 'agency' || updatePlanMutation.isPending}
                                onClick={() => updatePlanMutation.mutate({ id: user.id, planId: 'agency' })}
                              >
                                <Lock className="mr-2 h-4 w-4 text-indigo-500" /> Elevate: AGENCY TIER
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive text-[10px] font-black uppercase py-2.5 focus:bg-destructive/10 cursor-pointer px-3">
                                <Ban className="mr-2 h-4 w-4" /> Revoke GSM Node Authority
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}