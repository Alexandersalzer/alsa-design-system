/**
 * Color Engine — OKLCH-based scale generator for the Alsa design system.
 *
 * Replaces hand-tuned hex scales (foundation/colors.css + theme-tone-*.css) with
 * mathematical generation from a single user input (hex). Produces 15 steps per
 * scale (0..1400), separate scales for light and dark modes, with WCAG-AA contrast
 * clamping on text-bearing steps.
 *
 * NO RUNTIME DEPENDENCIES. Pure functions. Server-side only (output is plain hex).
 *
 * See plan §1.4 for full design rationale.
 */

// =============================================================================
// TYPES
// =============================================================================

export type Step = 0 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100 | 1200 | 1300 | 1400;
export const STEPS: Step[] = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400];

export type Mode = 'light' | 'dark';
export type Kind = 'accent' | 'neutral';
export type Classification = 'vibrant' | 'muted' | 'near-neutral';

export interface OKLCH { l: number; c: number; h: number }
export interface RGB { r: number; g: number; b: number } // 0..1

export interface GenerateScaleInput {
  hex: string;
  mode: Mode;
  kind: Kind;
  /** For neutral scale: 0..1 (baseColorIntensity). 0 = pure gray, 1 = full chroma cap. */
  intensity?: number;
}

export type Scale = Record<Step, string>;

export interface GenerateScaleResult {
  scale: Scale;
  classification: Classification;
  /** Indexed by step — true if WCAG clamp altered that step's lightness. */
  clamped: Partial<Record<Step, { from: string; to: string }>>;
}

// =============================================================================
// CONSTANTS — LEGACY MIGRATION TABLES (plan §1.8)
// =============================================================================

export const LEGACY_ACCENT_TO_HEX: Record<string, string> = {
  'orange-light': '#FFA366',
  'orange': '#F97316',
  'red': '#EF4444',
  'red-light': '#FF9C9C',
  'red-dark': '#E85555',
  'blue': '#3B82F6',
  'blue-light': '#4AA3FF',
  'blue-dark': '#2563EB',
  'green': '#22C55E',
  'green-light': '#4ADE80',
  'green-dark': '#16A34A',
  'yellow': '#EAB308',
  'yellow-light': '#FDE047',
  'yellow-dark': '#D4930B',
  'purple': '#9333EA',
  'purple-light': '#C084FC',
  'purple-dark': '#7C3AED',
  'pink': '#EC4899',
  'pink-light': '#F472B6',
  'pink-dark': '#D946EF',
  'indigo': '#7C3AED',
  'teal': '#14B8A6',
  'teal-light': '#06D6A0',
  'teal-dark': '#118A7E',
  'amber': '#EBA942',
  'inverse': 'inverse', // sentinel — engine handles separately
};

export const LEGACY_TONE_TO_HEX: Record<string, string> = {
  'pure': '#000000',
  'graphite': '#0d0d0d',
  'mono': '#0d0c0c',
  'charcoal': '#0d0c0b',
  'steel': '#0c0c0d',
  'slate': '#0c0d0e',
  'aqua': '#0a0e10',
  'ink': '#0a0c10',
  'navy': '#0f172a',
  'frost': '#0a0e0f',
  'violet': '#0d0a0f',
  'sage': '#0b0f0b',
  'pearl': '#0e0d0b',
  'linen': '#0f0d0a',
  'ember': '#100c0a',
  'aqua-vibrant': '#111517',
  'ink-vibrant': '#111315',
  'frost-vibrant': '#111617',
  'violet-vibrant': '#141317',
  'sage-vibrant': '#131713',
  'ember-vibrant': '#171511',
  'neutral': '#000000',
};

/** Resolve a user-supplied accent string (legacy name OR hex) to a hex value. */
export function resolveAccentInput(input: string | { hex: string } | undefined): string {
  if (!input) return '#9333EA';
  if (typeof input === 'object' && 'hex' in input) return input.hex;
  if (typeof input === 'string') {
    if (input.startsWith('#')) return input;
    if (input === 'inverse') return 'inverse';
    return LEGACY_ACCENT_TO_HEX[input] ?? '#9333EA';
  }
  return '#9333EA';
}

