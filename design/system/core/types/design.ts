export interface DesignTokens {
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  accentColor?: string;
  isDark?: boolean;
  themeTone?: "mono" | "linen" | "ink" | "clay" | "slate" | "sage" | "frost" | "pearl" | "aqua" | "neutral";
  accentIntensity?: "vibrant" | "normal" | "discrete" | "monochrome";
  fontPrimary?: string;
  fontSecondary?: string;
  fontWeightScale?: "light" | "regular" | "strong" | "extraStrong";
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