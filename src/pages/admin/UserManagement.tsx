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
  CheckCircle2,
  Lock
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
      toast.success('Operator subscription tier updated');
    },
    onError: (err: any) => toast.error(err?.message || 'Update failed')
  });
  const filteredUsers = React.useMemo(() => {
    return users?.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    ) ?? [];
  }, [users, search]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground">Operator Clusters</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage global subscription registry and authority levels.</p>
        </div>
        <Button className="btn-gradient w-full sm:w-auto font-black h-11 text-xs uppercase tracking-widest px-8">
          <UserPlus className="mr-2 h-4 w-4" /> Provision Operator
        </Button>
      </div>
      <Card className="border-border/50 shadow-sm overflow-hidden flex flex-col">
        <CardHeader className="bg-muted/5 border-b p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground">Registry Directory</CardTitle>
              <CardDescription className="text-xs">Database of {users?.length || 0} distributed operators.</CardDescription>
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search identity or registry email..."
                className="pl-9 bg-background/50 border-border/50 h-10 text-xs font-medium focus:ring-primary"
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
                  <TableHead className="min-w-[200px] text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-6">Operator Identity</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subscription Tier</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registry Authority</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground pr-6">Command</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Syncing Authority Registry...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic text-sm">
                      No matching operator identities found in global registry.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-primary/[0.01] transition-colors group border-b last:border-0">
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-xs uppercase text-foreground group-hover:text-primary transition-colors">{user.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-[9px] font-black border-primary/20 bg-primary/5 text-primary">
                          {user.planId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[10px] font-black uppercase tracking-tighter text-foreground">Authorized</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-[10px] font-mono">
                        {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 text-muted-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 glass">
                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Registry Command</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => window.location.href = `mailto:${user.email}`} className="text-xs font-bold focus:bg-primary/5">
                              <Mail className="mr-2 h-3.5 w-3.5 text-primary" /> Contact Operator
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-xs font-bold focus:bg-primary/5"
                              disabled={user.planId === 'pro' || updatePlanMutation.isPending}
                              onClick={() => updatePlanMutation.mutate({ id: user.id, planId: 'pro' })}
                            >
                              <Shield className="mr-2 h-3.5 w-3.5 text-cyan-500" /> Elevate: Pro Cluster
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-xs font-bold focus:bg-primary/5"
                              disabled={user.planId === 'enterprise' || updatePlanMutation.isPending}
                              onClick={() => updatePlanMutation.mutate({ id: user.id, planId: 'enterprise' })}
                            >
                              <Lock className="mr-2 h-3.5 w-3.5 text-indigo-500" /> Elevate: Carrier Tier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive text-xs font-black focus:bg-destructive/10">
                              <Ban className="mr-2 h-3.5 w-3.5" /> Revoke Node Authority
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
  );
}