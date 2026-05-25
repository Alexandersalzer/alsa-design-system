/**
 * Client-side mirror of snippet.tsx's design-token emission.
 *
 * Two concerns:
 *  1. COLOR scales (accent + neutral) — generated via colorEngine and written
 *     into a single <style> tag, scoped by [data-theme] so dark mode works.
 *  2. NON-COLOR tokens (radius, layout, fonts, weights, spacing, typography
 *     scale) — mirrored verbatim from snippet.tsx:142-197 into the :root
 *     portion of the same <style> tag, so the modal previews them live.
 *
 * design.json compatibility: buildJsonSnippet() emits the exact `globalStyles`
 * shape the SSR pipeline reads, so the snippet can be pasted into
 * public/design/design.json for persistence and produce an identical result.
 */

import {
  generateScale,
  STEPS,
  resolveAccentInput,
  resolveToneInput,
  hexToOklch,
} from '../../design/system/core/design/colorEngine';
import type { Scale } from '../../design/system/core/design/colorEngine';

const STYLE_TAG_ID = 'alsa-customizer-overrides';
const FONT_LINK_ID = 'alsa-customizer-fonts';

export type RadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type LayoutToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type TypographyScaleToken = 'sm' | 'md' | 'lg' | 'xl';

export interface CustomizerState {
  // ----- Colors -----
  accentHex: string;            // e.g. '#FFA366' or 'inverse'
  toneHex: string;              // e.g. '#0F172A'
  baseColorIntensity: number;   // 0..1
  themeMode: 'light' | 'dark' | 'system';

  // ----- Radius / layout -----
  radius: RadiusToken;
  layoutContent: LayoutToken;
  layoutMedia: LayoutToken;
  formWidth: LayoutToken;

  // ----- Typography -----
  fontPrimary: string;
  fontSecondary: string;
  fontWeightHeadingNumeric: number; // 100..900
  fontWeightBodyNumeric: number;    // 100..900
  typographyScale: TypographyScaleToken;

  // ----- Spacing -----
  sectionSpacing: SpacingToken;
  containerSpacing: SpacingToken;
  navbarSpacing: SpacingToken;
}

/** Reverse of WEIGHT_TIER_MAP in design/system/core/design/weights.ts.
 *  design.json stores named weights; the modal works in numeric. */
const NUMERIC_TO_NAMED: Record<number, string> = {
  100: 'thin',
  200: 'extralight',
  300: 'light',
  400: 'regular',
  500: 'medium',
  600: 'semibold',
  700: 'bold',
  800: 'extrabold',
  900: 'black',
};

/** Snap an arbitrary numeric weight to the nearest named tier value. */
function numericToNamedWeight(n: number): string {
  const keys = Object.keys(NUMERIC_TO_NAMED).map(Number);
  const nearest = keys.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a));
  return NUMERIC_TO_NAMED[nearest];
}

/** Label weight sits between body and heading (mirrors weights.ts logic). */
function deriveLabelWeight(heading: number, body: number): number {
  return Math.round((heading + body) / 2);
}

function emitScale(prefix: string, scale: Scale): string {
  return STEPS.map((s) => `--foundation-${prefix}-${s}: ${scale[s]};`).join('\n  ');
}

/**
 * Non-color token vars. Mirrors design/system/core/design/snippet.tsx:142-197
 * verbatim in structure — keep the var names in sync if snippet.tsx changes.
 */
function buildTokenVarCss(state: CustomizerState): string {
  const {
    radius, layoutContent, layoutMedia, formWidth,
    fontPrimary, fontSecondary, typographyScale,
    sectionSpacing, containerSpacing, navbarSpacing,
    fontWeightHeadingNumeric: wH, fontWeightBodyNumeric: wB,
  } = state;
  const wL = deriveLabelWeight(wH, wB);

  return `
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

  /* ===== Font weights (numeric 100-900) ===== */
  --dynamic-font-weight-heading: ${wH};
  --dynamic-font-weight-body:    ${wB};
  --dynamic-font-weight-label:   ${wL};
  --selected-font-weight-heading: ${wH};
  --selected-font-weight-body:    ${wB};
  --selected-font-weight-label:   ${wL};`.trimEnd();
}

