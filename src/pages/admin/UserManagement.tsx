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
  CheckCircle2
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
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export function UserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const { data: users, isLoading } = useQuery<any[]>({
    queryKey: ['admin-users'],
    queryFn: () => api('/api/admin/users'),
  });
  const updatePlanMutation = useMutation({
    mutationFn: ({ id, planId }: { id: string; planId: string }) =>
      api(`/api/admin/users/${id}/plan`, { 
        method: 'POST', 
        body: JSON.stringify({ planId }) 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User subscription adjusted');
    },
    onError: (err: any) => toast.error(err?.message || 'Update failed')
  });
  const filteredUsers = users?.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Clusters</h1>
          <p className="text-muted-foreground">Manage global subscription access and operational authority.</p>
        </div>
        <Button className="btn-gradient shadow-glow">
          <UserPlus className="mr-2 h-4 w-4" /> Provision Account
        </Button>
      </div>
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/5 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg">Directory</CardTitle>
              <CardDescription>Registry of {users?.length || 0} distributed operators.</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by identity or email..."
                className="pl-9 bg-background/50 border-border/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[300px]">Operator</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Authorized On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Synchronizing Directory...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No matching operators found in the registry.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers?.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/5 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{user.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-[10px] font-black border-primary/10">
                          {user.planId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">Active</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-[10px] font-mono">
                        {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 glass">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Operator Command</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => window.location.href = `mailto:${user.email}`}>
                              <Mail className="mr-2 h-4 w-4 text-primary" /> Email Identity
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="font-bold"
                              disabled={user.planId === 'professional' || updatePlanMutation.isPending}
                              onClick={() => updatePlanMutation.mutate({ id: user.id, planId: 'professional' })}
                            >
                              {updatePlanMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Shield className="mr-2 h-4 w-4 text-cyan-500" />
                              )}
                              Elevate to Professional
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="font-bold"
                              disabled={user.planId === 'enterprise' || updatePlanMutation.isPending}
                              onClick={() => updatePlanMutation.mutate({ id: user.id, planId: 'enterprise' })}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4 text-indigo-500" /> Elevate to Enterprise
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive font-bold focus:bg-destructive/10">
                              <Ban className="mr-2 h-4 w-4" /> Revoke Authority
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}