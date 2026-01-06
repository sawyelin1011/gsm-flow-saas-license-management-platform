import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Layers,
  Users,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ArrowRight
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
const CHART_DATA = [
  { name: '01', usage: 400 },
  { name: '02', usage: 300 },
  { name: '03', usage: 600 },
  { name: '04', usage: 450 },
  { name: '05', usage: 700 },
  { name: '06', usage: 550 },
  { name: '07', usage: 800 },
];
export function DashboardHome() {
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Registry" value={profile?.itemCount?.toString() || "0"} icon={<Layers className="w-4 h-4" />} trend="+4" />
        <StatCard title="Clusters" value="12" icon={<Activity className="w-4 h-4" />} trend="Stable" />
        <StatCard title="Signals" value="48.2k" icon={<Zap className="w-4 h-4" />} trend="+24%" />
        <StatCard title="Uptime" value="99.9%" icon={<TrendingUp className="w-4 h-4" />} trend="Perfect" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-border/50">
          <CardHeader className="border-b bg-muted/5 py-3 px-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              Telemetry Flux
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 px-4">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="usage" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 flex flex-col h-full">
          <CardHeader className="border-b bg-muted/5 py-3 px-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              Signal Priority
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 flex-1">
            <div className="space-y-3">
              {[
                { label: 'Critical Path', val: 85, color: 'bg-primary' },
                { label: 'Node Sync', val: 42, color: 'bg-muted-foreground/30' },
                { label: 'Latency Burst', val: 12, color: 'bg-muted-foreground/20' }
              ].map(bar => (
                <div key={bar.label} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                    <span>{bar.label}</span>
                    <span>{bar.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all", bar.color)} style={{ width: `${bar.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-dashed">
               <Button className="w-full btn-gradient h-10 font-black text-[10px] uppercase tracking-widest" asChild>
                 <Link to="/dashboard/data">Manage Registry <ArrowRight className="ml-2 w-3 h-3" /></Link>
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="border-b bg-muted/5 py-3 px-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3 h-3" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {[
                { event: 'Node Auth', target: 'cluster-01.local', time: '2m ago' },
                { event: 'Registry Write', target: 'resource-delta', time: '14m ago' },
                { event: 'Security Audit', target: 'operator-02', time: '1h ago' },
              ].map((log, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between text-[11px] font-medium hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-bold">{log.event}</span>
                    <span className="text-muted-foreground font-mono">{log.target}</span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">{log.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-primary/[0.02]">
           <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest">Operator Stats</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-6 space-y-4">
             {isLoading ? <Skeleton className="h-12 w-full" /> : (
               <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Registry Usage</p>
                    <p className="text-2xl font-black tracking-tighter">{profile?.itemCount} / {profile?.plan?.itemLimit}</p>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary text-[9px] uppercase font-black px-2 mb-1">
                    {profile?.plan?.name}
                  </Badge>
               </div>
             )}
             <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${((profile?.itemCount || 0) / (profile?.plan?.itemLimit || 1)) * 100}%` }}
                />
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  return (
    <Card className="border-border/50 p-4 group hover:border-primary/50 transition-all hover:bg-primary/[0.01]">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-md bg-muted text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-primary">{trend}</span>
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{title}</p>
        <p className="text-xl font-black tracking-tighter">{value}</p>
      </div>
    </Card>
  );
}