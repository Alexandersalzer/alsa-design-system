// ===============================================
// blimpify-ui/design/system/utils/themeManager.ts
// FIXED: Proper initialization that preserves saved settings
// ===============================================

export type ColorScale = 'purple' | 'azure' | 'ruby' | 'emerald' | 'honey' | 'gray' | 'custom-brand';
export type RadiusScale = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  accentColor: ColorScale;
  radiusScale: RadiusScale;
  themeMode: ThemeMode;
  fontFamily?: string;
}

export class ThemeManager {
  private static instance: ThemeManager;
  private currentConfig: ThemeConfig;
  private isInitialized = false;

  private constructor() {
    this.currentConfig = {
      accentColor: 'purple',
      radiusScale: 'md',
      themeMode: 'light'
    };
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

   /**
   * Set theme mode (light/dark)
   */
  setThemeMode(mode: ThemeMode): void {
    this.currentConfig.themeMode = mode;
    this.applyThemeMode(mode);
    this.saveToStorage();
  }

  /**
   * Toggle between light and dark mode
   */
  toggleThemeMode(): void {
    const newMode = this.currentConfig.themeMode === 'light' ? 'dark' : 'light';
    this.setThemeMode(newMode);
  }

  /**
   * Apply theme mode to document
   */
  private applyThemeMode(mode: ThemeMode): void {
    if (typeof window === 'undefined') return;
    
    // Set data-theme attribute (matches your existing DashboardLayout)
    document.documentElement.setAttribute('data-theme', mode);
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
   */
  private applyAccentColor(color: ColorScale): void {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    // Handle custom-brand differently - don't override if it's already set
    if (color === 'custom-brand') {
      // For custom-brand, we don't override the CSS variables
      // They should already be set by the color extraction process
      return;
    }
    
    // Update your existing accent tokens to point to the selected foundation color
    const levels = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000, 1100, 1200];
    
    levels.forEach(level => {
      root.style.setProperty(
        `--accent-${level}`, 
        `var(--foundation-${color}-${level})`
      );
    });

    // Also update semantic tokens that should follow accent

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
   * Updated initialize method - include theme mode
   */
  initialize(fallbackConfig?: Partial<ThemeConfig>): void {
    if (typeof window === 'undefined') return;

    if (this.isInitialized) {
      return;
    }

    // Try to load from localStorage first
    const stored = localStorage.getItem('blimpify-theme-config');
    if (stored) {
      try {
        const savedConfig = JSON.parse(stored);
        this.currentConfig = { 
          ...this.currentConfig, 
          ...savedConfig 
        };

      } catch (e) {
        console.warn('Failed to parse stored theme config, using defaults');
      }
    } else if (fallbackConfig) {
      this.currentConfig = { 
        ...this.currentConfig, 
        ...fallbackConfig 
      };

    }

    // Apply all configurations (ADD the theme mode line)
    this.applyThemeMode(this.currentConfig.themeMode); // ✅ ADD this line
    this.applyAccentColor(this.currentConfig.accentColor);
    this.applyRadiusScale(this.currentConfig.radiusScale);
    
    this.isInitialized = true;

  }

  /**
   * Save to localStorage and notify page
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('blimpify-theme-config', JSON.stringify(this.currentConfig));
    // Dispatch event to trigger instant updates without reload
    window.dispatchEvent(new CustomEvent('theme-changed'));
  }   


    // ✅ ADD these convenience getters:
  get isDark(): boolean {
    return this.currentConfig.themeMode === 'dark';
  }

  get isLight(): boolean {
    return this.currentConfig.themeMode === 'light';
  }

  get currentTheme(): string {
    return this.currentConfig.themeMode;
  }

}