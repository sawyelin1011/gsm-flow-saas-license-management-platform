import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Activity, 
  Layers, 
  Users, 
  Zap,
  ArrowUpRight,
  MousePointer2,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { api } from '@/lib/api-client';
import type { UserProfile } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
const CHART_DATA = [
  { name: 'Mon', usage: 4000 },
  { name: 'Tue', usage: 3000 },
  { name: 'Wed', usage: 2000 },
  { name: 'Thu', usage: 2780 },
  { name: 'Fri', usage: 1890 },
  { name: 'Sat', usage: 2390 },
  { name: 'Sun', usage: 3490 },
];
export function DashboardHome() {
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">System Console</h1>
        <p className="text-muted-foreground font-medium">Platform overview and resource telemetry.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Resources" value={profile?.itemCount?.toString() || "0"} icon={<Layers className="w-4 h-4 text-primary" />} trend="+12%" />
        <StatCard title="Active Users" value="1,248" icon={<Users className="w-4 h-4 text-primary" />} trend="+4.5%" />
        <StatCard title="API Requests" value="48.2k" icon={<Zap className="w-4 h-4 text-primary" />} trend="+24%" />
        <StatCard title="Avg Latency" value="22ms" icon={<Activity className="w-4 h-4 text-primary" />} trend="-3ms" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 glass overflow-hidden">
          <CardHeader className="border-b bg-muted/5">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Resource Utilization
            </CardTitle>
            <CardDescription className="text-xs">Cumulative system usage metrics over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                  <Area type="monotone" dataKey="usage" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="glass flex flex-col">
          <CardHeader className="border-b bg-muted/5">
            <CardTitle className="text-base flex items-center gap-2">
              <MousePointer2 className="w-4 h-4 text-primary" /> Active Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center gap-6 p-6">
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <>
                <div className="space-y-1">
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary">
                    {profile?.plan?.name}
                  </Badge>
                  <div className="text-4xl font-black tracking-tighter">${profile?.plan?.price}<span className="text-xs text-muted-foreground ml-1">/mo</span></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span>Quota Usage</span>
                    <span className="text-primary">{profile?.itemCount} / {profile?.plan?.itemLimit}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary shadow-glow transition-all duration-500" 
                      style={{ width: `${((profile?.itemCount || 0) / (profile?.plan?.itemLimit || 1)) * 100}%` }} 
                    />
                  </div>
                </div>
                <Button className="w-full btn-gradient font-bold h-11">
                  Upgrade Capacity <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  return (
    <Card className="glass p-4 group hover:border-primary/50 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:scale-110 transition-transform">{icon}</div>
        <span className={cn("text-[10px] font-black", trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500')}>{trend}</span>
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">{title}</p>
        <p className="text-2xl font-black tracking-tight">{value}</p>
      </div>
    </Card>
  );
}