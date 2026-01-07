import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Server,
  Zap,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Link } from 'react-router-dom';
const CHART_DATA = [
  { name: '00:00', validations: 240 },
  { name: '04:00', validations: 580 },
  { name: '08:00', validations: 920 },
  { name: '12:00', validations: 1400 },
  { name: '16:00', validations: 1100 },
  { name: '20:00', validations: 1800 },
  { name: '23:59', validations: 2100 },
];
export function DashboardHome() {
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-black uppercase tracking-tight">Tenant Registry Overview</h1>
        <Button className="btn-gradient font-black h-10 text-[10px] uppercase tracking-widest px-6" asChild>
          <Link to="/dashboard/data"><Plus className="w-3.5 h-3.5 mr-2" /> New GSM Tenant</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Tenants" value={profile?.tenantCount?.toString() || "0"} icon={<Server className="w-4 h-4" />} trend="Operational" />
        <StatCard title="License Pings (24h)" value="24.8k" icon={<Zap className="w-4 h-4" />} trend="+18%" />
        <StatCard title="Edge Latency" value="19ms" icon={<Activity className="w-4 h-4" />} trend="Global" />
        <StatCard title="Auth Uptime" value="100%" icon={<TrendingUp className="w-4 h-4" />} trend="Stable" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-border/50 shadow-soft">
          <CardHeader className="border-b bg-muted/5 py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-primary" /> License Verification Traffic
            </CardTitle>
            <Badge variant="outline" className="text-[8px] uppercase tracking-widest text-primary border-primary/20 bg-primary/5">Live Stream</Badge>
          </CardHeader>
          <CardContent className="pt-6 px-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="validations" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 flex flex-col h-full bg-card shadow-soft overflow-hidden">
          <CardHeader className="border-b bg-muted/5 py-3 px-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em]">Tenant Capacity</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Authorized Tenants</p>
                  <p className="text-3xl font-black tracking-tighter">
                    {isLoading ? <Skeleton className="h-8 w-12 inline-block" /> : profile?.tenantCount}
                    <span className="text-muted-foreground text-sm font-medium ml-1">/ {profile?.plan.tenantLimit || 1}</span>
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary text-[9px] uppercase font-black mb-1 border-none">
                  {profile?.plan.name || "Launch"}
                </Badge>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, ((profile?.tenantCount || 0) / (profile?.plan.tenantLimit || 1)) * 100)}%` }}
                />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">Service License Pulse</h4>
              <div className="space-y-2">
                {profile?.tenantCount && profile.tenantCount > 0 ? (
                  Array.from({ length: Math.min(3, profile.tenantCount) }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-foreground/80">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="flex-1 truncate uppercase tracking-tight">Tenant-0{i + 1} Authorized</span>
                      <span className="text-[10px] font-black uppercase text-emerald-500/80">Active</span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-[10px] font-bold text-muted-foreground uppercase italic tracking-widest opacity-30">
                    No active tenants found
                  </div>
                )}
              </div>
            </div>
            <Button className="w-full btn-gradient h-11 font-black text-[10px] uppercase tracking-widest mt-4 shadow-glow" asChild>
              <Link to="/dashboard/data">View All Licenses <ArrowRight className="ml-2 w-3.5 h-3.5" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  return (
    <Card className="border-border/50 p-4 group hover:border-primary/40 transition-all hover:bg-primary/[0.01] cursor-default shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-muted text-muted-foreground group-hover:text-primary transition-colors duration-300">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">{trend}</span>
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">{title}</p>
        <p className="text-2xl font-black tracking-tighter text-foreground">{value}</p>
      </div>
    </Card>
  );
}