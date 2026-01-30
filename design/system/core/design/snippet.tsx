import type { DesignTokens } from "../types/design";
import { getDesignConfig } from "./loaders";
import { normalizeWeights, getWeightValue, normalizeNumericWeights } from "./weights";

/**
 * Generates CSS variables from design.json
 * Injects design tokens dynamically into <head>.
 */
export function buildCssVars(tokens: DesignTokens): string {
  const radius           = tokens?.radius           || "md";
  const accentColor      = tokens?.accentColor      || "purple";

  // Auto-migration: Support both old (isDark) and new (themeMode) formats
  let themeMode: 'light' | 'dark' | 'system' = 'light';
  if (tokens?.themeMode) {
    // New format - use directly
    themeMode = tokens.themeMode;
  } else if (tokens?.isDark !== undefined) {
    // Legacy format - auto-migrate
    themeMode = tokens.isDark ? 'dark' : 'light';
    console.warn('[Design] Deprecated: Using isDark (boolean). Please update design.json to use themeMode: "light" | "dark" | "system"');
  }

  const themeTone        = tokens?.themeTone        || "pure";
  const fontPrimary      = tokens?.fontPrimary      || "Outfit";
  const fontSecondary    = tokens?.fontSecondary    || fontPrimary;
  const layoutContent    = tokens?.layoutContent    || "md";
  const layoutMedia      = tokens?.layoutMedia      || "xl";
  const sectionSpacing   = tokens?.sectionSpacing   || "md";
  const containerSpacing = tokens?.containerSpacing || "md";
  const navbarSpacing    = tokens?.navbarSpacing    || "md";
  const formWidth        = tokens?.formWidth        || "sm";
  const typographyScale  = tokens?.typographyScale  || "md";
  const sectionBodyAnimation = tokens?.sectionBodyAnimation || "all";

  // 🎯 WEIGHT SYSTEM: Supports both numeric (preferred) and tier-based (legacy)
  let fontWeightHeading: number;
  let fontWeightBody: number;
  let fontWeightLabel: number;

  // Prefer numeric weights if provided
  if (tokens?.fontWeightHeadingNumeric || tokens?.fontWeightBodyNumeric) {
    const numericWeights = normalizeNumericWeights(
      tokens?.fontWeightHeadingNumeric,
      tokens?.fontWeightBodyNumeric,
      tokens?.fontWeightLabelNumeric
    );
    fontWeightHeading = numericWeights.heading;
    fontWeightBody = numericWeights.body;
    fontWeightLabel = numericWeights.label;
  } else {
    // Fall back to tier-based weights
    const weights = normalizeWeights(
      tokens?.fontWeightHeading,
      tokens?.fontWeightBody
    );
    fontWeightHeading = getWeightValue(weights.heading);
    fontWeightBody = getWeightValue(weights.body);
    fontWeightLabel = getWeightValue(weights.label);
  }

  const fontWeights = "300;400;500;600;700;800;900";
  const extraFonts = tokens?.extraFonts || [];
  const allFonts = [fontPrimary, fontSecondary, ...extraFonts].filter((f, i, arr) => arr.indexOf(f) === i);
  const fontsToImport = allFonts.map(f => `family=${f.replace(/\s/g, '+')}:wght@${fontWeights}`).join('&');
  const fontUrl = `https://fonts.googleapis.com/css2?${fontsToImport}&display=swap`;

  const isInverseAccent = accentColor === "inverse";

  return `
    @import url('${fontUrl}');
    :root {
      /* ===== FONTS ===== */
      --font-primary-name: '${fontPrimary}' !important;
      --font-secondary-name: '${fontSecondary}' !important;

      /* ===== Radius ===== */
      --selected-radius-scale-none: var(--foundation-radius-${radius}-none);
      --selected-radius-scale-xs:   var(--foundation-radius-${radius}-xs);
      --selected-radius-scale-sm:   var(--foundation-radius-${radius}-sm);
      --selected-radius-scale-md:   var(--foundation-radius-${radius}-md);
      --selected-radius-scale-lg:   var(--foundation-radius-${radius}-lg);
      --selected-radius-scale-xl:   var(--foundation-radius-${radius}-xl);
      --selected-radius-scale-2xl:  var(--foundation-radius-${radius}-2xl);
      --selected-radius-scale-full: var(--foundation-radius-${radius}-full);

      /* ===== Layout widths ===== */
      --selected-layout-scale-content: var(--foundation-layout-${layoutContent}-content);
      --selected-layout-scale-media:   var(--foundation-layout-${layoutMedia}-media);

      /* ===== Form width ===== */
      --selected-form-width: var(--foundation-form-${formWidth}-width);

      /* ===== Spacing ===== */
      --selected-section-spacing:   var(--foundation-section-spacing-${sectionSpacing});
      --selected-container-spacing: var(--foundation-container-spacing-${containerSpacing});
      --selected-navbar-spacing:    var(--foundation-navbar-spacing-${navbarSpacing});

      /* ===== Accent Color Selection ===== */
      /* Set foundation colors - these will be used by color-mix() in colors.css for auto-inversion */
      ${isInverseAccent ? `
        --foundation-accent-100: var(--foundation-gray-100);
        --foundation-accent-200: var(--foundation-gray-200);
        --foundation-accent-300: var(--foundation-gray-300);
        --foundation-accent-400: var(--foundation-gray-400);
        --foundation-accent-500: var(--foundation-gray-500);
        --foundation-accent-600: var(--foundation-gray-1200);
        --foundation-accent-700: var(--foundation-gray-1100);
        --foundation-accent-800: var(--foundation-gray-1000);
        --foundation-accent-900: var(--foundation-gray-900);
        --foundation-accent-1000: var(--foundation-gray-1000);
        --foundation-accent-1100: var(--foundation-gray-1100);
        --foundation-accent-1200: var(--foundation-gray-1200);
      ` : `
        --foundation-accent-100: var(--foundation-${accentColor}-100);
        --foundation-accent-200: var(--foundation-${accentColor}-200);
        --foundation-accent-300: var(--foundation-${accentColor}-300);
        --foundation-accent-400: var(--foundation-${accentColor}-400);
        --foundation-accent-500: var(--foundation-${accentColor}-500);
        --foundation-accent-600: var(--foundation-${accentColor}-600);
        --foundation-accent-700: var(--foundation-${accentColor}-700);
        --foundation-accent-800: var(--foundation-${accentColor}-800);
        --foundation-accent-900: var(--foundation-${accentColor}-900);
        --foundation-accent-1000: var(--foundation-${accentColor}-1000);
        --foundation-accent-1100: var(--foundation-${accentColor}-1100);
        --foundation-accent-1200: var(--foundation-${accentColor}-1200);
      `}

      /* ===== Typography scale ===== */
      --selected-font-size-xs:   var(--foundation-typography-${typographyScale}-xs);
      --selected-font-size-sm:   var(--foundation-typography-${typographyScale}-sm);
      --selected-font-size-base: var(--foundation-typography-${typographyScale}-base);
      --selected-font-size-lg:   var(--foundation-typography-${typographyScale}-lg);
      --selected-font-size-xl:   var(--foundation-typography-${typographyScale}-xl);
      --selected-font-size-2xl:  var(--foundation-typography-${typographyScale}-2xl);
      --selected-font-size-3xl:  var(--foundation-typography-${typographyScale}-3xl);
      --selected-font-size-4xl:  var(--foundation-typography-${typographyScale}-4xl);
      --selected-font-size-5xl:  var(--foundation-typography-${typographyScale}-5xl);
      --selected-font-size-6xl:  var(--foundation-typography-${typographyScale}-6xl);
      --selected-font-size-7xl:  var(--foundation-typography-${typographyScale}-7xl);

      /* ===== Line height scale ===== */
      --selected-leading-tight:   var(--foundation-typography-${typographyScale}-leading-tight);
      --selected-leading-snug:    var(--foundation-typography-${typographyScale}-leading-snug);
      --selected-leading-normal:  var(--foundation-typography-${typographyScale}-leading-normal);
      --selected-leading-relaxed: var(--foundation-typography-${typographyScale}-leading-relaxed);
      --selected-leading-loose:   var(--foundation-typography-${typographyScale}-leading-loose);

      /* ===== Font weights (DYNAMIC - numeric 100-900 range from design.json) ===== */
      --dynamic-font-weight-heading: ${fontWeightHeading};
      --dynamic-font-weight-body:    ${fontWeightBody};
      --dynamic-font-weight-label:   ${fontWeightLabel};

      /* ===== Theme Mode ===== */
      --theme-mode: '${themeMode}';  /* Can be 'light', 'dark', or 'system' */

      /* ===== SectionBody Animation ===== */
      --section-body-animation: '${sectionBodyAnimation}';  /* 'all', 'hero', or 'none' */

      /* ===== Generative Background Colors (based on accent color) ===== */
      /* Accent color scheme */
      --gen-bg-subtle-base: var(--foundation-accent-100);
      --gen-bg-subtle-accent: var(--foundation-accent-200);
      --gen-bg-subtle-highlight: var(--foundation-accent-50, #FFFFFF);

      --gen-bg-medium-base: var(--foundation-accent-200);
      --gen-bg-medium-accent: var(--foundation-accent-300);
      --gen-bg-medium-highlight: var(--foundation-accent-100);

      --gen-bg-vibrant-base: var(--foundation-accent-300);
      --gen-bg-vibrant-accent: var(--foundation-accent-400);
      --gen-bg-vibrant-highlight: var(--foundation-accent-200);

      /* Primary color scheme */
      --gen-bg-primary-subtle-base: var(--foundation-primary-100);
      --gen-bg-primary-subtle-accent: var(--foundation-primary-200);
      --gen-bg-primary-subtle-highlight: var(--foundation-primary-50, #FFFFFF);

      --gen-bg-primary-medium-base: var(--foundation-primary-200);
      --gen-bg-primary-medium-accent: var(--foundation-primary-300);
      --gen-bg-primary-medium-highlight: var(--foundation-primary-100);

      --gen-bg-primary-vibrant-base: var(--foundation-primary-300);
      --gen-bg-primary-vibrant-accent: var(--foundation-primary-400);
      --gen-bg-primary-vibrant-highlight: var(--foundation-primary-200);

      /* Success color scheme */
      --gen-bg-success-subtle-base: var(--foundation-success-100);
      --gen-bg-success-subtle-accent: var(--foundation-success-200);
      --gen-bg-success-subtle-highlight: var(--foundation-success-50, #FFFFFF);

      --gen-bg-success-medium-base: var(--foundation-success-200);
      --gen-bg-success-medium-accent: var(--foundation-success-300);
      --gen-bg-success-medium-highlight: var(--foundation-success-100);

      --gen-bg-success-vibrant-base: var(--foundation-success-300);
      --gen-bg-success-vibrant-accent: var(--foundation-success-400);
      --gen-bg-success-vibrant-highlight: var(--foundation-success-200);

      /* Warning color scheme */
      --gen-bg-warning-subtle-base: var(--foundation-warning-100);
      --gen-bg-warning-subtle-accent: var(--foundation-warning-200);
      --gen-bg-warning-subtle-highlight: var(--foundation-warning-50, #FFFFFF);

      --gen-bg-warning-medium-base: var(--foundation-warning-200);
      --gen-bg-warning-medium-accent: var(--foundation-warning-300);
      --gen-bg-warning-medium-highlight: var(--foundation-warning-100);

      --gen-bg-warning-vibrant-base: var(--foundation-warning-300);
      --gen-bg-warning-vibrant-accent: var(--foundation-warning-400);
      --gen-bg-warning-vibrant-highlight: var(--foundation-warning-200);

      /* Info color scheme */
      --gen-bg-info-subtle-base: var(--foundation-info-100);
      --gen-bg-info-subtle-accent: var(--foundation-info-200);
      --gen-bg-info-subtle-highlight: var(--foundation-info-50, #FFFFFF);

      --gen-bg-info-medium-base: var(--foundation-info-200);
      --gen-bg-info-medium-accent: var(--foundation-info-300);
      --gen-bg-info-medium-highlight: var(--foundation-info-100);

      --gen-bg-info-vibrant-base: var(--foundation-info-300);
      --gen-bg-info-vibrant-accent: var(--foundation-info-400);
      --gen-bg-info-vibrant-highlight: var(--foundation-info-200);

      /* NOTE: --is-dark will be set by client JavaScript for 'system' mode */
      /* For static 'light' or 'dark', set it here: */
      ${themeMode === 'dark' ? '--is-dark: 1;' : themeMode === 'light' ? '--is-dark: 0;' : '/* --is-dark set by JS */'}
    }

    ${isInverseAccent ? `
    /* ===== INVERSE ACCENT MODE (replaces data-accent-mode attribute) ===== */
    /* Override accent semantic tokens for high-contrast monochrome */
    :root {
      --surface-accent: var(--surface-inverse);
      --surface-accent-subtle: var(--surface-hover);
      --surface-accent-muted: var(--surface-active);

      --text-accent: var(--text-strong);
      --text-accent-strong: var(--text-strong);
      --text-accent-subtle: var(--text-default);
      --text-on-accent: var(--text-inverse);

      --border-accent: var(--border-emphasis);
      --border-accent-subtle: var(--border-default);
      --border-accent-strong: var(--border-emphasis);
      --border-focus: var(--border-emphasis);
      --border-selected: var(--border-emphasis);

      --icon-accent: var(--icon-strong);
      --icon-on-accent: var(--icon-inverse);

      --text-link: var(--text-strong);
      --text-link-hover: var(--text-default);

      --interactive-accent: var(--interactive-primary);
      --interactive-accent-hover: var(--interactive-primary-hover);
      --interactive-accent-active: var(--interactive-primary-active);
      --interactive-accent-disabled: var(--interactive-primary-disabled);
    }
    ` : ''}

    ${themeMode === 'dark' ? `
    /* ===== DARK MODE ADJUSTMENTS (only for static 'dark' mode) ===== */
    :root {
      --surface-backdrop: rgba(0, 0, 0, 0.7);
      --surface-scrim: rgba(0, 0, 0, 0.85);
    }
    ` : ''}
  `.trim();
}

