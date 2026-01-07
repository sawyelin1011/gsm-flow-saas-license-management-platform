import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
interface ThemeToggleProps {
  className?: string;
}
export function ThemeToggle({ className = "absolute top-4 right-4" }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Avoid hydration mismatch by only rendering icons after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <div className={`${className} h-10 w-10`} />;
  }
  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
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
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      )}
    </Button>
  );
}