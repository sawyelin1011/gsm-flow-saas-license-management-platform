import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
// Pages
import { LandingPage } from '@/pages/LandingPage';
import { Auth } from '@/pages/Auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClientHome } from '@/pages/dashboard/ClientHome';
import { Tenants } from '@/pages/dashboard/Tenants';
import { Billing } from '@/pages/dashboard/Billing';
import { Toaster } from '@/components/ui/sonner';
const queryClient = new QueryClient();
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
        path: "settings",
        element: <div className="p-8 text-center text-muted-foreground">Settings are coming soon.</div>,
      },
    ],
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
        <Toaster richColors closeButton />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)