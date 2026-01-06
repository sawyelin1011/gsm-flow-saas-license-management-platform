import React from 'react';
import {
  LayoutDashboard,
  Server,
  CreditCard,
  Settings,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
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

} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const menuItems = [
    { title: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { title: 'Tenants', icon: Server, href: '/dashboard/tenants' },
    { title: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
    { title: 'Support', icon: LifeBuoy, href: '/dashboard/support' },
    { title: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];
  const adminItems = [
    { title: 'Global Overview', icon: ShieldAlert, href: '/dashboard/admin' },
    { title: 'User Management', icon: ShieldCheck, href: '/dashboard/admin/users' },
  ];
  const isAdmin = true;
  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={() => {}}
    >
      <Sidebar
        data-sidebar="sidebar"
        collapsible="icon"
        className="border-r border-border/50 bg-sidebar transition-all duration-300"
      >
        <SidebarHeader className="p-4 flex items-center justify-center md:justify-start">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-8 w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-glow shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden md:inline whitespace-nowrap">
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
                    "h-12 sm:h-10 px-0 md:px-4 transition-all flex justify-center md:justify-start",
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary md:border-r-2 border-primary"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Link to={item.href}>
                    <item.icon className="w-6 h-6 sm:w-5 sm:h-5" />
                    <span className="hidden md:inline">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {isAdmin && (
            <div className="mt-8">
              <div className="px-4 mb-2 hidden md:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap">System Admin</p>
              </div>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                      tooltip={item.title}
                      className={cn(
                        "h-12 sm:h-10 px-0 md:px-4 transition-all flex justify-center md:justify-start",
                        location.pathname === item.href
                          ? "bg-primary/10 text-primary md:border-r-2 border-primary"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Link to={item.href}>
                        <item.icon className="w-6 h-6 sm:w-5 sm:h-5" />
                        <span className="hidden md:inline">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          )}
          <div className="mt-auto pt-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 sm:h-10 px-0 md:px-4 flex justify-center md:justify-start" tooltip="API Documentation">
                  <Link to="/docs">
                    <BookOpen className="w-6 h-6 sm:w-5 sm:h-5" />
                    <span className="hidden md:inline">API Docs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-4 overflow-hidden hidden md:flex">
            <Avatar className="w-8 h-8 border border-border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">John Doe</span>
              <span className="text-xs text-muted-foreground truncate">john@gsmflow.com</span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-center md:justify-start text-muted-foreground hover:text-destructive h-10 sm:h-9 px-2"
            onClick={() => navigate('/')}
          >
            <LogOut className="w-5 h-5 sm:w-4 sm:h-4 md:mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/5 min-h-screen relative flex flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider hidden sm:block truncate">
              {menuItems.find(i => i.href === location.pathname)?.title || adminItems.find(i => i.href === location.pathname)?.title || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle className="static" />
          </div>
        </header>
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}