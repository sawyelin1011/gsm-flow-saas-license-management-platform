/**
 * Redirect to landing page for production-ready entry point.
 * This replaces the boilerplate wait screen with the actual application root.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);
  return null;
}