import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, CheckCircle2, ReceiptText, ArrowUpCircle, Loader2 } from 'lucide-react';
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
      toast.success('Migrated');
    }
  });
  return (
    <div className="space-y-8 max-w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-bold">Billing</h1>
        {isLoadingProfile ? (
          <Skeleton className="h-5 w-24" />
        ) : (
          <Badge variant="outline" className="w-fit text-[9px] uppercase tracking-tighter">{profile?.plan?.name} Active</Badge>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 border-primary shadow-glow bg-primary/[0.02]">
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Plan Details</CardTitle>
            <CardDescription className="text-[10px]">Monthly Subscription</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            {isLoadingProfile ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-16" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">${profile?.plan?.price}</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-muted-foreground">
                  {profile?.plan?.features.slice(0, 4).map((f) => (
                    <div key={f} className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> {f}</div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="p-4 flex flex-col justify-center gap-2 border-border/50">
          <p className="text-[10px] uppercase font-black text-muted-foreground">Renewal</p>
          <p className="text-lg font-bold">Dec 01</p>
          <Button size="sm" variant="outline" className="text-[10px] h-8">Update Card</Button>
        </Card>
      </div>
      <div className="space-y-3">
        <h2 className="text-sm font-bold flex items-center gap-2"><ReceiptText className="w-4 h-4 text-primary" /> History</h2>
        <Card className="border-border/50 overflow-hidden">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-[9px] uppercase font-black">Date</TableHead>
                  <TableHead className="text-[9px] uppercase font-black">Amount</TableHead>
                  <TableHead className="text-[9px] uppercase font-black text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingInvoices ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : invoices?.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center h-12 text-[10px] text-muted-foreground">No invoices found</TableCell></TableRow>
                ) : (
                  invoices?.map((inv) => (
                    <TableRow key={inv.id} className="text-[10px]">
                      <TableCell className="font-bold">{format(inv.date, 'MMM dd')}</TableCell>
                      <TableCell className="text-primary font-black">${inv.amount}</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" className="h-6 text-[9px] px-2">PDF</Button></TableCell>
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
        <h2 className="text-sm font-bold flex items-center gap-2"><ArrowUpCircle className="w-4 h-4 text-primary" /> Upgrade</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {MOCK_PLANS.filter(p => !isLoadingProfile && p.id !== profile?.planId).map((plan) => (
            <Card key={plan.id} className="p-3 flex flex-col justify-between border-border/50 hover:border-primary transition-all">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black uppercase">{plan.name}</h3>
                <p className="text-sm font-bold text-primary">${plan.price}<span className="text-[8px] text-muted-foreground">/mo</span></p>
              </div>
              <Button
                size="sm"
                className="mt-3 btn-gradient h-7 text-[9px] font-black"
                onClick={() => upgradeMutation.mutate(plan.id)}
                disabled={upgradeMutation.isPending}
              >
                {upgradeMutation.isPending ? "..." : "Scale"}
              </Button>
            </Card>
          ))}
          {isLoadingProfile && Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="p-3 border-border/50">
              <Skeleton className="h-12 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}