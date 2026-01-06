import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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
    <div className="space-y-6 md:space-y-8 max-w-full overflow-hidden">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Node Status</h1>
        <p className="text-sm md:text-base text-muted-foreground font-medium">Monitoring active installations for {profile?.name}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
          value={`${profile?.plan?.price ?? 0}`}
          icon={<CreditCard className="w-4 h-4" />}
          description="Standard recurring"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <Card className="border-border/50 shadow-sm overflow-hidden flex flex-col min-h-[350px] sm:min-h-[400px]">
          <CardHeader className="bg-muted/5 border-b border-border/50 p-4 sm:p-6">
            <CardTitle className="text-lg">License Traffic</CardTitle>
            <CardDescription>Network validation activity across all nodes</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-2 sm:p-6">
            <div className="w-full aspect-[2.75]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
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
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm flex flex-col justify-between">
          <CardHeader className="bg-muted/5 border-b border-border/50 p-4 sm:p-6">
            <CardTitle className="text-lg">Node Capacity</CardTitle>
            <CardDescription>Subscription usage tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6 flex-grow">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Nodes Allocated</span>
                <span className="font-mono font-bold text-primary">{currentTenants} / {tenantLimit}</span>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden group cursor-help">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-primary transition-all duration-1000 group-hover:brightness-110"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm tracking-tight">Growth Insight</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You've utilized {usagePercentage.toFixed(0)}% of your capacity. Scale to maintain high availability and seamless node authorization.
              </p>
              <Button asChild variant="link" className="p-0 h-auto text-xs text-primary font-bold underline-offset-4">
                <Link to="/dashboard/billing">Upgrade Path Analysis</Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="p-4 sm:p-6 border-t border-border/50 bg-muted/5">
            <Button asChild className="w-full btn-gradient shadow-glow font-bold h-11">
              <Link to="/dashboard/tenants">
                Provision New Node <ArrowUpRight className="ml-2 w-4 h-4" />
              </Link>
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
        <div className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className="text-[10px] font-medium text-muted-foreground mt-1 truncate">{description}</p>
      </CardContent>
    </Card>
  );
}