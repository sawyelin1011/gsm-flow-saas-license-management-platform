import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Server,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  ArrowRight
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
  { name: '00:00', validations: 120 },
  { name: '04:00', validations: 300 },
  { name: '08:00', validations: 450 },
  { name: '12:00', validations: 800 },
  { name: '16:00', validations: 600 },
  { name: '20:00', validations: 950 },
  { name: '23:59', validations: 1100 },
];
export function DashboardHome() {
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Tenants" value={profile?.tenantCount?.toString() || "0"} icon={<Server className="w-4 h-4" />} trend="Active" />
        <StatCard title="Validations (24h)" value="14.2k" icon={<Zap className="w-4 h-4" />} trend="+12%" />
        <StatCard title="Latency" value="22ms" icon={<Activity className="w-4 h-4" />} trend="Edge" />
        <StatCard title="API Uptime" value="99.99%" icon={<TrendingUp className="w-4 h-4" />} trend="Nominal" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-border/50">
          <CardHeader className="border-b bg-muted/5 py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              Validation Telemetry
            </CardTitle>
            <Badge variant="outline" className="text-[8px] uppercase tracking-widest text-primary border-primary/20">Live Stream</Badge>
          </CardHeader>
          <CardContent className="pt-6 px-4">
            <div className="h-[240px] w-full">
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
                  <Area type="monotone" dataKey="validations" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 flex flex-col h-full bg-card shadow-sm">
          <CardHeader className="border-b bg-muted/5 py-3 px-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest">Operator Quota</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Tenant Registry</p>
                  <p className="text-3xl font-black tracking-tighter">
                    {isLoading ? "..." : profile?.tenantCount} <span className="text-muted-foreground text-sm font-medium">/ {profile?.plan.tenantLimit}</span>
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary text-[9px] uppercase font-black mb-1">
                  {profile?.plan.name}
                </Badge>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${((profile?.tenantCount || 0) / (profile?.plan.tenantLimit || 1)) * 100}%` }} 
                />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase text-muted-foreground">Recent Node Authorizations</h4>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="flex-1 truncate">Node-0{i}.gsm-flow.cluster</span>
                    <span className="text-muted-foreground text-[10px]">Active</span>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full btn-gradient h-11 font-black text-[10px] uppercase tracking-widest mt-4" asChild>
              <Link to="/dashboard/data">Manage Registry <ArrowRight className="ml-2 w-3.5 h-3.5" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  return (
    <Card className="border-border/50 p-4 group hover:border-primary/50 transition-all hover:bg-primary/[0.01]">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-muted text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{trend}</span>
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{title}</p>
        <p className="text-2xl font-black tracking-tighter">{value}</p>
      </div>
    </Card>
  );
}