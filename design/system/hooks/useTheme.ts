// ===============================================
// blimpify-ui/design/system/hooks/useTheme.ts
// UPDATED: Use the fixed reset method
// ===============================================

import { useState, useEffect, useCallback } from 'react';
import { ThemeManager, type ThemeConfig, type ColorScale, type RadiusScale } from '../utils/themeManager';

export function useTheme() {
  const [themeManager] = useState(() => ThemeManager.getInstance());
  const [config, setConfig] = useState<ThemeConfig>(() => themeManager.getCurrentConfig());

  useEffect(() => {
    // Initialize on mount - this will load saved settings if they exist
    themeManager.initialize();
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  const setAccentColor = useCallback((color: ColorScale) => {
    themeManager.setAccentColor(color);
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  const setRadiusScale = useCallback((scale: RadiusScale) => {
    themeManager.setRadiusScale(scale);
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  const applyTheme = useCallback((newConfig: Partial<ThemeConfig>) => {
    themeManager.applyTheme(newConfig);
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  // ✅ FIXED: Use the proper reset method
  const reset = useCallback(() => {
    themeManager.resetToDefaults();
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  return {
    config,
    setAccentColor,
    setRadiusScale,
    applyTheme,
    reset,
    // Convenience getters
    accentColor: config.accentColor,
    radiusScale: config.radiusScale,
    fontFamily: config.fontFamily
  };
}

// Export types
export type { ColorScale, RadiusScale, ThemeConfig };