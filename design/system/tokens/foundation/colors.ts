// ===============================================
// @blimpify-im/ui/src/tokens/foundation/colors.ts
// Foundation color palette with all available color scales
// ===============================================

export const FOUNDATION_COLORS = {
  purple: {
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87',
    950: '#4C1D95',
    1000: '#3B0764',
    1100: '#2E1065',
    1200: '#1E1B4B',
  },
  azure: {
    100: '#EFF6FF',
    200: '#DBEAFE',
    300: '#BFDBFE',
    400: '#93C5FD',
    500: '#60A5FA',
    600: '#3B82F6',
    700: '#2563EB',
    800: '#1D4ED8',
    900: '#1E40AF',
    950: '#1E3A8A',
    1000: '#172554',
    1100: '#0F1629',
    1200: '#0A0E1A',
  },
  ruby: {
    100: '#FEF2F2',
    200: '#FEE2E2',
    300: '#FECACA',
    400: '#FCA5A5',
    500: '#F87171',
    600: '#EF4444',
    700: '#DC2626',
    800: '#B91C1C',
    900: '#991B1B',
    950: '#7F1D1D',
    1000: '#450A0A',
    1100: '#3C0E0E',
    1200: '#1A0606',
  },
  emerald: {
    100: '#ECFDF5',
    200: '#D1FAE5',
    300: '#A7F3D0',
    400: '#6EE7B7',
    500: '#34D399',
    600: '#10B981',
    700: '#059669',
    800: '#047857',
    900: '#065F46',
    950: '#064E3B',
    1000: '#022C22',
    1100: '#021E18',
    1200: '#0A120F',
  },
  honey: {
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
    1000: '#3A1507',
    1100: '#2A1005',
    1200: '#1A0A03',
  },
  gray: {
    50: '#F5F5F5',
    100: '#F1F1F1',
    200: '#E3E3E3',
    300: '#D5D5D5',
    400: '#C7C7C7',
    500: '#8B8B8B',
    600: '#7D7D7D',
    700: '#6F6F6F',
    800: '#616161',
    900: '#3D3D3D',
    1000: '#252525',
    1100: '#212121',
    1200: '#171717',
  }
} as const;

export type ColorScale = keyof typeof FOUNDATION_COLORS;
export type ColorLevel = keyof typeof FOUNDATION_COLORS.purple;

// ===============================================
// @blimpify-im/ui/src/utils/themeManager.ts
// Theme management utilities
// ===============================================

interface ThemeConfig {
  accentColor: ColorScale;
  radiusScale: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  fontFamily?: string;
}

export class ThemeManager {
  private static instance: ThemeManager;
  private currentConfig: ThemeConfig;

  private constructor() {
    this.currentConfig = {
      accentColor: 'purple',
      radiusScale: 'md'
    };
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  /**
   * Update accent color and apply to CSS custom properties
   */
  setAccentColor(color: ColorScale): void {
    this.currentConfig.accentColor = color;
    this.applyAccentColor(color);
  }

  /**
   * Update radius scale and apply to CSS custom properties
   */
  setRadiusScale(scale: ThemeConfig['radiusScale']): void {
    this.currentConfig.radiusScale = scale;
    this.applyRadiusScale(scale);
  }

  /**
   * Apply accent color to CSS custom properties
   */
  private applyAccentColor(color: ColorScale): void {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const colorScale = FOUNDATION_COLORS[color];

    // Update all accent token levels
    Object.entries(colorScale).forEach(([level, value]) => {
      root.style.setProperty(`--accent-${level}`, value);
    });

  }

  /**
   * Apply radius scale to CSS custom properties
   */
  private applyRadiusScale(scale: ThemeConfig['radiusScale']): void {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const tokens = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'];

    tokens.forEach(token => {
      root.style.setProperty(
        `--selected-radius-scale-${token}`, 
        `var(--foundation-radius-${scale}-${token})`
      );
    });
  }

  /**
   * Get current theme configuration
   */
  getCurrentConfig(): ThemeConfig {
    return { ...this.currentConfig };
  }

  /**
   * Initialize theme with stored preferences or defaults
   */
  initialize(config?: Partial<ThemeConfig>): void {
    if (typeof window === 'undefined') return;

    // Try to load from localStorage
    const stored = localStorage.getItem('blimpify-theme-config');
    if (stored) {
      try {
        const parsedConfig = JSON.parse(stored);
        this.currentConfig = { ...this.currentConfig, ...parsedConfig };
      } catch (e) {
        console.warn('Failed to parse stored theme config');
      }
    }

    // Apply any provided config
    if (config) {
      this.currentConfig = { ...this.currentConfig, ...config };
    }

    // Apply current configuration
    this.applyAccentColor(this.currentConfig.accentColor);
    this.applyRadiusScale(this.currentConfig.radiusScale);

    // Save to localStorage
    this.saveToStorage();
  }

  /**
   * Save current configuration to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('blimpify-theme-config', JSON.stringify(this.currentConfig));
  }

  /**
   * Apply complete theme configuration
   */
  applyTheme(config: Partial<ThemeConfig>): void {
    if (config.accentColor) {
      this.setAccentColor(config.accentColor);
    }
    if (config.radiusScale) {
      this.setRadiusScale(config.radiusScale);
    }
    this.saveToStorage();
  }
}

// ===============================================
// @blimpify-im/ui/src/hooks/useTheme.ts
// React hook for theme management
// ===============================================

import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [themeManager] = useState(() => ThemeManager.getInstance());
  const [config, setConfig] = useState<ThemeConfig>(() => themeManager.getCurrentConfig());

  useEffect(() => {
    // Initialize theme on mount
    themeManager.initialize();
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  const setAccentColor = useCallback((color: ColorScale) => {
    themeManager.setAccentColor(color);
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  const setRadiusScale = useCallback((scale: ThemeConfig['radiusScale']) => {
    themeManager.setRadiusScale(scale);
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  const applyTheme = useCallback((newConfig: Partial<ThemeConfig>) => {
    themeManager.applyTheme(newConfig);
    setConfig(themeManager.getCurrentConfig());
  }, [themeManager]);

  return {
    config,
    setAccentColor,
    setRadiusScale,
    applyTheme,
    // Convenience getters
    accentColor: config.accentColor,
    radiusScale: config.radiusScale,
    fontFamily: config.fontFamily
  };
}
