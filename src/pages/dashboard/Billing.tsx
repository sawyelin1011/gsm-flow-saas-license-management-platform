import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import type { UserProfile } from '@shared/types';
import { MOCK_PLANS } from '@shared/mock-data';
export function Billing() {
  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and view usage limits.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-primary/20 bg-primary/[0.02]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              <Badge className="bg-primary text-primary-foreground">{profile?.plan?.name}</Badge>
            </div>
            <CardDescription>Your plan renews on December 1st, 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-card">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Price</p>
                <p className="text-2xl font-bold">${profile?.plan?.price}<span className="text-sm font-normal text-muted-foreground">/{profile?.plan?.interval}</span></p>
              </div>
              <div className="p-4 rounded-xl border bg-card">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-lg font-bold">Active</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Plan Features</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {profile?.plan?.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 gap-4">
            <Button variant="outline">Manage Payment Method</Button>
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10">Cancel Subscription</Button>
          </CardFooter>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-muted rounded flex items-center justify-center border text-[10px] font-bold">VISA</div>
                <div>
                  <p className="text-sm font-medium">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 04/28</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Next Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Dec 1, 2025</span>
                </div>
                <span className="font-bold">${profile?.plan?.price}.00</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Auto-renewal is enabled. Your card will be charged automatically.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="space-y-6 pt-8">
        <h2 className="text-2xl font-bold">Available Upgrades</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {MOCK_PLANS.filter(p => p.id !== profile?.planId).map((plan) => (
            <Card key={plan.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                {plan.features.slice(0, 4).map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{f}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="bg-muted/30 pt-4">
                <Button className="w-full" variant="outline">Upgrade to {plan.name}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}