/** Build the full override stylesheet (light + dark color scopes + tokens). */
function buildOverrideCss(state: CustomizerState): string {
  const accentLight = generateScale({ hex: state.accentHex, mode: 'light', kind: 'accent' });
  const accentDark = generateScale({ hex: state.accentHex, mode: 'dark', kind: 'accent' });
  const neutralLight = generateScale({
    hex: state.toneHex, mode: 'light', kind: 'neutral', intensity: state.baseColorIntensity,
  });
  const neutralDark = generateScale({
    hex: state.toneHex, mode: 'dark', kind: 'neutral', intensity: state.baseColorIntensity,
  });

  const hue = state.accentHex === 'inverse' ? 0 : Math.round(hexToOklch(state.accentHex).h);
  const sat = state.accentHex === 'inverse' ? 0 : 0.85;

  return `
[data-theme="light"], :root {
  ${emitScale('accent', accentLight.scale)}
  ${emitScale('gray', neutralLight.scale)}
  --accent-hue: ${hue};
  --accent-hue-deg: ${hue}deg;
  --accent-tint-saturation: ${sat};
${buildTokenVarCss(state)}
}

[data-theme="dark"] {
  ${emitScale('accent', accentDark.scale)}
  ${emitScale('gray', neutralDark.scale)}
}
`.trim();
}

function ensureStyleTag(): HTMLStyleElement {
  let tag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement('style');
    tag.id = STYLE_TAG_ID;
    document.head.appendChild(tag);
  }
  return tag;
}

/** Inject/replace the Google Fonts <link> for the chosen families. */
function ensureFontLink(fontPrimary: string, fontSecondary: string) {
  const families = Array.from(new Set([fontPrimary, fontSecondary].filter(Boolean)));
  if (families.length === 0) return;
  // Request the full useful weight range; Google serves what the font has.
  const query = families
    .map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800;900`)
    .join('&');
  const href = `https://fonts.googleapis.com/css2?${query}&display=swap`;

  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== href) link.href = href;
}

/** Set <html data-theme> and `--is-dark` based on mode (resolving 'system'). */
function writeThemeMode(mode: 'light' | 'dark' | 'system') {
  const html = document.documentElement;
  let effective: 'light' | 'dark';
  if (mode === 'system') {
    effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else {
    effective = mode;
  }
  html.setAttribute('data-theme', effective);
  html.setAttribute('data-theme-mode', mode);
  html.style.setProperty('--is-dark', effective === 'dark' ? '1' : '0');
  if (effective === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

/** Public: apply the customizer state to the live page. */
export function applyCustomizerToRoot(state: CustomizerState) {
  const accentHex = resolveAccentInput(state.accentHex === 'inverse' ? 'inverse' : state.accentHex);
  const toneHex = resolveToneInput(state.toneHex);
  const normalized: CustomizerState = { ...state, accentHex, toneHex };

  const tag = ensureStyleTag();
  tag.textContent = buildOverrideCss(normalized);
  ensureFontLink(state.fontPrimary, state.fontSecondary);
  writeThemeMode(state.themeMode);
}

/** Strip all customizer overrides — back to whatever snippet.tsx emitted. */
export function clearCustomizerOverrides() {
  document.getElementById(STYLE_TAG_ID)?.remove();
  document.getElementById(FONT_LINK_ID)?.remove();
}

/** Build the JSON snippet to paste into design.json's globalStyles. */
export function buildJsonSnippet(state: CustomizerState): string {
  const out = {
    globalStyles: {
      radius: state.radius,
      layoutContent: state.layoutContent,
      layoutMedia: state.layoutMedia,
      formWidth: state.formWidth,
      accent: state.accentHex === 'inverse' ? 'inverse' : { hex: state.accentHex },
      themeTone: { hex: state.toneHex },
      baseColorIntensity: state.baseColorIntensity,
      themeMode: state.themeMode,
      fontPrimary: state.fontPrimary,
      fontSecondary: state.fontSecondary,
      fontWeightHeading: numericToNamedWeight(state.fontWeightHeadingNumeric),
      fontWeightBody: numericToNamedWeight(state.fontWeightBodyNumeric),
      typographyScale: state.typographyScale,
      sectionSpacing: state.sectionSpacing,
      containerSpacing: state.containerSpacing,
      navbarSpacing: state.navbarSpacing,
    },
  };
  return JSON.stringify(out, null, 2);
}
