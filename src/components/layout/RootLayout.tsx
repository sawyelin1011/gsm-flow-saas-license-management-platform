import React from 'react';
import { Outlet } from "react-router-dom";
import { Toaster } from '@/components/ui/sonner';
/**
 * Root Layout to provide global UI elements within the Router context.
 * This ensures hooks like useNavigate (used by Toaster or other components) work correctly.
 */
export default function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}