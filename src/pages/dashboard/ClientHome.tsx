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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Status</h1>
        <p className="text-xs md:text-base text-muted-foreground">Monitoring node health for {profile?.name}</p>
      </div>
      {/* 2-Column Mobile Grid for Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Nodes"
          value={currentTenants.toString()}
          icon={<Server className="w-4 h-4" />}
          description={`${tenantLimit} Limit`}
        />
        <StatCard
          title="Calls"
          value="4.2k"
          icon={<Activity className="w-4 h-4" />}
          description="+12% up"
        />
        <StatCard
          title="Plan"
          value={profile?.plan?.name ?? '...'}
          icon={<ShieldCheck className="w-4 h-4" />}
          description="Active"
        />
        <StatCard
          title="MRR"
          value={`$${profile?.plan?.price ?? 0}`}
          icon={<CreditCard className="w-4 h-4" />}
          description="Standard"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/5 border-b border-border/50 p-4">
            <CardTitle className="text-base">Traffic Flow</CardTitle>
            <CardDescription className="text-xs">Validation activity</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-2 pt-6">
            {/* Fixed aspect ratio to solve Recharts warning */}
            <div className="w-full aspect-[4/3] sm:aspect-video min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
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
        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader className="bg-muted/5 border-b border-border/50 p-4">
            <CardTitle className="text-base">Capacity</CardTitle>
            <CardDescription className="text-xs">Subscription usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4 flex-grow">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Allocated</span>
                <span className="text-primary">{currentTenants} / {tenantLimit}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-xs">Insights</h4>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Capacity is at {usagePercentage.toFixed(0)}%. Consider scaling to prevent service bottlenecks.
              </p>
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t border-border/50 bg-muted/5">
            <Button asChild size="sm" className="w-full btn-gradient shadow-glow font-bold">
              <Link to="/dashboard/tenants">
                New Node <ArrowUpRight className="ml-1 w-3 h-3" />
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
    <Card className="border-border/50 shadow-sm hover:border-primary/50 transition-colors">
      <CardContent className="p-3 sm:p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-[9px] font-black uppercase tracking-widest">{title}</span>
          {icon}
        </div>
        <div className="text-lg sm:text-2xl font-bold tracking-tight">{value}</div>
        <p className="text-[8px] font-medium text-muted-foreground truncate">{description}</p>
      </CardContent>
    </Card>
  );
}