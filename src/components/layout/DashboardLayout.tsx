import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Server,
  CreditCard,
  Settings,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  LifeBuoy
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(true);
  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  const isAdmin = profile?.id === 'admin-demo' || profile?.email?.toLowerCase().includes('admin');
  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);
  const menuItems = [
    { title: 'Overview', icon: LayoutDashboard, href: '/dashboard', colorClass: 'icon-gradient-cyan', hoverClass: 'hover-glow-cyan' },
    { title: 'Tenants', icon: Server, href: '/dashboard/tenants', colorClass: 'icon-gradient-purple', hoverClass: 'hover-glow-purple' },
    { title: 'Billing', icon: CreditCard, href: '/dashboard/billing', colorClass: 'icon-gradient-amber', hoverClass: 'hover-glow-amber' },
    { title: 'Support', icon: LifeBuoy, href: '/dashboard/support', colorClass: 'icon-gradient-rose', hoverClass: 'hover-glow-rose' },
    { title: 'Settings', icon: Settings, href: '/dashboard/settings', colorClass: 'icon-gradient-indigo', hoverClass: 'hover-glow-indigo' },
  ];
  const adminItems = [
    { title: 'Admin', icon: ShieldAlert, href: '/dashboard/admin', colorClass: 'icon-gradient-blue', hoverClass: 'hover-glow-blue' },
    { title: 'User Mgmt', icon: ShieldAlert, href: '/dashboard/admin/users', colorClass: 'icon-gradient-blue', hoverClass: 'hover-glow-blue' },
  ];
  const getCurrentTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard/admin/users') return 'User Management';
    if (path === '/dashboard/admin') return 'Admin Dashboard';
    const item = [...menuItems, ...adminItems].find(i => i.href === path);
    return item?.title || 'Dashboard';
  };
  const handleLogout = () => {
    navigate('/', { replace: true });
  };
  if (isMobile) {
    return (
      <div className="flex min-h-screen bg-muted/5">
        <aside className="fixed left-0 top-0 bottom-0 w-12 bg-sidebar border-r border-border/50 z-50 flex flex-col items-center py-4 gap-6 mobile-sidebar-shadow">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-glow shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <nav className="flex-1 flex flex-col gap-4" aria-label="Mobile navigation">
            {[...menuItems, ...(isAdmin ? adminItems : [])].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                title={item.title}
                aria-label={item.title}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all duration-200",
                  item.colorClass,
                  item.hoverClass,
                  location.pathname === item.href ? "ring-2 ring-offset-2 ring-primary scale-110" : "opacity-80 scale-100"
                )}
              >
                <item.icon className="w-4 h-4" />
              </Link>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </aside>
        <div className="flex-1 ml-12 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
            <h2 className="text-sm font-bold truncate uppercase tracking-widest text-primary">
              {getCurrentTitle()}
            </h2>
            <div className="flex items-center gap-2">
              <ThemeToggle className="static" />
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden p-4 md:p-8">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
              GSM Flow
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.href}
                  tooltip={item.title}
                  className={cn(
                    "h-10 transition-all",
                    location.pathname === item.href && "bg-primary/10 text-primary"
                  )}
                >
                  <Link to={item.href}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {isAdmin && (
            <div className="mt-8">
              <div className="px-4 mb-2 group-data-[collapsible=icon]:hidden">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">System Admin</p>
              </div>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith(item.href)}
                      tooltip={item.title}
                      className={cn(
                        "h-10 transition-all",
                        location.pathname.startsWith(item.href) && "bg-primary/10 text-primary"
                      )}
                    >
                      <Link to={item.href}>
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
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive group-data-[collapsible=icon]:justify-center"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2 group-data-[collapsible=icon]:mr-0" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/5 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-8 backdrop-blur-md">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {getCurrentTitle()}
          </h2>
          <ThemeToggle className="static" />
        </header>
        <main className="flex-1 w-full p-4 md:p-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}