// ===============================================
// blimpify-ui/design/system/utils/themeManager.ts
// Core theme management utilities
// ===============================================

export type ColorScale = 'purple' | 'azure' | 'ruby' | 'emerald' | 'honey' | 'gray';
export type RadiusScale = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface ThemeConfig {
  accentColor: ColorScale;
  radiusScale: RadiusScale;
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
   * Update accent color and apply to existing semantic tokens
   */
  setAccentColor(color: ColorScale): void {
    this.currentConfig.accentColor = color;
    this.applyAccentColor(color);
    this.saveToStorage();
  }

  /**
   * Update radius scale
   */
  setRadiusScale(scale: RadiusScale): void {
    this.currentConfig.radiusScale = scale;
    this.applyRadiusScale(scale);
    this.saveToStorage();
  }

  /**
   * Apply accent color by updating existing semantic tokens
   * No duplication - just redirecting existing tokens to new foundation colors
   */
  private applyAccentColor(color: ColorScale): void {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    // Update your existing accent tokens to point to the selected foundation color
    const levels = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000, 1100, 1200];
    
    levels.forEach(level => {
      root.style.setProperty(
        `--accent-${level}`, 
        `var(--foundation-${color}-${level})`
      );
    });

    // Also update any direct semantic tokens that should follow accent
    root.style.setProperty('--border-focus', `var(--foundation-${color}-500)`);
    root.style.setProperty('--icon-brand', `var(--foundation-${color}-600)`);
    root.style.setProperty('--text-nav-item-selected', `var(--foundation-${color}-600)`);
    root.style.setProperty('--icon-nav-item-selected', `var(--foundation-${color}-600)`);
    root.style.setProperty('--interactive-accent', `var(--foundation-${color}-500)`);
    root.style.setProperty('--interactive-accent-hover', `var(--foundation-${color}-600)`);
    root.style.setProperty('--interactive-accent-active', `var(--foundation-${color}-700)`);
  }

  /**
   * Apply radius scale to your existing system
   */
  private applyRadiusScale(scale: RadiusScale): void {
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
   * Get current configuration
   */
  getCurrentConfig(): ThemeConfig {
    return { ...this.currentConfig };
  }

  /**
   * Initialize theme with stored preferences or defaults
   */
  initialize(config?: Partial<ThemeConfig>): void {
    if (typeof window === 'undefined') return;

    // Load from localStorage
    const stored = localStorage.getItem('blimpify-theme-config');
    if (stored) {
      try {
        const parsedConfig = JSON.parse(stored);
        this.currentConfig = { ...this.currentConfig, ...parsedConfig };
      } catch (e) {
        console.warn('Failed to parse stored theme config');
      }
    }

    // Apply provided config
    if (config) {
      this.currentConfig = { ...this.currentConfig, ...config };
    }

    // Apply current configuration
    this.applyAccentColor(this.currentConfig.accentColor);
    this.applyRadiusScale(this.currentConfig.radiusScale);
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('blimpify-theme-config', JSON.stringify(this.currentConfig));
  }

  /**
   * Apply complete theme
   */
  applyTheme(config: Partial<ThemeConfig>): void {
    if (config.accentColor) {
      this.setAccentColor(config.accentColor);
    }
    if (config.radiusScale) {
      this.setRadiusScale(config.radiusScale);
    }
  }
}
