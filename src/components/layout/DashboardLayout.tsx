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
  Zap
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
    { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', colorClass: 'icon-gradient-cyan' },
    { title: 'Data Grid', icon: Table, href: '/dashboard/data', colorClass: 'icon-gradient-purple' },
    { title: 'API Tester', icon: Terminal, href: '/dashboard/api-test', colorClass: 'icon-gradient-amber' },
    { title: 'Billing', icon: CreditCard, href: '/dashboard/billing', colorClass: 'icon-gradient-indigo' },
    { title: 'Support', icon: LifeBuoy, href: '/dashboard/support', colorClass: 'icon-gradient-rose' },
    { title: 'Settings', icon: Settings, href: '/dashboard/settings', colorClass: 'icon-gradient-blue' },
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
  if (isMobile) {
    return (
      <div className="flex min-h-screen bg-muted/5">
        <aside className="fixed left-0 top-0 bottom-0 w-12 bg-sidebar border-r border-border/50 z-50 flex flex-col items-center py-4 gap-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-glow shrink-0">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <nav className="flex-1 flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all",
                  item.colorClass,
                  pathname === item.href ? "ring-2 ring-offset-2 ring-primary scale-110" : "opacity-70"
                )}
              >
                <item.icon className="w-4 h-4" />
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 ml-12 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
            <h2 className="text-xs font-black uppercase tracking-widest text-primary truncate">{getCurrentTitle()}</h2>
            <ThemeToggle className="static" />
          </header>
          <main className="flex-1 p-4 overflow-x-hidden">{children}</main>
        </div>
      </div>
    );
  }
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-8 w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-glow shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-tighter group-data-[collapsible=icon]:hidden">
              V2 CORE
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
                  className={cn(pathname === item.href && "bg-primary/10 text-primary")}
                >
                  <Link to={item.href}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-bold">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {isAdmin && (
            <div className="mt-8">
              <div className="px-4 mb-2 group-data-[collapsible=icon]:hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Admin Control</p>
              </div>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <Link to={item.href} className="font-bold">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          )}
        </SidebarContent>
        <SidebarRail />
        <SidebarFooter className="p-4 border-t border-border/50">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive group-data-[collapsible=icon]:justify-center" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2 group-data-[collapsible=icon]:mr-0" />
            <span className="group-data-[collapsible=icon]:hidden font-bold">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/5 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-8 backdrop-blur-md">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{getCurrentTitle()}</h2>
          <ThemeToggle className="static" />
        </header>
        <main className="flex-1 w-full p-4 md:p-8 animate-fade-in">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}