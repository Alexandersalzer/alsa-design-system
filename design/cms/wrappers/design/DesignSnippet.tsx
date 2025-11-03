import type { DesignJson } from "./designLoader";
import { getDesignConfig } from "./designLoader";

/**
 * Generates CSS variables from design.json
 * Injects design tokens dynamically into <head>.
 */
export function buildCssVars(design: DesignJson): string {
  const radius         = design?.globalStyles?.radius         || "md";
  const accentColor    = design?.globalStyles?.accentColor    || "#2ace28";
  const isDark         = design?.globalStyles?.isDark         ?? false;
  const fontPrimary    = design?.globalStyles?.fontPrimary    || "Sora";
  const layoutContent  = design?.globalStyles?.layoutContent  || "md";
  const layoutMedia    = design?.globalStyles?.layoutMedia    || "xl";
  const sectionSpacing = design?.globalStyles?.sectionSpacing || "md";

  const fontWeights = "400;600;700;800";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontPrimary.replace(/\s/g, '+')}:wght@${fontWeights}&display=swap`;

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

      /* ===== Theme & font ===== */
      --accent-color: ${accentColor};
      --is-dark: ${isDark ? 1 : 0};
      --font-primary-name: '${fontPrimary}';
    }
  `.trim();
}

/**
 * Parent function som kombinerar getDesignConfig + buildCssVars
 * Detta är den primära funktionen som ska användas i layouts
 * 
 * @returns CSS string redo att injectas i <style> tag
 */
export async function designSnippet(): Promise<string> {
  const designConfig = await getDesignConfig();
  const designCss = buildCssVars(designConfig);
  return designCss;
}
