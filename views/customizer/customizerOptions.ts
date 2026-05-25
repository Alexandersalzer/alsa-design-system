// Static option arrays + token<->index maps for the design customizer.
// Kept declarative so DesignCustomizer.tsx stays a thin view layer.

import type { SliderStepMark } from '../../design/index';
import type { RadiusToken, LayoutToken, SpacingToken, TypographyScaleToken } from './applyToRoot';

export interface OptionItem {
  value: string;
  label: string;
}

// ----- Radius (slider 0..5) -----

export const RADIUS_ORDER: RadiusToken[] = ['none', 'sm', 'md', 'lg', 'xl', 'full'];

export const RADIUS_MARKS: SliderStepMark[] = [
  { value: 0, label: 'None' },
  { value: 1, label: 'SM' },
  { value: 2, label: 'MD' },
  { value: 3, label: 'LG' },
  { value: 4, label: 'XL' },
  { value: 5, label: 'Full' },
];

export const radiusToIndex = (r: RadiusToken): number =>
  Math.max(0, RADIUS_ORDER.indexOf(r));

export const indexToRadius = (i: number): RadiusToken =>
  RADIUS_ORDER[Math.max(0, Math.min(RADIUS_ORDER.length - 1, Math.round(i)))];

// ----- Spacing / layout / typography (segmented controls) -----

export const SPACING_OPTIONS: OptionItem[] = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
];

export const LAYOUT_OPTIONS: OptionItem[] = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
];

export const TYPOGRAPHY_SCALE_OPTIONS: OptionItem[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'XL' },
];

// Narrowing helpers so onChange handlers stay typed without casts at call sites.
export const asSpacing = (v: string): SpacingToken => v as SpacingToken;
export const asLayout = (v: string): LayoutToken => v as LayoutToken;
export const asTypographyScale = (v: string): TypographyScaleToken =>
  v as TypographyScaleToken;

// ----- Fonts (Picker, searchable) -----

export const FONT_OPTIONS: OptionItem[] = [
  // Sans — modern & clean
  { value: 'Inter', label: 'Inter' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'Sora', label: 'Sora' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Manrope', label: 'Manrope' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Work Sans', label: 'Work Sans' },
  { value: 'Public Sans', label: 'Public Sans' },
  { value: 'Lexend', label: 'Lexend' },
  { value: 'Urbanist', label: 'Urbanist' },
  // Geometric & rounded
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Quicksand', label: 'Quicksand' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Rubik', label: 'Rubik' },
  { value: 'Jost', label: 'Jost' },
  // Display & expressive
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Fraunces', label: 'Fraunces' },
  // Tech & startup
  { value: 'IBM Plex Sans', label: 'IBM Plex Sans' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Source Sans 3', label: 'Source Sans 3' },
  { value: 'Noto Sans', label: 'Noto Sans' },
];

// ----- Font weight (Picker, numeric 100-900) -----

export const FONT_WEIGHT_OPTIONS: OptionItem[] = [
  { value: '100', label: 'Thin (100)' },
  { value: '200', label: 'Extra Light (200)' },
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semibold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extra Bold (800)' },
  { value: '900', label: 'Black (900)' },
];

// ----- Theme mode (SelectionCards) -----

export type ThemeModeValue = 'light' | 'dark' | 'system';

export const THEME_MODE_CARDS: { value: ThemeModeValue; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

// ----- Modal sidebar sections -----

export type CustomizerSection = 'theme' | 'typography' | 'spacing';

export const SECTION_NAV: { id: CustomizerSection; label: string }[] = [
  { id: 'theme', label: 'Theme' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing & Layout' },
];
