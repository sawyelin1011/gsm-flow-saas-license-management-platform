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
const MOCK_TRAFFIC_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'MMM dd'),
  validations: Math.floor(Math.random() * 5000) + 2000,
  failures: Math.floor(Math.random() * 200),
}));
export function AdminDashboard() {
  const { data: stats } = useQuery<any>({
    queryKey: ['admin-stats'],
    queryFn: () => api('/api/admin/stats'),
  });
  const { data: recentTenants } = useQuery<any>({
    queryKey: ['admin-tenants-recent'],
    queryFn: () => api('/api/admin/tenants'),
  });
  return (
    <div className="space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Global Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor platform growth and system health.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Users" value={stats?.userCount?.toString() || "..."} icon={<Users className="w-4 h-4" />} description="Registered accounts" />
        <StatCard title="Tenants" value={stats?.tenantCount?.toString() || "..."} icon={<Server className="w-4 h-4" />} description="Active nodes" />
        <StatCard title="Revenue" value={`$${stats?.revenue || "0"}`} icon={<DollarSign className="w-4 h-4" />} description="Recurring MRR" />
        <StatCard title="Health" value="99.8%" icon={<Activity className="w-4 h-4" />} description="System uptime" />
      </div>
      <Card className="border-border/50 shadow-sm overflow-hidden min-h-[400px]">
        <CardHeader className="p-4 sm:p-6 border-b bg-muted/5">
          <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Traffic Trends</CardTitle>
          <CardDescription>Network validation attempts (Last 30 days)</CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 h-[300px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_TRAFFIC_DATA}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} hide={window.innerWidth < 640} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="validations" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b bg-muted/5">
          <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Recent Global Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full whitespace-nowrap">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="h-10 px-4 text-left font-bold text-[10px] uppercase">Tenant</th>
                  <th className="h-10 px-4 text-left font-bold text-[10px] uppercase">Domain</th>
                  <th className="h-10 px-4 text-left font-bold text-[10px] uppercase">Owner</th>
                  <th className="h-10 px-4 text-left font-bold text-[10px] uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTenants?.items?.slice(0, 8).map((tenant: any) => (
                  <tr key={tenant.id} className="border-b hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-bold text-xs">{tenant.name}</td>
                    <td className="p-4 font-mono text-[10px] text-primary">{tenant.domain}</td>
                    <td className="p-4 text-xs text-muted-foreground">{tenant.ownerId}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] uppercase px-1.5">{tenant.status}</Badge>
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
    <Card className="border-border/50 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
        <div className="text-muted-foreground opacity-50">{icon}</div>
      </div>
      <div className="text-xl font-bold tracking-tight">{value}</div>
      <p className="text-[9px] text-muted-foreground mt-1 truncate">{description}</p>
    </Card>
  );
}