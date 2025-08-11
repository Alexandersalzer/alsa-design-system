// ===============================================
// STEP 2: Update your existing useTheme.ts
// Just ADD these properties to your existing return object
// ===============================================

import { useState, useEffect, useCallback } from 'react';
import { ThemeManager, type ThemeConfig, type ColorScale, type RadiusScale, type ThemeMode } from '../utils/themeManager';

export function useTheme() {
  const [themeManager] = useState(() => ThemeManager.getInstance());
  const [config, setConfig] = useState<ThemeConfig>(() => themeManager.getCurrentConfig());
  const [isHydrated, setIsHydrated] = useState(false); // ✅ ADD for SSR safety

  useEffect(() => {
    themeManager.initialize();
    setConfig(themeManager.getCurrentConfig());
    setIsHydrated(true); // ✅ ADD this line
  }, [themeManager]);

  const setAccentColor = useCallback((color: ColorScale) => {
    themeManager.setAccentColor(color);
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  const setRadiusScale = useCallback((scale: RadiusScale) => {
    themeManager.setRadiusScale(scale);
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  // ✅ ADD these new methods:
  const setTheme = useCallback((mode: ThemeMode) => {
    if (!isHydrated) return;
    themeManager.setThemeMode(mode);
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager, isHydrated]);

  const toggleDarkMode = useCallback(() => {
    if (!isHydrated) return;
    themeManager.toggleThemeMode();
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager, isHydrated]);

  const applyTheme = useCallback((newConfig: Partial<ThemeConfig>) => {
    themeManager.applyTheme(newConfig);
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  const reset = useCallback(() => {
    themeManager.resetToDefaults();
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  return {
    // ✅ ADD these dark mode properties (compatible with DashboardLayout):
    isDark: config.themeMode === 'dark',
    toggleDarkMode,
    setTheme,
    currentTheme: config.themeMode,
    isHydrated,
    
    // Keep all your existing properties:
    config,
    setAccentColor,
    setRadiusScale,
    applyTheme,
    reset,
    accentColor: config.accentColor,
    radiusScale: config.radiusScale,
    fontFamily: config.fontFamily
  };
}

// Export types (ADD ThemeMode)
export type { ColorScale, RadiusScale, ThemeConfig, ThemeMode };