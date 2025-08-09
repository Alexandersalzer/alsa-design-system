// ===============================================
// blimpify-ui/design/system/components/patterns/shared/ThemeControls/AccentColorControl.tsx
// CLEANED: Remove children={undefined}
// ===============================================

import React from 'react';
import { OptionGridSection, type OptionItem } from '../../dashboard/selection/OptionGrid';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon } from '@heroicons/react/24/outline';

const COLOR_OPTIONS: OptionItem[] = [
  { id: 'ruby', name: 'Ruby', value: 'ruby', hex: '#EF4444' },
  { id: 'purple', name: 'Purple', value: 'purple', hex: '#A855F7' },
  { id: 'azure', name: 'Azure', value: 'azure', hex: '#3B82F6' },
  { id: 'emerald', name: 'Emerald', value: 'emerald', hex: '#10B981' },
  { id: 'honey', name: 'Honey', value: 'honey', hex: '#F59E0B' },
  { id: 'gray', name: 'Slate', value: 'gray', hex: '#6B7280' },
];

interface AccentColorControlProps {
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function AccentColorControl({ columns = 3, className }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();

  return (
    <OptionGridSection
      title="Brand Color"
      description="Your primary accent color"
      icon={<SwatchIcon />}
      options={COLOR_OPTIONS}
      selected={accentColor}
      onChange={(value) => setAccentColor(value as ColorScale)}
      columns={columns}
      variant="colors"
      className={className}
    />
  );
}