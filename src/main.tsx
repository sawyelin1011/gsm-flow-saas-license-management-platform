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
import { ThemeProvider } from 'next-themes';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
// Pages
import { LandingPage } from '@/pages/LandingPage';
import { Auth } from '@/pages/Auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHome } from '@/pages/dashboard/DashboardHome';
import { DataGrid } from '@/pages/dashboard/DataGrid';
import { Billing } from '@/pages/dashboard/Billing';
import { Settings } from '@/pages/dashboard/Settings';
import { Support } from '@/pages/dashboard/Support';
import { TestBench } from '@/pages/dashboard/TestBench';
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
      staleTime: 5 * 60 * 1000,
    },
  },
});
/**
 * Root Layout to provide global UI elements within the Router context.
 * This ensures hooks like useNavigate (used by Toaster or other components) work correctly.
 */
function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <Auth />,
      },
      {
        path: "docs",
        element: <ApiDocs />,
      },
      {
        path: "dashboard",
        element: (
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        ),
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "data",
            element: <DataGrid />,
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
            path: "test",
            element: <TestBench />,
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
    ],
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);