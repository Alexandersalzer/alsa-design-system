'use client';
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

/** Genererar CSS-variabler från design.json */
export function buildCssVars(design: DesignJson): string {
  const radius = normalizeRadius(design?.globalStyles?.radius);

  return `
    :root {
      --selected-radius-scale-none: var(--foundation-radius-${radius}-none);
      --selected-radius-scale-xs:   var(--foundation-radius-${radius}-xs);
      --selected-radius-scale-sm:   var(--foundation-radius-${radius}-sm);
      --selected-radius-scale-md:   var(--foundation-radius-${radius}-md);
      --selected-radius-scale-lg:   var(--foundation-radius-${radius}-lg);
      --selected-radius-scale-xl:   var(--foundation-radius-${radius}-xl);
      --selected-radius-scale-2xl:  var(--foundation-radius-${radius}-2xl);
      --selected-radius-scale-full: var(--foundation-radius-${radius}-full);
    }
  `.trim();
}

/**
 * DesignSnippet
 * - Tar emot design config som prop
 * - Genererar CSS-variabler och injicerar i <style>
 */
interface DesignSnippetProps {
  design: DesignJson;
}

export function DesignSnippet({ design }: DesignSnippetProps) {
  const css = buildCssVars(design);

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
