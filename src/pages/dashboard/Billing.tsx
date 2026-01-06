import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, CheckCircle2, ReceiptText, ArrowUpCircle, Download } from 'lucide-react';
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
import type { UserProfile, Invoice } from '@shared/types';
import { MOCK_PLANS } from '@shared/mock-data';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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
    mutationFn: (planId: string) => api<UserProfile>('/api/billing/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planId })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Subscription scaled');
    }
  });
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 border-primary/20 bg-primary/[0.01]">
          <CardHeader className="py-4 border-b border-primary/10">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="w-3 h-3" /> Subscription Node
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {isLoadingProfile ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Current Plan</p>
                  <p className="text-2xl font-black tracking-tighter text-primary uppercase">{profile?.plan?.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px] font-bold text-muted-foreground">
                  {profile?.plan?.features.slice(0, 4).map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary/50" /> {f}
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black tracking-tighter">${profile?.plan?.price}<span className="text-[10px] text-muted-foreground ml-1">/MO</span></p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-muted/5 flex flex-col justify-center p-4">
          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Cycle Reset</p>
          <p className="text-xl font-black tracking-tighter mb-4">DEC 01, 2025</p>
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest border-border/50">Update Method</Button>
        </Card>
      </div>
      <div className="space-y-3">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <ReceiptText className="w-3 h-3" /> Audit History
        </h2>
        <Card className="border-border/50 overflow-hidden">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b h-10">
                  <TableHead className="text-[9px] uppercase font-black pl-6">Invoice ID</TableHead>
                  <TableHead className="text-[9px] uppercase font-black">Period</TableHead>
                  <TableHead className="text-[9px] uppercase font-black text-center">Amount</TableHead>
                  <TableHead className="text-[9px] uppercase font-black text-right pr-6">Export</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingInvoices ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                  ))
                ) : invoices?.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center h-20 text-[10px] text-muted-foreground uppercase font-bold">Registry empty</TableCell></TableRow>
                ) : (
                  invoices?.map((inv) => (
                    <TableRow key={inv.id} className="text-[10px] hover:bg-primary/[0.01]">
                      <TableCell className="font-mono pl-6 text-muted-foreground">{inv.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-bold">{format(inv.date, 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-center font-black">${inv.amount}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                          <Download className="w-3.5 h-3.5" />
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
        <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <ArrowUpCircle className="w-3 h-3" /> Capacity Scale
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MOCK_PLANS.filter(p => !isLoadingProfile && p.id !== profile?.planId).map((plan) => (
            <Card key={plan.id} className="p-4 border-border/50 hover:border-primary/50 transition-all flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest">{plan.name}</h3>
                  <p className="text-xl font-black tracking-tighter text-primary">${plan.price}<span className="text-[9px] text-muted-foreground ml-1 uppercase">/MO</span></p>
                </div>
                <Badge variant="outline" className="text-[8px] uppercase border-border/50">{plan.itemLimit} Limit</Badge>
              </div>
              <Button 
                size="sm" 
                className="btn-gradient h-8 text-[9px] font-black uppercase tracking-widest"
                onClick={() => upgradeMutation.mutate(plan.id)}
                disabled={upgradeMutation.isPending}
              >
                {upgradeMutation.isPending ? "..." : "Initiate Scale"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}