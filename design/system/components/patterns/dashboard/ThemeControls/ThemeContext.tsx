/* ==============================================
   src/context/ThemeContext.tsx
   ============================================== */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
  setTheme: (theme: string) => void;
  currentTheme: string;
  isHydrated: boolean; // Add this to track hydration state
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Start with light mode as default (matches server)
  const [isDark, setIsDark] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isHydrated, setIsHydrated] = useState(false); // Track if we've hydrated

  // Only run on client side after hydration
  useEffect(() => {
    // Get stored theme or default to light
    const storedTheme = localStorage.getItem('theme') || 'light';
    const isDarkTheme = storedTheme === 'dark' || storedTheme.startsWith('dark-');
    
    setCurrentTheme(storedTheme);
    setIsDark(isDarkTheme);
    setIsHydrated(true); // Mark as hydrated
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  const toggleDarkMode = () => {
    if (!isHydrated) return; // Don't toggle before hydration
    
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    setCurrentTheme(newTheme);
    
    // Update localStorage and DOM
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setTheme = (theme: string) => {
    if (!isHydrated) return; // Don't change theme before hydration
    
    const isDarkTheme = theme === 'dark' || theme.startsWith('dark-');
    setIsDark(isDarkTheme);
    setCurrentTheme(theme);
    
    // Update localStorage and DOM
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleDarkMode,
      setTheme,
      currentTheme,
      isHydrated
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}