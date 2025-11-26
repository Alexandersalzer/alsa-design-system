export interface DesignConfig {
  globalStyles?: {
    radius?: string;
    accentColor?: string;
    isDark?: boolean;
    themeTone?: "mono" | "linen" | "ink" | "clay" | "slate" | "sage" | "frost" | "pearl" | "aqua";
    fontPrimary?: string;
    fontSecondary?: string;
    fontWeightScale?: "light" | "regular" | "strong" | "extraStrong";
    layoutContent?: string;
    layoutMedia?: string;
    sectionSpacing?: string;
    containerSpacing?: string;
    navbarSpacing?: string;
    formWidth?: string;         // ← NEW: xs | sm | md | lg | xl
    typographyScale?: "sm" | "md" | "lg";
  };
}