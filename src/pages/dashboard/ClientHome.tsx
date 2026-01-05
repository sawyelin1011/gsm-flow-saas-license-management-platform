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
  CardDescription 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.name}</h1>
        <p className="text-muted-foreground">Manage your installations and monitor validation traffic.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Tenants" 
          value={currentTenants.toString()} 
          icon={<Server className="w-4 h-4" />}
          description={`Plan limit: ${tenantLimit}`}
        />
        <StatCard 
          title="Total Validations" 
          value="4,281" 
          icon={<Activity className="w-4 h-4" />}
          description="+12.5% from last week"
        />
        <StatCard 
          title="Plan" 
          value={profile?.plan?.name ?? 'Loading...'} 
          icon={<ShieldCheck className="w-4 h-4" />}
          description={`Next renewal: Dec 1, 2025`}
        />
        <StatCard 
          title="Monthly Spend" 
          value={`$${profile?.plan?.price ?? 0}`} 
          icon={<CreditCard className="w-4 h-4" />}
          description="Standard monthly billing"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 border-border/50">
          <CardHeader>
            <CardTitle>License Traffic</CardTitle>
            <CardDescription>Daily license validation attempts across all tenants.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="validations" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 border-border/50">
          <CardHeader>
            <CardTitle>Usage Summary</CardTitle>
            <CardDescription>Installation capacity tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tenants Used</span>
                <span className="font-medium">{currentTenants} / {tenantLimit}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Scaling Tip</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    You've reached {usagePercentage.toFixed(0)}% of your capacity. Upgrade to Professional for 8 more slots.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-xs mt-2">Compare Plans</Button>
                </div>
              </div>
            </div>
            <Button className="w-full btn-gradient">
              Create New Tenant <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function StatCard({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description: string }) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}