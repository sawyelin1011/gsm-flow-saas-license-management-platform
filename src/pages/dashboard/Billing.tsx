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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
      toast.success('Subscription updated');
    },
    onError: (err: any) => toast.error(err?.message || 'Update failed'),
  });
  return (
    <div className="space-y-8 md:space-y-12 max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">License Billing</h1>
        <p className="text-sm text-muted-foreground font-medium">Manage enterprise subscriptions and records.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={cn(
          "lg:col-span-2 border-2 transition-all relative overflow-hidden",
          profile?.planId !== 'starter' ? 'border-primary shadow-glow bg-primary/[0.02]' : 'border-border'
        )}>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="text-lg sm:text-xl">Active Entitlement</CardTitle>
              <Badge className="bg-primary text-primary-foreground text-[9px] uppercase font-black px-2.5">{profile?.plan?.name}</Badge>
            </div>
            <CardDescription className="text-xs sm:text-sm font-medium">Cycle Rate: Monthly renewal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-card/50">
                <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Monthly Cost</p>
                <p className="text-2xl font-bold text-primary">${profile?.plan?.price}<span className="text-xs font-medium text-muted-foreground ml-1">/mo</span></p>
              </div>
              <div className="p-4 rounded-xl border bg-card/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Status</p>
                  <p className="text-xl font-bold">Authorized</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-cyan-glow" />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Included Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                {profile?.plan?.features.map((f) => (
                  <div key={f} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> {f}</div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/5 p-4 sm:p-6">
            <Button variant="outline" className="w-full sm:w-auto font-bold h-10 border-primary/20">Adjust Payment Method</Button>
          </CardFooter>
        </Card>
        <Card className="border-border/50 shadow-sm h-fit">
          <CardHeader className="p-4 border-b bg-muted/5">
            <CardTitle className="text-xs font-bold uppercase tracking-widest">Next Settlement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Dec 1, 2025</span>
              </div>
              <span className="font-bold text-lg">${profile?.plan?.price}.00</span>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-primary text-[10px] font-bold leading-relaxed flex gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Auto-settlement active via primary instrument.</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <ReceiptText className="w-5 h-5 text-primary" /> Financial Records
        </h2>
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <Table>
              <TableHeader className="bg-muted/50 border-b">
                <TableRow>
                  <TableHead className="w-[120px] text-[10px] uppercase font-bold">Date</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold">Plan</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold">Volume</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold">Status</TableHead>
                  <TableHead className="text-right text-[10px] uppercase font-bold">Records</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingInvoices ? (
                  <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : invoices?.map((invoice) => (
                  <TableRow key={invoice.id} className="text-xs sm:text-sm">
                    <TableCell className="font-bold">{format(invoice.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="text-[10px] font-black uppercase text-muted-foreground">{invoice.planName}</TableCell>
                    <TableCell className="font-black text-primary">${invoice.amount}.00</TableCell>
                    <TableCell><Badge className="bg-cyan-500/10 text-cyan-500 border-none text-[9px] uppercase px-1.5">{invoice.status}</Badge></TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-8 font-bold text-[10px]">PDF</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>
      </div>
      <div className="space-y-6 pt-8 border-t">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <ArrowUpCircle className="w-5 h-5 text-primary" /> Scale Capacity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PLANS.filter(p => p.id !== profile?.planId).map((plan) => (
            <Card key={plan.id} className="group hover:border-primary transition-all duration-300 flex flex-col bg-card/30">
              <CardHeader className="bg-muted/5 border-b p-4">
                <CardTitle className="text-base font-bold">{plan.name}</CardTitle>
                <p className="text-2xl font-black text-primary mt-1">${plan.price}<span className="text-xs text-muted-foreground">/mo</span></p>
              </CardHeader>
              <CardContent className="space-y-3 py-4 flex-grow text-xs">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" /> {f}</div>
                ))}
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full btn-gradient font-bold h-10" 
                  onClick={() => upgradeMutation.mutate(plan.id)}
                  disabled={upgradeMutation.isPending}
                >
                  {upgradeMutation.isPending ? "Switching..." : `Migrate to ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}