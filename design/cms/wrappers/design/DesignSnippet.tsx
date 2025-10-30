// Server-komponent (ingen "use client")
// Denna komponent renderar ett <style>-block i <head> vid build/SSR,
// så variablerna finns på plats före första paint.

import fs from "fs";
import path from "path";

export type RadiusScale =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full";

/** Schema för design.json vi bryr oss om nu. Utökas enkelt senare (färg, font, dark-mode, osv). */
export interface DesignJson {
  globalStyles?: {
    radius?: RadiusScale;
    // exempel senare:
    // accentColor?: string;
    // fontPrimary?: string;
    // isDark?: boolean;
  };
}

/** Allowlist + fallback för radius */
function normalizeRadius(input: unknown): RadiusScale {
  const allowed: RadiusScale[] = [
    "none", "xs", "sm", "md", "lg", "xl", "2xl", "full",
  ];
  if (typeof input === "string" && (allowed as string[]).includes(input)) {
    return input as RadiusScale;
  }
  return "md"; // trygg default
}

/** Genererar CSS-variabler från design.json */
function buildCssVars(design: DesignJson): string {
  const radius = normalizeRadius(design?.globalStyles?.radius);

  // Mappning: pekar våra "selected" tokens till foundation-skalan vald via radius
  // Ex: full ⇒ var(--foundation-radius-full-md) osv.
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

function readDesignFile(): DesignJson {
    try {
      const filePath = path.join(process.cwd(), "public", "design", "design.json");
      const json = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(json);
    } catch (err) {
      console.warn("⚠️  DesignSnippet: kunde inte läsa public/design/design.json – fallback används.", err);
      return { globalStyles: { radius: "md" } };
    }
  }

/**
 * DesignSnippet
 * - Läser en kontrollerad design.json-struktur
 * - Översätter till CSS custom properties som överskriver "selected" tokens
 * - Renderas i <head> för noll FOUC
 */
export function DesignSnippet() {
  const design = readDesignFile();
  const css = buildCssVars(design);
  return <style>{css}</style>;
}