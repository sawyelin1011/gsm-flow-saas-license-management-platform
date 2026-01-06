import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Server,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@shared/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
const MOCK_CHART_DATA = [
  { name: 'Mon', validations: 400 },
  { name: 'Tue', validations: 300 },
  { name: 'Wed', validations: 600 },
  { name: 'Thu', validations: 800 },
  { name: 'Fri', validations: 500 },
  { name: 'Sat', validations: 900 },
  { name: 'Sun', validations: 1100 },
];
export function ClientHome() {
  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  const tenantLimit = profile?.plan?.tenantLimit ?? 1;
  const currentTenants = profile?.tenantCount ?? 0;
  const usagePercentage = (currentTenants / tenantLimit) * 100;
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Node Status</h1>
        <p className="text-muted-foreground font-medium">Monitoring active installations for {profile?.name}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Tenants"
          value={currentTenants.toString()}
          icon={<Server className="w-4 h-4" />}
          description={`Capacity: ${tenantLimit} nodes`}
        />
        <StatCard
          title="Validations"
          value="4,281"
          icon={<Activity className="w-4 h-4" />}
          description="+12.5% vs prev"
        />
        <StatCard
          title="Active Plan"
          value={profile?.plan?.name ?? '...'}
          icon={<ShieldCheck className="w-4 h-4" />}
          description="Next charge: Dec 01"
        />
        <StatCard
          title="Monthly Spend"
          value={`$${profile?.plan?.price ?? 0}`}
          icon={<CreditCard className="w-4 h-4" />}
          description="Standard recurring"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/5 border-b border-border/50">
            <CardTitle className="text-lg">License Traffic</CardTitle>
            <CardDescription>Network validation activity across all nodes</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="validations"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--card))' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="bg-muted/5 border-b border-border/50">
            <CardTitle className="text-lg">Node Capacity</CardTitle>
            <CardDescription>Subscription usage tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6 flex-grow">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Nodes Allocated</span>
                <span className="font-mono font-bold text-primary">{currentTenants} / {tenantLimit}</span>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-primary transition-all duration-1000"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm tracking-tight">Growth Insight</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You've utilized {usagePercentage.toFixed(0)}% of your node capacity. Scale to a larger plan to maintain high availability for new deployments.
              </p>
              <Button variant="link" className="p-0 h-auto text-xs text-primary font-bold underline-offset-4">Upgrade Path Analysis</Button>
            </div>
          </CardContent>
          <CardFooter className="p-6 border-t border-border/50 bg-muted/5">
            <Button className="w-full btn-gradient shadow-glow font-bold">
              Provision New Node <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
function StatCard({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description: string }) {
  return (
    <Card className="border-border/50 shadow-sm hover:border-primary/50 transition-colors group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
        <div className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className="text-[10px] font-medium text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}