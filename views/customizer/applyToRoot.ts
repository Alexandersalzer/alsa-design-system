/**
 * Mirror of snippet.tsx's color-emission logic, but client-side.
 *
 * IMPORTANT: writes generated scales into a single <style> tag (not :root.style),
 * because inline styles override [data-theme="dark"] selectors and would freeze
 * the page in light mode forever once the customizer touches it. The stylesheet
 * approach lets [data-theme] scoping behave correctly.
 *
 * design.json compatibility: the JSON snippet output uses the exact shape the
 * existing pipeline reads — `accent: { hex }`, `themeTone: { hex }`,
 * `baseColorIntensity`, `themeMode`. Pasting it under `globalStyles` in
 * public/design/design.json is the persistence path.
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

export interface CustomizerState {
  accentHex: string;     // e.g. '#FFA366' or 'inverse'
  toneHex: string;       // e.g. '#0F172A'
  baseColorIntensity: number; // 0..1
  themeMode: 'light' | 'dark' | 'system';
}

function emitScale(prefix: string, scale: Scale): string {
  return STEPS.map((s) => `--foundation-${prefix}-${s}: ${scale[s]};`).join('\n  ');
}

/** Build the full override stylesheet (light + dark scopes). */
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
  writeThemeMode(state.themeMode);
}

/** Strip all customizer overrides — back to whatever snippet.tsx originally emitted. */
export function clearCustomizerOverrides() {
  const tag = document.getElementById(STYLE_TAG_ID);
  if (tag) tag.remove();
}

/** Build the JSON snippet to paste into design.json's globalStyles. */
export function buildJsonSnippet(state: CustomizerState): string {
  const out = {
    accent: state.accentHex === 'inverse' ? 'inverse' : { hex: state.accentHex },
    themeTone: { hex: state.toneHex },
    baseColorIntensity: state.baseColorIntensity,
    themeMode: state.themeMode,
  };
  return JSON.stringify(out, null, 2);
}
