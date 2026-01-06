import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Table,
  CreditCard,
  Settings,
  LogOut,
  ShieldCheck,
  Terminal,
  LifeBuoy,
  ShieldAlert,
  Zap,
  Activity,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { api } from '@/lib/api-client';
import type { UserProfile } from '@shared/types';
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(true);
  const { pathname } = useLocation();
  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  const isAdmin = React.useMemo(() => 
    profile?.id === 'admin-demo' || profile?.email?.toLowerCase().includes('admin'), 
    [profile]
  );
  React.useEffect(() => {
    if (isMobile) setOpen(false);
    else setOpen(true);
  }, [isMobile]);
  const menuItems = [
    { title: 'Console', icon: LayoutDashboard, href: '/dashboard' },
    { title: 'Registry', icon: Table, href: '/dashboard/data' },
    { title: 'Test Bench', icon: Terminal, href: '/dashboard/test' },
    { title: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
    { title: 'Support', icon: LifeBuoy, href: '/dashboard/support' },
    { title: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];
  const adminItems = [
    { title: 'System Overview', icon: ShieldAlert, href: '/dashboard/admin' },
    { title: 'Operator Mgmt', icon: ShieldCheck, href: '/dashboard/admin/users' },
  ];
  const getCurrentTitle = () => {
    const item = [...menuItems, ...adminItems].find(i => i.href === pathname);
    return item?.title || 'System Core';
  };
  const handleLogout = () => window.location.replace('/');
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar collapsible="icon" className="border-r border-border/50">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-8 w-8 h-8 rounded-lg bg-foreground flex items-center justify-center text-background shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tighter group-data-[collapsible=icon]:hidden uppercase">
              V2 Engine
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.title}
                  className={cn(
                    "transition-colors hover:text-primary",
                    pathname === item.href ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                  )}
                >
                  <Link to={item.href}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {isAdmin && (
            <>
              <SidebarSeparator className="my-4" />
              <div className="px-4 mb-2 group-data-[collapsible=icon]:hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Authority</p>
              </div>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href} 
                      tooltip={item.title}
                      className={cn(
                        "transition-colors hover:text-primary",
                        pathname === item.href ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                      )}
                    >
                      <Link to={item.href}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </>
          )}
        </SidebarContent>
        <SidebarRail />
        <SidebarFooter className="p-2 border-t border-border/50">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-bold">Exit Console</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/5 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 md:px-8 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-primary" />
              {getCurrentTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mr-4">
              <Activity className="w-3 h-3 text-emerald-500" />
              Node: Online
            </div>
            <ThemeToggle className="static" />
          </div>
        </header>
        <main className="flex-1 w-full dashboard-content p-4 md:p-8 animate-fade-in">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}