/** Resolve a user-supplied tone string (legacy name OR hex) to a hex value. */
export function resolveToneInput(input: string | { hex: string } | undefined): string {
  if (!input) return '#000000';
  if (typeof input === 'object' && 'hex' in input) return input.hex;
  if (typeof input === 'string') {
    if (input.startsWith('#')) return input;
    return LEGACY_TONE_TO_HEX[input] ?? '#000000';
  }
  return '#000000';
}

// =============================================================================
// COLOR-SPACE CONVERSIONS
// =============================================================================
//
// Conversion chain: hex → sRGB → linear RGB → OKLab → OKLCH (and reverse).
// All math is from Björn Ottosson's OKLab paper (https://bottosson.github.io/posts/oklab/)
// and the W3C CSS Color Module Level 4 reference implementation.

const PI = Math.PI;

export function hexToRgb(hex: string): RGB {
  const m = hex.replace('#', '').trim();
  const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
  if (full.length !== 6) throw new Error(`Invalid hex: ${hex}`);
  const n = parseInt(full, 16);
  return { r: ((n >> 16) & 0xff) / 255, g: ((n >> 8) & 0xff) / 255, b: (n & 0xff) / 255 };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const c = (v: number) => {
    const i = Math.max(0, Math.min(255, Math.round(v * 255)));
    return i.toString(16).padStart(2, '0').toUpperCase();
  };
  return '#' + c(r) + c(g) + c(b);
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/** Linear RGB → OKLab. */
function linearRgbToOklab(r: number, g: number, b: number): { L: number; a: number; b: number } {
  const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l = Math.cbrt(l_);
  const m = Math.cbrt(m_);
  const s = Math.cbrt(s_);

  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

/** OKLab → linear RGB. */
function oklabToLinearRgb(L: number, a: number, b: number): { r: number; g: number; b: number } {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

export function hexToOklch(hex: string): OKLCH {
  const { r: sr, g: sg, b: sb } = hexToRgb(hex);
  const r = srgbToLinear(sr);
  const g = srgbToLinear(sg);
  const b = srgbToLinear(sb);
  const { L, a, b: bb } = linearRgbToOklab(r, g, b);
  const c = Math.sqrt(a * a + bb * bb);
  let h = (Math.atan2(bb, a) * 180) / PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}

export function oklchToHex({ l, c, h }: OKLCH): string {
  const hr = (h * PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const lin = oklabToLinearRgb(l, a, b);

  // Out-of-gamut handling: clamp linear RGB to [0, 1] before sRGB conversion.
  // For wildly out-of-gamut OKLCH (which can happen at extreme chroma), this
  // is the simplest acceptable strategy. Production-quality gamut mapping
  // would reduce chroma until in-gamut, but for our scale generation the
  // clamp is good enough — we control the inputs.
  const r = Math.max(0, Math.min(1, lin.r));
  const g = Math.max(0, Math.min(1, lin.g));
  const bl = Math.max(0, Math.min(1, lin.b));

  return rgbToHex({ r: linearToSrgb(r), g: linearToSrgb(g), b: linearToSrgb(bl) });
}

// =============================================================================
// GAMUT-AWARE HELPERS (for the customizer UI)
// =============================================================================
//
// OKLCH is a much wider color space than sRGB — at most hues, chroma values
// above ~0.20 fall outside the sRGB gamut and get clipped, producing visible
// hue shifts (e.g. pure blue at high chroma clips toward magenta). The picker
// UI needs to know the safe chroma ceiling for each hue so the slider doesn't
// "get stuck" or change color unexpectedly.

/**
 * Find the maximum chroma for (l, h) that stays in the sRGB gamut.
 * Binary search; ~10 iterations is plenty for visual accuracy.
 */
export function maxChromaInGamut(l: number, h: number): number {
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 10; i++) {
    const mid = (lo + hi) / 2;
    if (isInGamut({ l, c: mid, h })) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** True if the OKLCH color converts to a fully in-gamut sRGB color. */
function isInGamut(oklch: OKLCH): boolean {
  const hr = (oklch.h * PI) / 180;
  const a = oklch.c * Math.cos(hr);
  const b = oklch.c * Math.sin(hr);
  const lin = oklabToLinearRgb(oklch.l, a, b);
  const eps = 1e-3;
  return (
    lin.r >= -eps && lin.r <= 1 + eps &&
    lin.g >= -eps && lin.g <= 1 + eps &&
    lin.b >= -eps && lin.b <= 1 + eps
  );
}

/**
 * Map a single 0..1 slider parameter `t` to a perceptually-smooth point on
 * the L/C ramp for the given hue. Used by the customizer's single-slider
 * picker so the user controls "darkness" with one slider while staying inside
 * the sRGB gamut at every position.
 *
 * • t = 0    → near-white tint (light, low chroma, low contrast)
 * • t ≈ 0.5  → most-saturated mid-tone for this hue
 * • t = 1    → near-black tint (dark, low chroma, low contrast)
 *
 * Chroma follows a bell curve peaking at the gamut limit for the mid-tone L.
 */
export function paramToOklch(t: number, hue: number): OKLCH {
  const tc = Math.max(0, Math.min(1, t));
  // Lightness curve: linear from 0.95 (top) → 0.20 (bottom)
  const l = 0.95 - tc * 0.75;
  // Chroma curve: bell shape — peaks where the gamut allows the most saturation
  const peakL = 0.6;
  const peakChroma = maxChromaInGamut(peakL, hue);
  // Distance from the peak (0 at peak, 1 at extremes)
  const peakT = (0.95 - peakL) / 0.75; // t value of the peak
  const dist = Math.abs(tc - peakT) / Math.max(peakT, 1 - peakT);
  // Bell: 1 at peak, ~0.1 at the ends
  const bell = Math.max(0.1, 1 - dist * dist);
  const cAtL = maxChromaInGamut(l, hue);
  const c = Math.min(cAtL, peakChroma * bell);
  return { l, c, h: hue };
}

/**
 * Inverse: given an OKLCH color, find the closest `t` on the perceptual ramp
 * for that hue. Used to position the single-slider thumb when loading a
 * persisted hex.
 */
export function oklchToParam(o: OKLCH): number {
  // Lightness curve is `l = 0.95 - t * 0.75` ⇒ `t = (0.95 - l) / 0.75`
  return Math.max(0, Math.min(1, (0.95 - o.l) / 0.75));
}

// =============================================================================
// CLASSIFICATION
// =============================================================================

export function classifyInput(oklch: OKLCH): Classification {
  if (oklch.c >= 0.15) return 'vibrant';
  if (oklch.c >= 0.05) return 'muted';
  return 'near-neutral';
}

// =============================================================================
// LIGHTNESS CURVES
// =============================================================================
//
// Each curve maps step (0..1400) → target lightness L (0..1).
// Step 0 = lightest end, Step 1400 = darkest end (matches existing semantic
// token mappings: --surface-page=0, --text-strong=1400 in light mode).

/** Light-mode lightness curve, asymmetric for vibrant inputs. */
function lightCurveVibrant(stepIdx: number): number {
  // 15 steps. Start at 0.99 (near-white), end at 0.18 (deep but not pitch).
  // Asymmetric easing: light end stretches, dark end compresses.
  // t in [0, 1] across 15 points
  const t = stepIdx / 14;
  // Use a power curve biased toward dark
  const eased = 1 - Math.pow(t, 1.3);
  return 0.18 + eased * (0.99 - 0.18);
}

/** Light-mode lightness curve for muted inputs (more symmetric). */
function lightCurveMuted(stepIdx: number): number {
  const t = stepIdx / 14;
  const eased = 1 - Math.pow(t, 1.15);
  return 0.20 + eased * (0.985 - 0.20);
}

/** Light-mode lightness curve for near-neutral inputs (linear-ish). */
function lightCurveNeutral(stepIdx: number): number {
  const t = stepIdx / 14;
  const eased = 1 - Math.pow(t, 1.05);
  return 0.08 + eased * (0.99 - 0.08);
}

/** Dark-mode lightness curve, asymmetric (compensates for OLED + reading). */
function darkCurveVibrant(stepIdx: number): number {
  const t = stepIdx / 14;
  // In dark mode step 0 is the dark surface, step 1400 is bright text.
  // Start at 0.16 (deep dark surface), end at 0.92 (bright text).
  const eased = Math.pow(t, 0.85);
  return 0.16 + eased * (0.92 - 0.16);
}

function darkCurveMuted(stepIdx: number): number {
  const t = stepIdx / 14;
  const eased = Math.pow(t, 0.92);
  return 0.18 + eased * (0.94 - 0.18);
}

function darkCurveNeutral(stepIdx: number): number {
  const t = stepIdx / 14;
  const eased = Math.pow(t, 1.0);
  return 0.10 + eased * (0.96 - 0.10);
}

function lightnessForStep(stepIdx: number, classification: Classification, mode: Mode): number {
  if (mode === 'light') {
    if (classification === 'vibrant') return lightCurveVibrant(stepIdx);
    if (classification === 'muted') return lightCurveMuted(stepIdx);
    return lightCurveNeutral(stepIdx);
  }
  if (classification === 'vibrant') return darkCurveVibrant(stepIdx);
  if (classification === 'muted') return darkCurveMuted(stepIdx);
  return darkCurveNeutral(stepIdx);
}

// =============================================================================
// CHROMA CURVES
// =============================================================================
//
// Chroma peaks at the mid-tones and falls off at both ends (steps 0 & 1400).
// This prevents oversaturated extremes and keeps the lightest/darkest steps
// near-neutral, which is what makes the scale look "designed" not "computed."

/**
 * Chroma multiplier (0..1) for a given step index.
 * Bell-shaped curve centered at step 600 (idx ~6).
 */
function chromaMultiplierForStep(stepIdx: number): number {
  // Peak at idx 6 (step 600), tapering to ~0.3 at the ends
  const peak = 6;
  const distFromPeak = Math.abs(stepIdx - peak);
  // Gaussian-ish: 1 at peak, ~0.3 at ends
  const sigma = 5.0;
  const m = Math.exp(-(distFromPeak * distFromPeak) / (2 * sigma * sigma));
  return Math.max(0.3, m);
}

// =============================================================================
// SCALE GENERATION
// =============================================================================

export function generateScale(input: GenerateScaleInput): GenerateScaleResult {
  // Special sentinel: "inverse" accent → pure monochrome scale (no chroma).
  if (input.hex === 'inverse') {
    const oklch = { l: 0.5, c: 0, h: 0 };
    return generateScaleFromOklch(oklch, 'near-neutral', input);
  }

  const oklch = hexToOklch(input.hex);
  const classification = classifyInput(oklch);

  // For neutral scale, clamp chroma based on baseColorIntensity.
  // intensity=0   → 0 chroma (pure gray)
  // intensity=0.5 → 0.10 chroma (matches old "subtle" theme tones like Aqua)
  // intensity=1.0 → 0.20 chroma (matches old "vibrant" theme tones)
  // The cap is large enough that the full slider range is visibly distinct.
  let workingChroma = oklch.c;
  if (input.kind === 'neutral') {
    const intensity = input.intensity ?? 0.08;
    const chromaCap = intensity * 0.20;
    workingChroma = Math.min(workingChroma, chromaCap);
  }

  const workingOklch: OKLCH = {
    l: oklch.l,
    c: workingChroma,
    h: oklch.h,
  };

  return generateScaleFromOklch(workingOklch, classification, input);
}

function generateScaleFromOklch(
  baseOklch: OKLCH,
  classification: Classification,
  input: GenerateScaleInput
): GenerateScaleResult {
  const scale = {} as Scale;
  let hueShift = 0;
  let chromaMod = 1.0;

  if (input.mode === 'dark') {
    // Cool the hue +3° and reduce overall chroma 15% for dark mode
    hueShift = 3;
    chromaMod = 0.85;
  }

  for (let i = 0; i < STEPS.length; i++) {
    const step = STEPS[i];
    const L = lightnessForStep(i, classification, input.mode);
    const chromaMult = chromaMultiplierForStep(i);
    const c = baseOklch.c * chromaMult * chromaMod;
    const h = (baseOklch.h + hueShift) % 360;
    scale[step] = oklchToHex({ l: L, c, h });
  }

  // WCAG clamp — only for accent scale, only on text-on-accent and accent-text.
  const clamped: Partial<Record<Step, { from: string; to: string }>> = {};
  if (input.kind === 'accent') {
    applyContrastClamp(scale, clamped, input.mode, classification);
  }

  return { scale, classification, clamped };
}

// =============================================================================
// CONTRAST + CLAMPING
// =============================================================================

/** WCAG relative luminance from sRGB (0..1 channels). */
function luminance(rgb: RGB): number {
  const lin = (c: number) => srgbToLinear(c);
  return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
}

export function getContrast(hex1: string, hex2: string): number {
  const l1 = luminance(hexToRgb(hex1));
  const l2 = luminance(hexToRgb(hex2));
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
}

/**
 * Adjust step 700 (= --text-accent) so it contrasts ≥4.5:1 against
 * --surface-page (= step 0 of neutral scale, but we approximate as white in
 * light mode, near-black in dark mode for the clamp pre-check; final correctness
 * is enforced by the consumer via semantic token combos).
 */
function applyContrastClamp(
  scale: Scale,
  clamped: Partial<Record<Step, { from: string; to: string }>>,
  mode: Mode,
  _classification: Classification
) {
  const pageBg = mode === 'light' ? '#FFFFFF' : '#0F0F0F';
  const target = 4.5;
  // Only clamp step 700 (--text-accent). Step 800 is --text-accent-strong and
  // should naturally be stronger than 700; if 700 passes, 800 inherits the safety.
  // After clamping 700, restore monotonic ordering by pushing 800..1400 as needed.
  const original = scale[700];
  let working = original;
  let safety = 30;
  while (getContrast(working, pageBg) < target && safety-- > 0) {
    const oklch = hexToOklch(working);
    const delta = mode === 'light' ? -0.02 : 0.02;
    oklch.l = Math.max(0.05, Math.min(0.95, oklch.l + delta));
    working = oklchToHex(oklch);
  }
  if (working !== original) {
    clamped[700] = { from: original, to: working };
    scale[700] = working;
    // Cascade: ensure 800..1400 stay monotonically further from page bg than 700.
    // In light mode, that means each subsequent step must be DARKER (lower L).
    // In dark mode, each subsequent step must be LIGHTER (higher L).
    const minLuminanceDelta = 0.018; // small but visible step
    let prevL = hexToOklch(scale[700]).l;
    const order: Step[] = [800, 900, 1000, 1100, 1200, 1300, 1400];
    for (const s of order) {
      const c = hexToOklch(scale[s]);
      const direction = mode === 'light' ? -1 : 1;
      const required = prevL + direction * minLuminanceDelta;
      const cmp = mode === 'light' ? c.l > required : c.l < required;
      if (cmp) {
        c.l = required;
        scale[s] = oklchToHex(c);
      }
      prevL = hexToOklch(scale[s]).l;
    }
  }
}

// =============================================================================
// SAMPLE OUTPUTS (for manual verification — see plan §1.10)
// =============================================================================
//
// Quick sanity checks. Run via:
//   npx ts-node design/system/core/design/colorEngine.ts
// or import and call in a smoke test.
//
// Expected behavior:
//  • Vibrant input (#9333EA / purple) → bold mid-tones, clear lightness gradient.
//  • Muted input (#A8A29E / dusty taupe) → softer mid-tones, less chroma swing.
//  • Near-neutral input (#0F172A / navy) → essentially a gray scale with a hint of blue.
//  • Inverse sentinel → pure neutral, no chroma anywhere.
//
// Light vs dark scales should NOT be inversions of each other — dark mode
// has slightly cooler hue and lower chroma at every step.

export function _smokeTest() {
  const inputs: { label: string; hex: string }[] = [
    { label: 'Vibrant (purple)', hex: '#9333EA' },
    { label: 'Muted (taupe)', hex: '#A8A29E' },
    { label: 'Near-neutral (navy)', hex: '#0F172A' },
    { label: 'Inverse sentinel', hex: 'inverse' },
  ];
  for (const { label, hex } of inputs) {
    for (const mode of ['light', 'dark'] as Mode[]) {
      const r = generateScale({ hex, mode, kind: 'accent' });
      console.log(`\n=== ${label} (${mode}) — classification: ${r.classification} ===`);
      for (const s of STEPS) console.log(`  ${s.toString().padStart(4)}: ${r.scale[s]}`);
      if (Object.keys(r.clamped).length) {
        console.log(`  clamped:`, r.clamped);
      }
    }
  }
}
