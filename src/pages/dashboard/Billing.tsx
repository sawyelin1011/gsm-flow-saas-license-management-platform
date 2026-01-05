import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, CheckCircle2, AlertCircle, Calendar, Loader2, ReceiptText } from 'lucide-react';
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
      toast.success('Subscription upgraded successfully!');
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Upgrade failed'),
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
          <p className="text-muted-foreground">Manage your subscription, view usage limits, and download invoices.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className={`md:col-span-2 border-2 transition-all ${profile?.planId !== 'starter' ? 'border-primary/20 bg-primary/[0.02]' : 'border-border'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Plan</CardTitle>
                <Badge className="bg-primary text-primary-foreground text-xs uppercase font-bold tracking-widest">{profile?.plan?.name}</Badge>
              </div>
              <CardDescription>Active since November 2024 · Renews monthly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-card/50">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Price</p>
                  <p className="text-2xl font-bold">${profile?.plan?.price}<span className="text-sm font-normal text-muted-foreground">/{profile?.plan?.interval}</span></p>
                </div>
                <div className="p-4 rounded-xl border bg-card/50">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-lg font-bold">Active</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Included Features
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {profile?.plan?.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 gap-4">
              <Button variant="outline" size="sm">Manage Payment Method</Button>
            </CardFooter>
          </Card>
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Next Invoice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Dec 1, 2025</span>
                  </div>
                  <span className="font-bold">${profile?.plan?.price}.00</span>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Auto-renewal is enabled. Your card ending in 4242 will be charged.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Billing History</h2>
          </div>
          <Card className="border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingInvoices ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : invoices?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No billing history found.</TableCell>
                  </TableRow>
                ) : (
                  invoices?.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="text-sm font-medium">{format(invoice.date, 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-xs text-muted-foreground uppercase">{invoice.planName}</TableCell>
                      <TableCell className="text-sm font-semibold">${invoice.amount}.00</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] h-5">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-xs">Download</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div className="space-y-6 pt-8">
          <h2 className="text-2xl font-bold">Available Plan Upgrades</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {MOCK_PLANS.filter(p => p.id !== profile?.planId).map((plan) => (
              <Card key={plan.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground text-sm">/{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pb-6 flex-grow">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{f}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="bg-muted/20 group-hover:bg-muted/40 transition-colors pt-4">
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    onClick={() => upgradeMutation.mutate(plan.id)}
                    disabled={upgradeMutation.isPending}
                  >
                    {upgradeMutation.isPending ? "Upgrading..." : `Upgrade to ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}