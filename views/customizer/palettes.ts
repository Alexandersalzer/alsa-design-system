import type { PalettePreset } from '../../design/system/components/forms/ColorPicker';

/**
 * Curated quick-pick accent colors. Selected for variety across the OKLCH gamut
 * — mix of vibrant + muted, cool + warm, plus the inverse sentinel.
 */
export const ACCENT_PALETTE: PalettePreset[] = [
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Slate', hex: '#64748B' },
  { name: 'Stone', hex: '#78716C' },
];

/**
 * Curated quick-pick theme tones. These are the "darkest" hex of each tone —
 * the engine derives the gray scale from this anchor + intensity slider.
 */
export const TONE_PALETTE: PalettePreset[] = [
  { name: 'Pure', hex: '#000000' },
  { name: 'Slate', hex: '#0F172A' },
  { name: 'Navy', hex: '#0F172A' },
  { name: 'Aqua', hex: '#0A0E10' },
  { name: 'Ink', hex: '#0A0C10' },
  { name: 'Frost', hex: '#0A0E0F' },
  { name: 'Violet', hex: '#0D0A0F' },
  { name: 'Sage', hex: '#0B0F0B' },
  { name: 'Pearl', hex: '#0E0D0B' },
  { name: 'Linen', hex: '#0F0D0A' },
  { name: 'Ember', hex: '#100C0A' },
  { name: 'Charcoal', hex: '#0D0C0B' },
];
