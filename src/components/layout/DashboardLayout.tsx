import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  HelpCircle,
  BarChart3,
  Users,
  BookOpen,
  Key,
  Play
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
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
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { api } from '@/lib/api-client';
import type { UserProfile } from '@shared/types';
interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}
const MENU_ITEMS: NavItem[] = [
  { title: 'Tenant Registry', icon: LayoutDashboard, href: '/dashboard' },
  { title: 'License Management', icon: Key, href: '/dashboard/data' },
  { title: 'Test Bench', icon: Play, href: '/dashboard/test' },
  { title: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
  { title: 'Support', icon: HelpCircle, href: '/dashboard/support' },
  { title: 'Settings', icon: Settings, href: '/dashboard/settings' },
];
const ADMIN_ITEMS: NavItem[] = [
  { title: 'Admin Dashboard', icon: BarChart3, href: '/dashboard/admin' },
  { title: 'Operator Mgmt', icon: Users, href: '/dashboard/admin/users' },
  { title: 'Technical Docs', icon: BookOpen, href: '/docs' },
];
function Header({ profile, title, onLogout }: { profile?: UserProfile, title: string, onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
          <ChevronRight className="w-3 h-3 text-primary" />
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-muted to-accent/30 flex items-center justify-center font-black text-sm shrink-0 cursor-default border border-border/50"
          title={profile?.name || profile?.email || ''}
        >
          {!profile ? (
            <Skeleton className="w-4 h-4 rounded-full" />
          ) : (
            <span>{(profile.name?.[0] || profile.email?.[0] || '?').toUpperCase()}</span>
          )}
        </div>
        <ThemeToggle className="static" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
          onClick={onLogout}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
function MobileSidebar({ pathname, isAdmin }: { pathname: string, isAdmin: boolean }) {
  return (
    <div className="fixed left-0 top-0 z-20 w-16 h-screen bg-card/95 backdrop-blur border-r border-border/50 shadow-lg flex flex-col py-2 px-1 gap-1 overflow-hidden">
      <div className="p-3 border-b border-border/30 flex items-center justify-center">
        <Zap className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 flex flex-col gap-1 p-1">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            title={item.title}
            className={cn(
              "h-12 w-full flex items-center justify-center rounded transition-colors",
              pathname === item.href ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-primary",
              "active:bg-primary/20"
            )}
          >
            <item.icon className="w-4 h-4 mx-auto" />
          </Link>
        ))}
        {isAdmin && (
          <>
            <div className="my-3 mx-2 h-px bg-border/50" />
            {ADMIN_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                title={item.title}
                className={cn(
                  "h-12 w-full flex items-center justify-center rounded transition-colors",
                  pathname === item.href ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-primary",
                  "active:bg-primary/20"
                )}
              >
                <item.icon className="w-4 h-4 mx-auto" />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => api<UserProfile>('/api/me'),
  });
  const isAdmin = React.useMemo(() =>
    profile?.id === 'admin-demo' || profile?.email?.toLowerCase().includes('admin'),
    [profile]
  );
  const currentTitle = React.useMemo(() => {
    const allItems = [...MENU_ITEMS, ...ADMIN_ITEMS];
    const item = allItems.find(i => i.href === pathname);
    if (item) return item.title;
    if (pathname.startsWith('/dashboard/admin')) return 'Admin Dashboard';
    return 'Authority Console';
  }, [pathname]);
  const handleLogout = React.useCallback(() => {
    window.location.replace('/');
  }, []);
  return (
    <>
      {isMobile ? (
        <div className="flex min-h-screen">
          <MobileSidebar pathname={pathname} isAdmin={isAdmin} />
          <div className="ml-16 bg-muted/5 min-h-screen flex flex-col flex-1 overflow-hidden">
            <Header profile={profile} title={currentTitle} onLogout={handleLogout} />
            <main className="flex-1 w-full dashboard-content p-4 md:p-8 animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <SidebarProvider defaultOpen={true}>
          <Sidebar collapsible="icon" className="border-r border-border/50">
            <SidebarHeader className="p-4 border-b border-border/30 flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary shrink-0" />
              <span className="font-black text-xs uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">
                GSM Authority
              </span>
            </SidebarHeader>
            <SidebarContent className="p-2">
              <SidebarMenu>
                {MENU_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                      className={cn(
                        "h-11 w-full px-3 flex items-center gap-3 rounded-lg transition-all",
                        pathname === item.href
                          ? "text-primary bg-primary/10 font-bold"
                          : "text-muted-foreground hover:text-primary hover:bg-accent"
                      )}
                    >
                      <Link to={item.href}>
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs truncate group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              {isAdmin && (
                <>
                  <SidebarSeparator className="my-4 mx-2" />
                  <div className="px-4 mb-2 group-data-[collapsible=icon]:hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Control Center</p>
                  </div>
                  <SidebarMenu>
                    {ADMIN_ITEMS.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          tooltip={item.title}
                          className={cn(
                            "h-11 w-full px-3 flex items-center gap-3 rounded-lg transition-all",
                            pathname === item.href
                              ? "text-primary bg-primary/10 font-bold"
                              : "text-muted-foreground hover:text-primary hover:bg-accent"
                          )}
                        >
                          <Link to={item.href}>
                            <item.icon className="w-4 h-4 shrink-0" />
                            <span className="text-xs truncate group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </>
              )}
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
          <SidebarInset className="bg-muted/5 min-h-screen flex flex-col">
            <Header profile={profile} title={currentTitle} onLogout={handleLogout} />
            <main className="flex-1 w-full dashboard-content p-4 md:p-8 animate-fade-in">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}