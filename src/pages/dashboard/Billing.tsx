import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, CheckCircle2, ReceiptText, ArrowUpCircle, Download, ShieldCheck, Zap, Globe, Lock, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { UserProfile, Invoice } from '@shared/types';
export function Billing() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading: isLoadingProfile } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  const { data: invoices, isLoading: isLoadingInvoices } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: () => api<Invoice[]>('/api/billing/invoices'),
  });
  const upgradeMutation = useMutation({
    mutationFn: (planId: string) => api('/api/me/plan', {
      method: 'POST',
      body: JSON.stringify({ planId })
    }),
    onSuccess: (updatedProfile: any) => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success(`Authority successfully elevated to ${updatedProfile.plan.name}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Upgrade protocol failed');
    }
  });
  const upgradePlans = [
    { id: 'growth', name: 'Growth Plan', price: 149, limit: 10 },
    { id: 'agency', name: 'Agency Plan', price: 499, limit: 100 }
  ];
  const handleUpgrade = (planId: string) => {
    upgradeMutation.mutate(planId);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-primary/20 bg-primary/[0.01] shadow-soft">
          <CardHeader className="py-4 border-b border-primary/10">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Service Authority Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            {isLoadingProfile ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60">Subscription Tier</p>
                  <p className="text-3xl font-black tracking-tighter text-primary uppercase">{profile?.plan?.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> {profile?.plan.tenantLimit} GSM Tenants</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Domain Binding</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Remote Management</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Edge Validation</div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black tracking-tighter">${profile?.plan?.price}<span className="text-xs text-muted-foreground ml-1 uppercase font-medium">/MO</span></p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-muted/5 flex flex-col justify-center p-6 space-y-4 shadow-sm">
          <div>
            <p className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">Cycle Renewal</p>
            <p className="text-2xl font-black tracking-tighter uppercase">{format(new Date().setMonth(new Date().getMonth() + 1), 'MMM dd, yyyy')}</p>
          </div>
          <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest border-border/50 w-full hover:bg-background">Update Payment Method</Button>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 ml-1">
            <ReceiptText className="w-3.5 h-3.5" /> Authority Settlement History
          </h2>
          <Card className="border-border/50 overflow-hidden shadow-soft">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-b h-12">
                    <TableHead className="text-[10px] uppercase font-black pl-8 tracking-widest">Audit ID</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest">Settlement Date</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-center">Amount</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingInvoices ? (
                    Array.from({ length: 3 }).map((_, i) => <TableRow key={i}><TableCell colSpan={4} className="p-4"><Skeleton className="h-12 w-full" /></TableCell></TableRow>)
                  ) : invoices?.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center h-24 text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] italic opacity-30">Registry Empty</TableCell></TableRow>
                  ) : (
                    invoices?.map((inv) => (
                      <TableRow key={inv.id} className="text-xs hover:bg-primary/[0.01] h-12">
                        <TableCell className="font-mono pl-8 text-muted-foreground font-bold">{inv.id.toUpperCase()}</TableCell>
                        <TableCell className="font-bold">{format(inv.date, 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="text-center font-black text-primary">${inv.amount}</TableCell>
                        <TableCell className="text-right pr-8">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Card>
        </div>
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 ml-1">
            Available Add-ons
          </h2>
          <Card className="border-border/50 bg-card p-4 space-y-4 shadow-soft">
            <AddOnItem icon={<Zap className="w-3 h-3 text-cyan-500" />} title="API Access" price="$19/mo" />
            <AddOnItem icon={<Globe className="w-3 h-3 text-cyan-500" />} title="White-labeling" price="$99/mo" />
            <AddOnItem icon={<Lock className="w-3 h-3 text-cyan-500" />} title="Premium SMTP" price="$10/mo" />
          </Card>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 ml-1">
          <ArrowUpCircle className="w-3.5 h-3.5" /> Authority Capacity Scaling
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upgradePlans.filter(p => p.id !== profile?.planId).map((plan) => (
            <Card key={plan.id} className="p-6 border-border/50 hover:border-primary/50 transition-all flex flex-col justify-between h-44 bg-card shadow-soft group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">{plan.name}</h3>
                  <p className="text-3xl font-black tracking-tighter text-primary">${plan.price}<span className="text-[10px] text-muted-foreground ml-1 font-medium uppercase">/MO</span></p>
                </div>
                <Badge variant="outline" className="text-[9px] uppercase font-black border-border/50 px-2 py-0.5">{plan.limit} Tenants</Badge>
              </div>
              <Button 
                onClick={() => handleUpgrade(plan.id)}
                disabled={upgradeMutation.isPending}
                className="btn-gradient h-11 text-[10px] font-black uppercase tracking-widest mt-4 shadow-glow"
              >
                {upgradeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowUpCircle className="w-4 h-4 mr-2" />}
                Upgrade Authority
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
function AddOnItem({ icon, title, price }: { icon: React.ReactNode, title: string, price: string }) {
  return (
    <div className="flex items-center justify-between group py-1">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded bg-muted/50 group-hover:bg-primary/10 transition-colors">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-tight">{title}</span>
      </div>
      <Button variant="ghost" className="h-8 text-[9px] font-black uppercase text-primary hover:bg-primary/5 px-2">Add {price}</Button>
    </div>
  );
}