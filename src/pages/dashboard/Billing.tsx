import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, CheckCircle2, AlertCircle, Calendar, Loader2, ReceiptText, ArrowUpCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import type { UserProfile, Invoice } from '@shared/types';
import { MOCK_PLANS } from '@shared/mock-data';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
export function Billing() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  const { data: invoices, isLoading: isLoadingInvoices } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: () => api<Invoice[]>('/api/billing/invoices'),
  });
  const upgradeMutation = useMutation({
    mutationFn: (planId: string) => api<UserProfile>('/api/billing/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planId })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Subscription status updated');
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Upgrade rejected'),
  });
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">License Billing</h1>
        <p className="text-muted-foreground font-medium">Manage enterprise subscriptions and transaction history.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className={cn(
          "md:col-span-2 border-2 transition-all relative overflow-hidden",
          profile?.planId !== 'starter' ? 'border-primary shadow-glow bg-primary/[0.02]' : 'border-border'
        )}>
          {profile?.planId !== 'starter' && (
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <CreditCard className="w-24 h-24" />
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Active Entitlement</CardTitle>
              <Badge className="bg-primary text-primary-foreground text-[10px] uppercase font-black tracking-[0.2em] px-3">{profile?.plan?.name}</Badge>
            </div>
            <CardDescription className="font-medium">Account status: Operational · Renewal Cycle: Monthly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border bg-card/50 shadow-sm">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2">Cycle Rate</p>
                <p className="text-3xl font-bold text-primary">${profile?.plan?.price}<span className="text-sm font-medium text-muted-foreground ml-1">/mo</span></p>
              </div>
              <div className="p-5 rounded-2xl border bg-card/50 shadow-sm">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2">Verification Status</p>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-cyan-glow" />
                  <p className="text-xl font-bold">Authorized</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Core Entitlements
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {profile?.plan?.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm font-medium group">
                    <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 bg-muted/5 py-6">
            <Button variant="outline" className="font-bold border-primary/20 hover:bg-primary/5">Adjust Payment Infrastructure</Button>
          </CardFooter>
        </Card>
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Next Settlement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Dec 1, 2025</span>
                </div>
                <span className="font-black text-lg">${profile?.plan?.price}.00</span>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-primary text-[11px] font-bold leading-relaxed flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Automated settlement active. Primary instrument ending in 4242 will be debited.</span>
              </div>
              <Button variant="ghost" className="w-full text-xs font-bold hover:text-primary transition-colors">View Pre-Invoice Data</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ReceiptText className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Records</h2>
        </div>
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border/50">
              <TableRow>
                <TableHead className="font-bold text-xs uppercase tracking-widest">Settlement Date</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest">Allocation</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest">Volume</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-widest">Records</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingInvoices ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : invoices?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center font-medium text-muted-foreground italic">No historical transactions detected.</TableCell>
                </TableRow>
              ) : (
                invoices?.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-sm font-bold">{format(invoice.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="text-[10px] font-black uppercase text-muted-foreground">{invoice.planName}</TableCell>
                    <TableCell className="text-sm font-black text-primary">${invoice.amount}.00</TableCell>
                    <TableCell>
                      <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 text-[10px] font-black h-5 uppercase tracking-widest">
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-9 px-4 font-bold text-xs hover:text-primary transition-all">Download PDF</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
      <div className="space-y-8 pt-8 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ArrowUpCircle className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Scale Capacity</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {MOCK_PLANS.filter(p => p.id !== profile?.planId).map((plan) => (
            <Card key={plan.id} className="relative overflow-hidden group hover:border-primary transition-all duration-500 flex flex-col bg-card/30">
              <CardHeader className="border-b border-border/50 bg-muted/5">
                <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-primary">${plan.price}</span>
                  <span className="text-muted-foreground text-xs font-bold">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 py-6 flex-grow">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="bg-muted/10 p-6 pt-0">
                <Button
                  className="w-full btn-gradient shadow-glow font-bold h-11"
                  variant="default"
                  onClick={() => upgradeMutation.mutate(plan.id)}
                  disabled={upgradeMutation.isPending}
                >
                  {upgradeMutation.isPending ? "Updating Node..." : `Migrate to ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}