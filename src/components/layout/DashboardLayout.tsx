import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  List,
  Play,
  HelpCircle,
  BarChart3,
  Users
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
  const menuItems = [
    { title: 'Console', icon: LayoutDashboard, href: '/dashboard' },
    { title: 'Registry', icon: List, href: '/dashboard/data' },
    { title: 'Test Bench', icon: Play, href: '/dashboard/test' },
    { title: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
    { title: 'Support', icon: HelpCircle, href: '/dashboard/support' },
    { title: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];
  const adminItems = [
    { title: 'System Overview', icon: BarChart3, href: '/dashboard/admin' },
    { title: 'Operator Mgmt', icon: Users, href: '/dashboard/admin/users' },
  ];
  const getCurrentTitle = () => {
    const item = [...menuItems, ...adminItems].find(i => i.href === pathname);
    return item?.title || 'System Core';
  };
  const handleLogout = () => window.location.replace('/');
  const MobileSidebar = () => (
    <div className="fixed left-0 top-0 z-20 w-16 h-screen bg-card/95 backdrop-blur border-r border-border/50 shadow-lg flex flex-col py-2 px-1 gap-1 overflow-hidden">
      <div className="p-3 border-b border-border/30 flex items-center justify-center">
        <Zap className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 flex flex-col gap-1 p-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            title={item.title}
            className={cn(
              "h-12 w-full flex items-center justify-center rounded",
              pathname === item.href ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-primary",
              "active:bg-primary/20"
            )}
          >
            <item.icon className="w-3.5 h-3.5 mx-auto" />
          </Link>
        ))}
        {isAdmin && (
          <>
            <div className="my-3 mx-2 h-px bg-border/50" />
            {adminItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                title={item.title}
                className={cn(
                  "h-12 w-full flex items-center justify-center rounded",
                  pathname === item.href ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-primary",
                  "active:bg-primary/20"
                )}
              >
                <item.icon className="w-3.5 h-3.5 mx-auto" />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
  const Header = () => (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
          <ChevronRight className="w-3 h-3 text-primary" />
          {getCurrentTitle()}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-muted to-accent/30 flex items-center justify-center font-black text-sm shrink-0 cursor-default"
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
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
  const Main = ({ children }: { children: React.ReactNode }) => (
    <main className="flex-1 w-full dashboard-content p-4 md:p-8 animate-fade-in">
      {children}
    </main>
  );
  return (
    <>
      {isMobile ? (
        <>
          <MobileSidebar />
          <div className="ml-16 bg-muted/5 min-h-screen flex flex-col flex-1">
            <Header />
            <Main>{children}</Main>
          </div>
        </>
      ) : (
        <SidebarProvider defaultOpen={true}>
          <Sidebar collapsible="icon" className="border-r border-border/50">
            <SidebarHeader className="p-4 border-b border-border/30 flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary shrink-0" />
              <span className="font-black text-xs uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">
                GSM Flow
              </span>
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
            <Header />
            <Main>{children}</Main>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}