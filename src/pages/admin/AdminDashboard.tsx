import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Server,
  DollarSign,
  Activity,
  TrendingUp,
  Clock
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
import { format } from 'date-fns';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
const MOCK_TRAFFIC_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'MMM dd'),
  validations: Math.floor(Math.random() * 5000) + 2000,
  failures: Math.floor(Math.random() * 200),
}));
export function AdminDashboard() {
  const isMobile = useIsMobile();
  const { data: stats } = useQuery<any>({
    queryKey: ['admin-stats'],
    queryFn: () => api('/api/admin/stats'),
  });
  const { data: recentTenants } = useQuery<any>({
    queryKey: ['admin-tenants-recent'],
    queryFn: () => api('/api/admin/tenants'),
  });
  return (
    <div className="space-y-6 md:space-y-8 max-w-full overflow-hidden">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Global Overview</h1>
        <p className="text-xs md:text-base text-muted-foreground font-medium">Platform growth and cluster health monitoring.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard title="Users" value={stats?.userCount?.toString() || "..."} icon={<Users className="w-4 h-4" />} description="Active" />
        <StatCard title="Tenants" value={stats?.itemCount?.toString() || "..."} icon={<Server className="w-4 h-4" />} description="Nodes" />
        <StatCard title="Revenue" value={`$${stats?.revenue || "0"}`} icon={<DollarSign className="w-4 h-4" />} description="MRR" />
        <StatCard title="Health" value="99.9%" icon={<Activity className="w-4 h-4" />} description="Uptime" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-border/50 shadow-sm overflow-hidden flex flex-col min-h-[350px]">
          <CardHeader className="p-4 border-b bg-muted/5">
            <CardTitle className="text-base flex items-center gap-2 text-foreground font-bold">
              <TrendingUp className="w-5 h-5 text-primary" /> Traffic Trends
            </CardTitle>
            <CardDescription className="text-xs">License validation attempts (Last 30 days)</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-2 pt-6">
            <div className="w-full aspect-[4/3] sm:aspect-video min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_TRAFFIC_DATA}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    hide={isMobile}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="validations" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="p-4 border-b bg-muted/5">
            <CardTitle className="text-base flex items-center gap-2 text-foreground font-bold">
              <Clock className="w-5 h-5 text-primary" /> Recent Nodes
            </CardTitle>
            <CardDescription className="text-xs">Latest cluster deployments</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[300px] w-full">
              <div className="divide-y divide-border/50">
                {recentTenants?.items?.length > 0 ? (
                  recentTenants.items.slice(0, 10).map((tenant: any) => (
                    <div key={tenant.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                      <div className="min-w-0">
                        <p className="font-bold text-xs truncate text-foreground">{tenant.name}</p>
                        <p className="text-[10px] font-mono text-muted-foreground truncate">{tenant.domain}</p>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] uppercase px-1.5 shrink-0 ml-2">
                        {tenant.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-muted-foreground italic">
                    No recent activity records.
                  </div>
                )}
              </div>
              <ScrollBar />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/5">
          <CardTitle className="text-base text-foreground font-bold">System Audit Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="h-10 px-4 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Tenant</th>
                  <th className="h-10 px-4 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Identity</th>
                  <th className="h-10 px-4 text-left font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Provisioned</th>
                  <th className="h-10 px-4 text-right font-bold text-[10px] uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTenants?.items?.map((tenant: any) => (
                  <tr key={tenant.id} className="border-b hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-bold text-xs text-foreground">{tenant.name}</td>
                    <td className="p-4 text-xs text-muted-foreground">{tenant.ownerId}</td>
                    <td className="p-4 font-mono text-[10px] text-muted-foreground">
                      {tenant.createdAt ? format(tenant.createdAt, 'MMM dd, HH:mm') : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <Badge variant="outline" className="text-[9px] uppercase text-foreground">{tenant.status}</Badge>
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
    <Card className="border-border/50 shadow-sm p-3 md:p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
        <div className="text-muted-foreground/60">{icon}</div>
      </div>
      <div className="text-lg md:text-2xl font-bold tracking-tight text-foreground truncate">{value}</div>
      <p className="text-[8px] md:text-[10px] text-muted-foreground mt-1 truncate font-medium">{description}</p>
    </Card>
  );
}