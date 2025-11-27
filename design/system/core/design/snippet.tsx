import type { DesignConfig } from "../types/design";
  import { getDesignConfig } from "./loaders";

  /**
   * Generates CSS variables from design.json
   * 
   * KEY CONCEPT:
   * - For colored accents: override the --accent-* PRIMITIVE scale with chosen color
   * - For inverse mode: override SEMANTIC tokens to use neutral values
   * - Snippet overrides Section 2, components use Section 3
   */
  export function buildCssVars(design: DesignConfig): string {
    const radius           = design?.globalStyles?.radius           || "md";
    const accentColor      = design?.globalStyles?.accentColor      || "purple";
    const isDark           = design?.globalStyles?.isDark           ?? false;
    const themeTone        = design?.globalStyles?.themeTone        || "neutral";
    const fontPrimary      = design?.globalStyles?.fontPrimary      || "Sora";
    const fontSecondary    = design?.globalStyles?.fontSecondary    || fontPrimary;
    const fontWeightScale  = design?.globalStyles?.fontWeightScale  || "regular";
    const layoutContent    = design?.globalStyles?.layoutContent    || "md";
    const layoutMedia      = design?.globalStyles?.layoutMedia      || "xl";
    const sectionSpacing   = design?.globalStyles?.sectionSpacing   || "md";
    const containerSpacing = design?.globalStyles?.containerSpacing || "md";
    const navbarSpacing    = design?.globalStyles?.navbarSpacing    || "md";
    const formWidth        = design?.globalStyles?.formWidth        || "sm";
    const typographyScale  = design?.globalStyles?.typographyScale  || "md";

    const fontWeights = "300;400;500;600;700;800;900";
    const fontsToImport = [fontPrimary, fontSecondary]
      .filter((f, i, arr) => arr.indexOf(f) === i)
      .map(f => `family=${f.replace(/\s/g, '+')}:wght@${fontWeights}`)
      .join('&');
    const fontUrl = `https://fonts.googleapis.com/css2?${fontsToImport}&display=swap`;

    const isInverseAccent = accentColor === "inverse";

    // Build accent CSS based on mode
    const accentCss = isInverseAccent
      ? buildInverseAccentCss(isDark)
      : buildColorAccentCss(accentColor, isDark);

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
        --selected-layout-scale-content: 
  var(--foundation-layout-${layoutContent}-content);
        --selected-layout-scale-media:   var(--foundation-layout-${layoutMedia}-media);
        
        /* ===== Form width ===== */
        --selected-form-width: var(--foundation-form-${formWidth}-width);

        /* ===== Spacing ===== */
        --selected-section-spacing:   var(--foundation-section-spacing-${sectionSpacing});
        --selected-container-spacing: 
  var(--foundation-container-spacing-${containerSpacing});
        --selected-navbar-spacing:    var(--foundation-navbar-spacing-${navbarSpacing});

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
        --selected-leading-tight:   
  var(--foundation-typography-${typographyScale}-leading-tight);
        --selected-leading-snug:    
  var(--foundation-typography-${typographyScale}-leading-snug);
        --selected-leading-normal:  
  var(--foundation-typography-${typographyScale}-leading-normal);
        --selected-leading-relaxed: 
  var(--foundation-typography-${typographyScale}-leading-relaxed);
        --selected-leading-loose:   
  var(--foundation-typography-${typographyScale}-leading-loose);

        /* ===== Font weight scale ===== */
        --selected-font-weight-heading: 
  var(--foundation-weightscale-${fontWeightScale}-heading);
        --selected-font-weight-body:    
  var(--foundation-weightscale-${fontWeightScale}-body);
        --selected-font-weight-label:   
  var(--foundation-weightscale-${fontWeightScale}-label);

        /* ===== Theme ===== */
        --is-dark: ${isDark ? 1 : 0};

        /* ===== Accent System ===== */
        ${accentCss}
      }
    `.trim();
  }

  /**
   * Builds CSS for a colored accent (purple, blue, orange, etc.)
   * ✅ CORRECT: Overrides Section 2 primitive --accent-* scale
   * Semantic tokens in colors.css automatically reference these
   */
  function buildColorAccentCss(accentColor: string, isDark: boolean): string {
    return `
        /* === COLORED ACCENT: ${accentColor} === */
        /* Override Section 2 primitive accent scale with chosen color */
        --accent-100: color-mix(in srgb, var(--foundation-${accentColor}-100) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-1200) calc(var(--is-dark) * 
  100%));
        --accent-200: color-mix(in srgb, var(--foundation-${accentColor}-200) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-1100) calc(var(--is-dark) * 
  100%));
        --accent-300: color-mix(in srgb, var(--foundation-${accentColor}-300) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-1000) calc(var(--is-dark) * 
  100%));
        --accent-400: color-mix(in srgb, var(--foundation-${accentColor}-400) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-900) calc(var(--is-dark) * 
  100%));
        --accent-500: color-mix(in srgb, var(--foundation-${accentColor}-500) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-800) calc(var(--is-dark) * 
  100%));
        --accent-600: color-mix(in srgb, var(--foundation-${accentColor}-600) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-700) calc(var(--is-dark) * 
  100%));
        --accent-700: color-mix(in srgb, var(--foundation-${accentColor}-700) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-600) calc(var(--is-dark) * 
  100%));
        --accent-800: color-mix(in srgb, var(--foundation-${accentColor}-800) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-500) calc(var(--is-dark) * 
  100%));
        --accent-900: color-mix(in srgb, var(--foundation-${accentColor}-900) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-400) calc(var(--is-dark) * 
  100%));
        --accent-1000: color-mix(in srgb, var(--foundation-${accentColor}-1000) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-300) calc(var(--is-dark) * 
  100%));
        --accent-1100: color-mix(in srgb, var(--foundation-${accentColor}-1100) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-200) calc(var(--is-dark) * 
  100%));
        --accent-1200: color-mix(in srgb, var(--foundation-${accentColor}-1200) calc((1 - 
  var(--is-dark)) * 100%), var(--foundation-${accentColor}-100) calc(var(--is-dark) * 
  100%));
        
        /* ✅ Semantic tokens use defaults from colors.css - no override needed */
    `;
  }

  /**
   * Builds CSS for inverse/monochrome accent mode
   * ✅ FIXED: Override Section 3 semantic tokens to use neutral equivalents
   * ❌ REMOVED: Direct references to Section 2 primitives like --neutral-1200
   */
  function buildInverseAccentCss(isDark: boolean): string {
    return `
        /* === INVERSE ACCENT (MONOCHROME) === */
        /* Override Section 3 semantic tokens to use neutral instead of accent */
        
        /* --- Surfaces --- */
        --surface-accent: var(--surface-inverse);
        --surface-accent-subtle: var(--surface-raised);
        --surface-accent-muted: var(--surface-hover);
        
        /* --- Text --- */
        --text-accent: var(--text-strong);
        --text-accent-strong: var(--text-strong);
        --text-on-accent: var(--text-inverse);
        
        /* --- Borders --- */
        --border-accent: var(--border-emphasis);
        --border-accent-subtle: var(--border-strong);
        /* ✅ FIXED: Use semantic tokens, not primitives */
        --border-focus: var(--border-emphasis);
        --border-selected: var(--border-emphasis);
        
        /* --- Icons --- */
        --icon-accent: var(--icon-strong);
        --icon-on-accent: var(--icon-inverse);
        
        /* --- Interactive --- */
        /* Accent buttons become identical to primary buttons */
        --interactive-accent: var(--interactive-primary);
        --interactive-accent-hover: var(--interactive-primary-hover);
        --interactive-accent-active: var(--interactive-primary-active);
        --interactive-accent-disabled: var(--interactive-primary-disabled);
        
        /* --- Links --- */
        --text-link: var(--text-strong);
        --text-link-hover: var(--text-default);
    `;
  }

  /**
   * Returns both CSS and theme metadata
   */
  export async function designSnippet(isEditing: boolean = false): Promise<{ css: string;
  themeTone: string; isDark: boolean }> {
    if (isEditing) {
      return {
        css: "",
        themeTone: "mono",
        isDark: false
      };
    }

    const designConfig = await getDesignConfig();
    const themeTone = designConfig?.globalStyles?.themeTone || "neutral";
    const isDark = designConfig?.globalStyles?.isDark ?? false;
    const css = buildCssVars(designConfig);

    return { css, themeTone, isDark };
  }

  /**
   * Helper to get themeTone for setting HTML attribute
   */
  export async function getThemeTone(): Promise<string> {
    const designConfig = await getDesignConfig();
    return designConfig?.globalStyles?.themeTone || "neutral";
  }