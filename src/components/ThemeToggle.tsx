import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
interface ThemeToggleProps {
  className?: string;
}
export function ThemeToggle({ className = "absolute top-4 right-4" }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Sync theme on mount and listen for storage changes
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialDark = savedTheme === 'dark' || 
      (!savedTheme && systemPrefersDark) || 
      document.documentElement.classList.contains('dark');
    
    setIsDark(initialDark);
    setMounted(true);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        setIsDark(e.newValue === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  if (!mounted) {
    return (
      <div className={`${className} h-10 w-10`} />
    );
  }
  const toggleTheme = () => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    
    const newIsDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    setIsDark(newIsDark);
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className={`${className} hover:scale-110 hover:rotate-12 transition-all duration-200 active:scale-90 z-50`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </Button>
  );
}