/**
 * Parent function som kombinerar getDesignConfig + buildCssVars
 * Detta är den primära funktionen som ska användas i layouts
 *
 * @param isEditing - Optional parameter for backward compatibility (not used)
 * @returns CSS string redo att injectas i <style> tag
 */
/**
 * Returns CSS and theme metadata from design.json
 * Always reads the actual file for consistent behavior
 */
export async function designSnippet(isEditing?: boolean): Promise<{
  css: string;
  themeTone: string;
  themeMode: 'light' | 'dark' | 'system';
  isDark: boolean;  // Deprecated but kept for compatibility
  accentColor: string
}> {
  const designConfig = await getDesignConfig();

  if (!designConfig) {
    // No design config found, return defaults
    return {
      css: "",
      themeTone: "neutral",
      themeMode: "light",
      isDark: false,  // Deprecated
      accentColor: "purple"
    };
  }

  const tokens = designConfig.globalStyles || {};
  const themeTone = tokens.themeTone || "neutral";
  const accentColor = tokens.accentColor || "purple";

  // Auto-migration logic
  let themeMode: 'light' | 'dark' | 'system';
  if (tokens.themeMode) {
    themeMode = tokens.themeMode;
  } else if (tokens.isDark !== undefined) {
    themeMode = tokens.isDark ? 'dark' : 'light';
  } else {
    themeMode = 'light';
  }

  // Generate CSS
  const css = buildCssVars(tokens);

  // Return both new and deprecated fields
  const isDark = themeMode === 'dark';  // For backward compatibility

  return {
    css,
    themeTone,
    themeMode,  // NEW
    isDark,     // DEPRECATED (derived from themeMode)
    accentColor
  };
}