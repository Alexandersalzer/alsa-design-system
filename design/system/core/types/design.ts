// Font weight tiers (legacy - kept for backwards compatibility)
export type BodyWeightTier = "regular" | "medium";
export type HeadingWeightTier = "semibold" | "bold" | "extrabold";
export type WeightTier = BodyWeightTier | HeadingWeightTier;

// 🎯 NEW: Numeric font weights (100-900 matching Google Fonts)
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export interface DesignTokens {
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  accentColor?: string;
  isDark?: boolean;
  themeTone?: "mono" | "linen" | "ink" | "clay" | "slate" | "sage" | "frost" | "pearl" | "aqua" | "neutral";
  accentIntensity?: "vibrant" | "normal" | "discrete" | "monochrome";
  fontPrimary?: string;
  fontSecondary?: string;

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
  typographyScale?: "sm" | "md" | "lg";
}

export interface DesignConfig {
  globalStyles?: DesignTokens;
}