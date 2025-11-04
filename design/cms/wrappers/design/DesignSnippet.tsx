import type { DesignJson } from "./designLoader";

/**
 * Generates CSS variables from design.json
 * Injects design tokens dynamically into <head>.
 */
export function buildCssVars(design: DesignJson): string {
  const radius          = design?.globalStyles?.radius          || "md";
  const accentColor     = design?.globalStyles?.accentColor     || "purple";
  const isDark          = design?.globalStyles?.isDark          ?? false;
  const fontPrimary     = design?.globalStyles?.fontPrimary     || "Sora";
  const layoutContent   = design?.globalStyles?.layoutContent   || "md";
  const layoutMedia     = design?.globalStyles?.layoutMedia     || "xl";
  const sectionSpacing  = design?.globalStyles?.sectionSpacing  || "md";
  const containerSpacing = design?.globalStyles?.containerSpacing || "md"; // ✅ NEW

  const fontWeights = "400;600;700;800";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontPrimary.replace(/\s/g, '+')}:wght@${fontWeights}&display=swap`;

  const isInverseAccent = accentColor === "inverse";

  return `
    @import url('${fontUrl}');
    :root {
      /* ===== Radius (selected scale) ===== */
      --selected-radius-scale-none: var(--foundation-radius-${radius}-none);
      --selected-radius-scale-xs:   var(--foundation-radius-${radius}-xs);
      --selected-radius-scale-sm:   var(--foundation-radius-${radius}-sm);
      --selected-radius-scale-md:   var(--foundation-radius-${radius}-md);
      --selected-radius-scale-lg:   var(--foundation-radius-${radius}-lg);
      --selected-radius-scale-xl:   var(--foundation-radius-${radius}-xl);
      --selected-radius-scale-2xl:  var(--foundation-radius-${radius}-2xl);
      --selected-radius-scale-full: var(--foundation-radius-${radius}-full);

      /* ===== Layout widths (selected scale) ===== */
      --selected-layout-scale-content: var(--foundation-layout-${layoutContent}-content);
      --selected-layout-scale-media:   var(--foundation-layout-${layoutMedia}-media);

      /* ===== Section spacing (selected scale) ===== */
      --selected-section-spacing: var(--foundation-section-spacing-${sectionSpacing});

      /* ===== Container spacing (selected scale) ===== */
      --selected-container-spacing: var(--foundation-container-spacing-${containerSpacing});

      ${isInverseAccent ? `
      /* ===== Inverse Accent (uses existing --secondary-* scale) ===== */
      --accent-100:  var(--secondary-100);
      --accent-200:  var(--secondary-200);
      --accent-300:  var(--secondary-300);
      --accent-400:  var(--secondary-400);
      --accent-500:  var(--secondary-500);
      --accent-600:  var(--secondary-600);
      --accent-700:  var(--secondary-700);
      --accent-800:  var(--secondary-800);
      --accent-900:  var(--secondary-900);
      --accent-950:  var(--secondary-900);
      --accent-1000: var(--secondary-900);
      --accent-1100: var(--secondary-900);
      --accent-1200: var(--secondary-900);
      ` : `
      /* ===== Accent color scale (overrides semantic colors.css) ===== */
      --accent-100:  var(--foundation-${accentColor}-100);
      --accent-200:  var(--foundation-${accentColor}-200);
      --accent-300:  var(--foundation-${accentColor}-300);
      --accent-400:  var(--foundation-${accentColor}-400);
      --accent-500:  var(--foundation-${accentColor}-500);
      --accent-600:  var(--foundation-${accentColor}-600);
      --accent-700:  var(--foundation-${accentColor}-700);
      --accent-800:  var(--foundation-${accentColor}-800);
      --accent-900:  var(--foundation-${accentColor}-900);
      --accent-950:  var(--foundation-${accentColor}-950);
      --accent-1000: var(--foundation-${accentColor}-1000);
      --accent-1100: var(--foundation-${accentColor}-1100);
      --accent-1200: var(--foundation-${accentColor}-1200);
      `}

      /* ===== Theme & font ===== */
      --is-dark: ${isDark ? 1 : 0};
      --font-primary-name: '${fontPrimary}';
    }
  `.trim();
}