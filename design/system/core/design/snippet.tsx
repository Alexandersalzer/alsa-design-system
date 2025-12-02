import type { DesignTokens } from "../types/design";
import { getDesignConfig } from "./loaders";

/**
 * Generates CSS variables from design.json
 * Injects design tokens dynamically into <head>.
 */
export function buildCssVars(tokens: DesignTokens): string {
  const radius           = tokens?.radius           || "md";
  const accentColor      = tokens?.accentColor      || "purple";
  const isDark           = tokens?.isDark           ?? false;
  const themeTone        = tokens?.themeTone        || "neutral";
  const fontPrimary      = tokens?.fontPrimary      || "Sora";
  const fontSecondary    = tokens?.fontSecondary    || fontPrimary;
  const fontWeightScale  = tokens?.fontWeightScale  || "regular";
  const layoutContent    = tokens?.layoutContent    || "md";
  const layoutMedia      = tokens?.layoutMedia      || "xl";
  const sectionSpacing   = tokens?.sectionSpacing   || "md";
  const containerSpacing = tokens?.containerSpacing || "md";
  const navbarSpacing    = tokens?.navbarSpacing    || "md";
  const formWidth        = tokens?.formWidth        || "sm";  // ← NEW
  const typographyScale  = tokens?.typographyScale  || "md";

  const fontWeights = "300;400;500;600;700;800;900";
  const fontsToImport = [fontPrimary, fontSecondary]
    .filter((f, i, arr) => arr.indexOf(f) === i)
    .map(f => `family=${f.replace(/\s/g, '+')}:wght@${fontWeights}`)
    .join('&');
  const fontUrl = `https://fonts.googleapis.com/css2?${fontsToImport}&display=swap`;

  const isInverseAccent = accentColor === "inverse";

  return `
    @import url('${fontUrl}');
    :root {
      /* ===== FONTS ===== */
      --font-primary-name: '${fontPrimary}';
      --font-secondary-name: '${fontSecondary}';

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

      /* ===== Accent ===== */
      ${isInverseAccent ? `
        --accent-100: var(--secondary-100);
        --accent-200: var(--secondary-200);
        --accent-300: var(--secondary-300);
        --accent-400: var(--secondary-400);
        --accent-500: var(--secondary-500);
        --accent-600: var(--secondary-1200);
        --accent-700: var(--secondary-1100);
        --accent-800: var(--secondary-1000);
        --accent-900: var(--secondary-900);
      ` : `
        --accent-100: var(--foundation-${accentColor}-100);
        --accent-200: var(--foundation-${accentColor}-200);
        --accent-300: var(--foundation-${accentColor}-300);
        --accent-400: var(--foundation-${accentColor}-400);
        --accent-500: var(--foundation-${accentColor}-500);
        --accent-600: var(--foundation-${accentColor}-600);
        --accent-700: var(--foundation-${accentColor}-700);
        --accent-800: var(--foundation-${accentColor}-800);
        --accent-900: var(--foundation-${accentColor}-900);
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

      /* ===== Font weight scale ===== */
      --selected-font-weight-heading: var(--foundation-weightscale-${fontWeightScale}-heading);
      --selected-font-weight-body:    var(--foundation-weightscale-${fontWeightScale}-body);
      --selected-font-weight-label:   var(--foundation-weightscale-${fontWeightScale}-label);

      /* ===== Theme ===== */
      --is-dark: ${isDark ? 1 : 0};
    }
  `.trim();
}

/**
 * Parent function som kombinerar getDesignConfig + buildCssVars
 * Detta är den primära funktionen som ska användas i layouts
 * 
 * @returns CSS string redo att injectas i <style> tag
 */
/**
 * Returns CSS and theme metadata from design.json
 * Always reads the actual file for consistent behavior
 */
export async function designSnippet(): Promise<{ css: string; themeTone: string; isDark: boolean }> {
  const designConfig = await getDesignConfig();
  
  if (!designConfig) {
    // No design config found, return defaults
    return {
      css: "",
      themeTone: "neutral",
      isDark: false
    };
  }
  
  const tokens = designConfig.globalStyles || {};
  const themeTone = tokens.themeTone || "neutral";
  const isDark = tokens.isDark ?? false;
  const css = buildCssVars(tokens);
  
  return { css, themeTone, isDark };
}