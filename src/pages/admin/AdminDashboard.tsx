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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Global Overview</h1>
        <p className="text-muted-foreground">Monitor platform growth and system health across all users.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.userCount?.toString() || "..."}
          icon={<Users className="w-4 h-4" />}
          description="Registered platform accounts"
        />
        <StatCard
          title="Active Tenants"
          value={stats?.tenantCount?.toString() || "..."}
          icon={<Server className="w-4 h-4" />}
          description="Global GSM installations"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats?.revenue || "0"}`}
          icon={<DollarSign className="w-4 h-4" />}
          description="Projected recurring revenue"
        />
        <StatCard
          title="Validation Health"
          value="99.8%"
          icon={<Activity className="w-4 h-4" />}
          description="Average uptime last 30d"
        />
      </div>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Global License Traffic
          </CardTitle>
          <CardDescription>Validation attempts across the entire network (Last 30 days)</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_TRAFFIC_DATA}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="validations" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Global Activity
          </CardTitle>
          <CardDescription>The latest tenants created on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tenant Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Domain</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Owner ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {recentTenants?.items?.slice(0, 5).map((tenant: any) => (
                  <tr key={tenant.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{tenant.name}</td>
                    <td className="p-4 align-middle font-mono text-xs">{tenant.domain}</td>
                    <td className="p-4 align-middle text-muted-foreground">{tenant.ownerId}</td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 capitalize">
                        {tenant.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
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