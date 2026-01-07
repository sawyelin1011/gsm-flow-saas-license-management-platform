import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, CheckCircle2, ReceiptText, ArrowUpCircle, Download, ShieldCheck } from 'lucide-react';
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
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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
  const plans = [
    { id: 'basic', name: 'Node Starter', price: 29, limit: 1 },
    { id: 'pro', name: 'Cluster Pro', price: 89, limit: 10 },
    { id: 'enterprise', name: 'Carrier Enterprise', price: 299, limit: 100 }
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-primary/20 bg-primary/[0.01]">
          <CardHeader className="py-4 border-b border-primary/10">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Authority Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            {isLoadingProfile ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60">Active Plan</p>
                  <p className="text-3xl font-black tracking-tighter text-primary uppercase">{profile?.plan?.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> {profile?.plan.tenantLimit} Node Registry</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Domain Binding</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Edge Validation</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> API Authority</div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black tracking-tighter">${profile?.plan?.price}<span className="text-xs text-muted-foreground ml-1 uppercase font-medium">/MO</span></p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-muted/5 flex flex-col justify-center p-6 space-y-4">
          <div>
            <p className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest mb-1">Cycle Renewal</p>
            <p className="text-2xl font-black tracking-tighter">DEC 01, 2025</p>
          </div>
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-border/50 w-full">Manage Billing Method</Button>
        </Card>
      </div>
      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <ReceiptText className="w-3.5 h-3.5" /> Billing Registry Audit
        </h2>
        <Card className="border-border/50 overflow-hidden shadow-sm">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b h-11">
                  <TableHead className="text-[10px] uppercase font-black pl-8 tracking-widest">Transaction ID</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest">Period</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-center">Settlement</TableHead>
                  <TableHead className="text-[10px] uppercase font-black tracking-widest text-right pr-8">Snapshot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingInvoices ? (
                  Array.from({ length: 3 }).map((_, i) => <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-11 w-full" /></TableCell></TableRow>)
                ) : invoices?.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center h-24 text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">Registry Empty</TableCell></TableRow>
                ) : (
                  invoices?.map((inv) => (
                    <TableRow key={inv.id} className="text-xs hover:bg-primary/[0.01]">
                      <TableCell className="font-mono pl-8 text-muted-foreground">{inv.id.slice(0, 12).toUpperCase()}</TableCell>
                      <TableCell className="font-bold">{format(inv.date, 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-center font-black">${inv.amount}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
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
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <ArrowUpCircle className="w-3.5 h-3.5" /> Registry Capacity Scaling
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.filter(p => p.id !== profile?.planId).map((plan) => (
            <Card key={plan.id} className="p-6 border-border/50 hover:border-primary/50 transition-all flex flex-col justify-between h-40 bg-card/50">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-widest">{plan.name}</h3>
                  <p className="text-2xl font-black tracking-tighter text-primary">${plan.price}<span className="text-[10px] text-muted-foreground ml-1 font-medium">/MO</span></p>
                </div>
                <Badge variant="outline" className="text-[9px] uppercase font-black border-border/50">{plan.limit} Node Limit</Badge>
              </div>
              <Button size="sm" className="btn-gradient h-10 text-[10px] font-black uppercase tracking-widest mt-4">Initiate Cluster Scaling</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}