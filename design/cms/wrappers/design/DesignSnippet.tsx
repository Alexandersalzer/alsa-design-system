import type { DesignJson } from "./designLoader";

export type RadiusScale =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full";

/** Säker normalisering av radius-värde */
function normalizeRadius(input: unknown): RadiusScale {
  const allowed: RadiusScale[] = [
    "none", "xs", "sm", "md", "lg", "xl", "2xl", "full",
  ];
  if (typeof input === "string" && allowed.includes(input as RadiusScale)) {
    return input as RadiusScale;
  }
  return "md"; // fallback
}

/** 
 * Genererar CSS-variabler från design.json
 * Används för att injicera design tokens direkt i <head>
 */
export function buildCssVars(design: DesignJson): string {
  const radius = normalizeRadius(design?.globalStyles?.radius);
  const accentColor = design?.globalStyles?.accentColor || "#2ace28";
  const isDark = design?.globalStyles?.isDark ?? false;
  const fontPrimary = design?.globalStyles?.fontPrimary || "Sora";

  // Generate Google Fonts URL for the primary font
  const fontWeights = "400;600;700;800";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontPrimary.replace(/\s/g, '+')}:wght@${fontWeights}&display=swap`;

  return `
    @import url('${fontUrl}');

    :root {
      /* Radius tokens */
      --selected-radius-scale-none: var(--foundation-radius-${radius}-none);
      --selected-radius-scale-xs:   var(--foundation-radius-${radius}-xs);
      --selected-radius-scale-sm:   var(--foundation-radius-${radius}-sm);
      --selected-radius-scale-md:   var(--foundation-radius-${radius}-md);
      --selected-radius-scale-lg:   var(--foundation-radius-${radius}-lg);
      --selected-radius-scale-xl:   var(--foundation-radius-${radius}-xl);
      --selected-radius-scale-2xl:  var(--foundation-radius-${radius}-2xl);
      --selected-radius-scale-full: var(--foundation-radius-${radius}-full);

      /* Accent color */
      --accent-color: ${accentColor};

      /* Theme control - 0 for light, 1 for dark */
      --is-dark: ${isDark ? 1 : 0};

      /* Font configuration */
      --font-primary-name: '${fontPrimary}';
    }
  `.trim();
}
