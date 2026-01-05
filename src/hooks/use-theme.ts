import React, { useState, useEffect } from 'react';
/**
 * Custom hook to manage the application's color theme.
 * Environment-aware to prevent crashes in non-browser environments 
 * and during initial hydration.
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.warn('Failed to access theme preferences:', error);
      return false;
    }
  });
  useEffect(() => {
    try {
      if (typeof document === 'undefined') return;
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.error('Failed to update theme classes:', error);
    }
  }, [isDark]);
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };
  return { isDark, toggleTheme };
}