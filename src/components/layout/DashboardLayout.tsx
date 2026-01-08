import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, CreditCard, Settings, LogOut, Zap, ChevronRight, HelpCircle, BarChart3, Key, Play, Loader2, Menu
} from 'lucide-react';
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarRail, SidebarSeparator, SidebarTrigger,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api, clearAuthToken, getAuthToken } from '@/lib/api-client';
import type { UserProfile } from '@shared/types';
const MENU_ITEMS = [
  { title: 'Tenant Registry', icon: LayoutDashboard, href: '/dashboard' },
  { title: 'License Management', icon: Key, href: '/dashboard/data' },
  { title: 'GSM Service Test Bench', icon: Play, href: '/dashboard/test' },
  { title: 'Billing & Tiers', icon: CreditCard, href: '/dashboard/billing' },
  { title: 'GSM Support', icon: HelpCircle, href: '/dashboard/support' },
  { title: 'Operator Settings', icon: Settings, href: '/dashboard/settings' },
];
export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = getAuthToken();
  const { data: profile, isLoading, isError } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
    retry: false,
    enabled: !!token
  });
  React.useEffect(() => {
    if (!token || (isError && !isLoading)) {
      clearAuthToken();
      navigate('/login');
    }
  }, [token, isError, isLoading, navigate]);
  const handleLogout = () => {
    clearAuthToken();
    navigate('/');
  };
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Authenticating GSM Operator...</p>
      </div>
    );
  }
  const isAdmin = profile?.isAdmin;
  return (
    <SidebarProvider defaultOpen={true}>
      {/* 
          Custom Mobile Sidebar Behavior: 
          On mobile (<768px), we use a strictly docked 64px width (icon-only).
          On desktop, we use the standard shadcn collapsible behavior.
      */}
      <Sidebar 
        collapsible="icon" 
        className="border-r border-border/50 md:w-64"
      >
        <SidebarHeader className="p-4 border-b border-border/30 flex items-center justify-center md:justify-start gap-3">
          <Zap className="w-5 h-5 text-primary shrink-0" />
          <span className="font-black text-xs uppercase tracking-[0.25em] hidden md:inline text-nowrap">
            GSM AUTHORITY
          </span>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {MENU_ITEMS.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className={cn(
                    "flex items-center justify-center md:justify-start gap-3",
                    pathname === item.href && "text-primary bg-primary/10 font-bold"
                  )}
                  tooltip={item.title}
                >
                  <Link to={item.href}>
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="hidden md:inline">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {isAdmin && (
            <>
              <SidebarSeparator className="my-4 mx-2" />
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === '/dashboard/admin'}
                    className="flex items-center justify-center md:justify-start gap-3"
                    tooltip="Authority Console"
                  >
                    <Link to="/dashboard/admin">
                      <BarChart3 className="w-4 h-4 shrink-0" /> 
                      <span className="hidden md:inline">Authority Console</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === '/dashboard/admin/users'}
                    className="flex items-center justify-center md:justify-start gap-3"
                    tooltip="Operator Registry"
                  >
                    <Link to="/dashboard/admin/users">
                      <BarChart3 className="w-4 h-4 shrink-0" /> 
                      <span className="hidden md:inline">Operator Registry</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </>
          )}
        </SidebarContent>
        <SidebarRail className="hidden md:block" />
      </Sidebar>
      <SidebarInset className="bg-muted/5 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 md:px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-primary transition-colors" />
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 truncate max-w-[180px] sm:max-w-none">
              <ChevronRight className="w-3 h-3 text-primary hidden sm:block" />
              GSM Console
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-tighter leading-none">{profile?.name}</p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase">{profile?.plan.name}</p>
            </div>
            <ThemeToggle className="static" />
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}