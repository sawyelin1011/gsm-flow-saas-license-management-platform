import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Server,
  Activity,
  Zap,
  ShieldCheck,
  TrendingUp,
  Clock,
  Terminal,
  ChevronRight
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
export function AdminDashboard() {
  const { data: stats } = useQuery<any>({
    queryKey: ['admin-stats'],
    queryFn: () => api('/api/admin/stats'),
  });
  const { data: recentTenants } = useQuery<any>({
    queryKey: ['admin-tenants-all'],
    queryFn: () => api('/api/admin/tenants'),
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight uppercase">Global Authority Control</h1>
        <p className="text-muted-foreground font-medium flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-primary" />
          Platform-wide cluster health and licensing throughput oversight.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Operators" value={stats?.operatorCount?.toString() || "..."} icon={<Users className="w-4 h-4" />} description="Registered Entities" />
        <StatCard title="Cluster Nodes" value={stats?.tenantCount?.toString() || "..."} icon={<Server className="w-4 h-4" />} description="Active Installations" />
        <StatCard title="Throughput" value="1.2M" icon={<Zap className="w-4 h-4" />} description="Monthly Validations" />
        <Card className="border-border/50 p-4 hover:border-emerald-500/40 transition-colors shadow-sm bg-card overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">System Health</p>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="absolute inset-0 animate-ping h-full w-full rounded-full bg-emerald-500 opacity-20" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tighter text-emerald-500 group-hover:scale-105 transition-transform duration-300">NOMINAL</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tighter">Distributed Stability</p>
        </Card>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-border/50 overflow-hidden flex flex-col shadow-soft">
          <CardHeader className="p-4 border-b bg-muted/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Traffic Analysis
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Global license validation volume (Last 24h)</CardDescription>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] uppercase font-black">Stable Signals</Badge>
          </CardHeader>
          <CardContent className="flex-1 pt-8 px-4">
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, val: Math.floor(Math.random() * 500) + 200 }))}>
                  <defs>
                    <linearGradient id="adminVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.5} />
                  <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} stroke="hsl(var(--muted-foreground))" tick={{ fontWeight: 700 }} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} stroke="hsl(var(--muted-foreground))" tick={{ fontWeight: 700 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '10px', fontWeight: 'bold' }} 
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#adminVal)" strokeWidth={4} animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 flex flex-col overflow-hidden shadow-soft bg-card">
          <CardHeader className="p-4 border-b bg-muted/5">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Authority Audit
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Latest registry modifications</CardDescription>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border/30">
              {recentTenants?.items?.map((tenant: any) => (
                <div key={tenant.id} className="p-4 flex flex-col gap-1 hover:bg-muted/10 transition-colors group cursor-default">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-tight group-hover:text-primary transition-colors">{tenant.name}</span>
                    <Badge variant="outline" className={cn(
                      "text-[8px] h-4 uppercase font-black",
                      tenant.status === 'active' ? "text-emerald-500 border-emerald-500/20" : "text-rose-500 border-rose-500/20"
                    )}>{tenant.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                    <span className="truncate max-w-[150px] opacity-70">{tenant.domain}</span>
                    <span className="font-bold">{format(tenant.createdAt, 'HH:mm:ss')}</span>
                  </div>
                </div>
              )) || <div className="p-12 text-center text-xs text-muted-foreground italic uppercase font-black tracking-widest opacity-20">No activity logs.</div>}
            </div>
          </ScrollArea>
        </Card>
      </div>
      <Card className="border-border/50 shadow-soft overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/5 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-black uppercase tracking-widest">Master Node Registry</CardTitle>
          <Badge variant="secondary" className="text-[9px] uppercase font-black tracking-widest px-2">{recentTenants?.items?.length || 0} Clusters</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="h-10 px-6 text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground">Tenant / Installation</th>
                  <th className="h-10 px-6 text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground">Bound Domain</th>
                  <th className="h-10 px-6 text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground">Operator ID</th>
                  <th className="h-10 px-6 text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground">Provisioned</th>
                  <th className="h-10 px-6 text-right font-black text-[10px] uppercase tracking-widest text-muted-foreground pr-8">License State</th>
                </tr>
              </thead>
              <tbody>
                {recentTenants?.items?.map((tenant: any) => (
                  <tr key={tenant.id} className="border-b hover:bg-primary/[0.02] transition-colors text-xs group">
                    <td className="px-6 py-4 font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{tenant.name}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono opacity-80">{tenant.domain}</td>
                    <td className="px-6 py-4 font-mono text-muted-foreground/60">{tenant.ownerId.slice(0, 12)}...</td>
                    <td className="px-6 py-4 font-bold text-muted-foreground uppercase">{format(tenant.createdAt, 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 text-right pr-8">
                      <Badge variant="outline" className={cn(
                        "text-[9px] uppercase font-black border-none",
                        tenant.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                      )}>{tenant.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
function StatCard({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description: string }) {
  return (
    <Card className="border-border/50 p-4 hover:border-primary/40 transition-all shadow-sm bg-card group">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
        <div className="text-primary/60 group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <div className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">{value}</div>
      <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tighter opacity-60">{description}</p>
    </Card>
  );
}