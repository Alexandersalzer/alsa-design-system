// Font weight tiers (legacy - kept for backwards compatibility)
export type BodyWeightTier = "regular" | "medium";
export type HeadingWeightTier = "semibold" | "bold" | "extrabold";
export type WeightTier = BodyWeightTier | HeadingWeightTier;

// 🎯 NEW: Numeric font weights (100-900 matching Google Fonts)
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export interface ColorInput {
  hex: string;
}

export interface DesignTokens {
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Accent color. Preferred shape: { hex: '#RRGGBB' } (free user input).
   * Legacy strings (e.g. "orange-light", "purple", "inverse") are still accepted
   * and migrated automatically by colorEngine.resolveAccentInput.
   */
  accent?: ColorInput | string;
  /** @deprecated Use `accent` (ColorInput) instead. Kept for backward compatibility. */
  accentColor?: string;
  themeMode?: 'light' | 'dark' | 'system';
  /** @deprecated Use themeMode instead. Will be auto-migrated. */
  isDark?: boolean;
  /**
   * Base color (theme tone). Preferred shape: { hex: '#RRGGBB' } (free user input).
   * Legacy strings (e.g. "pure", "navy", "ink") are still accepted and migrated
   * automatically by colorEngine.resolveToneInput.
   */
  themeTone?: ColorInput | string;
  /** Controls how much chroma bleeds into the neutral/surface scale. 0 = pure gray, 1 = max tint. */
  baseColorIntensity?: number;
  accentIntensity?: "vibrant" | "normal" | "discrete" | "monochrome";
  fontPrimary?: string;
  fontSecondary?: string;
  extraFonts?: string[]; // Extra Google Fonts to load (e.g. ["Pacifico", "Dancing Script"])

  // 🎯 NEW: Direct numeric weight support (preferred)
  fontWeightHeadingNumeric?: FontWeight;
  fontWeightBodyNumeric?: FontWeight;
  fontWeightLabelNumeric?: FontWeight;

  // Legacy tier-based weights (deprecated, but kept for backwards compatibility)
  fontWeightHeading?: HeadingWeightTier;
  fontWeightBody?: BodyWeightTier;

  layoutContent?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layoutMedia?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  sectionSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  containerSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  navbarSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  formWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  typographyScale?: "sm" | "md" | "lg" | "xl";
  sectionBodyAnimation?: 'all' | 'hero' | 'none';
}

export interface DesignConfig {
  globalStyles?: DesignTokens;
}