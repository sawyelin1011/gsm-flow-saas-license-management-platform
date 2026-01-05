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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight uppercase">Global GSM Authority Control</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2 uppercase text-xs tracking-widest opacity-70">
            <Activity className="w-3.5 h-3.5 text-primary" />
            Platform-wide GSM cluster health and global licensing throughput oversight.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="GSM Operators" value={stats?.operatorCount?.toString() || "..."} icon={<Users className="w-5 h-5" />} description="Registered Entities" />
          <StatCard title="Cluster Tenants" value={stats?.tenantCount?.toString() || "..."} icon={<Server className="w-5 h-5" />} description="Active Node Installs" />
          <StatCard title="Validation Throughput" value="1.2M" icon={<Zap className="w-5 h-5" />} description="Monthly Cycles" />
          <Card className="border-border/50 p-5 hover:border-emerald-500/40 transition-colors shadow-sm bg-card overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Master System Health</p>
              <div className="relative">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="absolute inset-0 animate-ping h-full w-full rounded-full bg-emerald-500 opacity-20" />
              </div>
            </div>
            <div className="text-2xl font-black tracking-tighter text-emerald-500 group-hover:scale-105 transition-transform duration-300">NOMINAL</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tighter">Distributed Edge Stability</p>
          </Card>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2 border-border/50 overflow-hidden flex flex-col shadow-soft">
            <CardHeader className="p-5 border-b bg-muted/5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Traffic Analysis
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Global GSM license validation volume (Last 24h)</CardDescription>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] font-black uppercase tracking-widest px-3">Steady Signals</Badge>
            </CardHeader>
            <CardContent className="flex-1 pt-10 px-6">
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
                    <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} stroke="hsl(var(--muted-foreground))" tick={{ fontWeight: 800 }} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} stroke="hsl(var(--muted-foreground))" tick={{ fontWeight: 800 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '10px', fontWeight: 'bold' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Area type="monotone" dataKey="val" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#adminVal)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 flex flex-col overflow-hidden shadow-soft bg-card">
            <CardHeader className="p-5 border-b bg-muted/5">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Authority Audit
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Latest operator registry modifications</CardDescription>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border/30">
                {recentTenants?.items?.map((tenant: any) => (
                  <div key={tenant.id} className="p-5 flex flex-col gap-1.5 hover:bg-muted/10 transition-colors group cursor-default">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs uppercase tracking-tight group-hover:text-primary transition-colors">{tenant.name}</span>
                      <Badge variant="outline" className={cn(
                        "text-[8px] h-4 uppercase font-black px-1.5",
                        tenant.status === 'active' ? "text-emerald-500 border-emerald-500/20" : "text-rose-500 border-rose-500/20"
                      )}>{tenant.status.toUpperCase()}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono font-bold">
                      <span className="truncate max-w-[150px] opacity-70">{tenant.domain}</span>
                      <span className="font-black">{format(tenant.createdAt, 'HH:mm:ss')}</span>
                    </div>
                  </div>
                )) || <div className="p-16 text-center text-xs text-muted-foreground italic uppercase font-black tracking-widest opacity-20">NO RECENT PULSE.</div>}
              </div>
            </ScrollArea>
          </Card>
        </div>
        <Card className="border-border/50 shadow-soft overflow-hidden">
          <CardHeader className="p-5 border-b bg-muted/5 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest">Master GSM Cluster Registry</CardTitle>
            <Badge variant="secondary" className="text-[9px] uppercase font-black tracking-widest px-3 py-1 bg-primary/10 text-primary border-none">{recentTenants?.items?.length || 0} Clusters Online</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="h-12 px-8 text-left font-black text-[9px] uppercase tracking-widest text-muted-foreground">GSM Tenant / Installation</th>
                    <th className="h-12 px-8 text-left font-black text-[9px] uppercase tracking-widest text-muted-foreground">Bound Service Domain</th>
                    <th className="h-12 px-8 text-left font-black text-[9px] uppercase tracking-widest text-muted-foreground">Operator ID Reference</th>
                    <th className="h-12 px-8 text-left font-black text-[9px] uppercase tracking-widest text-muted-foreground">Provisioned Date</th>
                    <th className="h-12 px-8 text-right font-black text-[9px] uppercase tracking-widest text-muted-foreground pr-8">Authority State</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTenants?.items?.map((tenant: any) => (
                    <tr key={tenant.id} className="border-b hover:bg-primary/[0.02] transition-colors text-xs group">
                      <td className="px-8 py-5 font-black uppercase tracking-tighter group-hover:text-primary transition-colors">{tenant.name}</td>
                      <td className="px-8 py-5 text-muted-foreground font-mono font-bold opacity-80 uppercase">{tenant.domain}</td>
                      <td className="px-8 py-5 font-mono text-muted-foreground/60 font-bold">{tenant.ownerId.slice(0, 14).toUpperCase()}...</td>
                      <td className="px-8 py-5 font-black text-muted-foreground uppercase tracking-tight">{format(tenant.createdAt, 'MMM dd, yyyy')}</td>
                      <td className="px-8 py-5 text-right pr-8">
                        <Badge variant="outline" className={cn(
                          "text-[9px] uppercase font-black border-none px-2 py-0.5",
                          tenant.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                        )}>{tenant.status.toUpperCase()}</Badge>
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
    </div>
  );
}
function StatCard({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description: string }) {
  return (
    <Card className="border-border/50 p-5 hover:border-primary/40 transition-all shadow-sm bg-card group">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-muted-foreground/80">{title}</p>
        <div className="text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all duration-300">{icon}</div>
      </div>
      <div className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">{value}</div>
      <p className="text-[10px] text-muted-foreground mt-1.5 font-bold uppercase tracking-widest opacity-60 group-hover:opacity-80 transition-opacity">{description}</p>
    </Card>
  );
}