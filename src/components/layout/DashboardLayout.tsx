import React from 'react';
import { 
  LayoutDashboard, 
  Server, 
  CreditCard, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Menu,
  ShieldAlert,
  BookOpen
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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = [
    { title: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { title: 'Tenants', icon: Server, href: '/dashboard/tenants' },
    { title: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
    { title: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  const adminItems = [
    { title: 'Global Overview', icon: ShieldAlert, href: '/dashboard/admin' },
    { title: 'User Management', icon: ShieldCheck, href: '/dashboard/admin/users' },
  ];

  const isAdmin = true; // Prototype logic: current user is admin

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border/50">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">GSM Flow</span>
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
                    "h-10 px-4",
                    location.pathname === item.href ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"
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
              <div className="px-4 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">System Admin</p>
              </div>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                      className={cn(
                        "h-10 px-4",
                        location.pathname === item.href ? "bg-amber-500 text-white hover:bg-amber-600" : "hover:bg-accent"
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

          <div className="mt-auto pt-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-10 px-4">
                  <Link to="/docs"><BookOpen className="w-5 h-5" /> <span>API Documentation</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-2 mb-4">
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
            className="w-full justify-start text-muted-foreground hover:text-destructive h-9"
            onClick={() => navigate('/')}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/10">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border hidden sm:block" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider hidden sm:block">
              {menuItems.find(i => i.href === location.pathname)?.title || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle className="static" />
          </div>
        </header>
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}