import { useTheme as useNextTheme } from 'next-themes';
/**
 * Custom hook to manage the application's color theme.
 * Wrapper around next-themes to provide a stable interface.
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  return { 
    isDark, 
    toggleTheme, 
    theme, 
    setTheme, 
    resolvedTheme 
  };
}