import '@/lib/errorReporter';
import { enableMapSet } from "immer";
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
// Pages
import { LandingPage } from '@/pages/LandingPage';
import { Auth } from '@/pages/Auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClientHome } from '@/pages/dashboard/ClientHome';
import { Tenants } from '@/pages/dashboard/Tenants';
import { Billing } from '@/pages/dashboard/Billing';
import { Settings } from '@/pages/dashboard/Settings';
import { Support } from '@/pages/dashboard/Support';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { UserManagement } from '@/pages/admin/UserManagement';
import { ApiDocs } from '@/pages/docs/ApiDocs';
import { Toaster } from '@/components/ui/sonner';
// Initialize Immer Map/Set support
enableMapSet();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes default stale time
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <Auth />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/docs",
    element: <ApiDocs />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <ClientHome />,
      },
      {
        path: "tenants",
        element: <Tenants />,
      },
      {
        path: "billing",
        element: <Billing />,
      },
      {
        path: "support",
        element: <Support />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "admin/users",
        element: <UserManagement />,
      }
    ],
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
        <Toaster richColors closeButton position="top-right" />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
);