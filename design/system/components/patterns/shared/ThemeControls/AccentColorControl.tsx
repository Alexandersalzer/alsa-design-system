// ===============================================
// AccentColorControl.tsx - Using REAL ColorPicker component
// ===============================================
import React from 'react';
import { ColorPicker, type ColorOption } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

const COLOR_OPTIONS: ColorOption[] = [
  { name: 'Ruby', value: '#EF4444' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Azure', value: '#3B82F6' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Honey', value: '#F59E0B' },
  { name: 'Slate', value: '#6B7280' },
];

// Map hex colors to token names
const HEX_TO_TOKEN: Record<string, ColorScale> = {
  '#EF4444': 'ruby',
  '#A855F7': 'purple',
  '#3B82F6': 'azure',
  '#10B981': 'emerald',
  '#F59E0B': 'honey',
  '#6B7280': 'gray',
};

// Map token names to hex colors
const TOKEN_TO_HEX: Record<ColorScale, string> = {
  'ruby': '#EF4444',
  'purple': '#A855F7',
  'azure': '#3B82F6',
  'emerald': '#10B981',
  'honey': '#F59E0B',
  'gray': '#6B7280',
};

interface AccentColorControlProps {
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function AccentColorControl({ columns = 3, className }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();

  const handleColorChange = (hexColor: string) => {
    const tokenName = HEX_TO_TOKEN[hexColor];
    if (tokenName) {
      setAccentColor(tokenName);
    }
  };

  const currentHexColor = TOKEN_TO_HEX[accentColor] || TOKEN_TO_HEX['ruby'];

  return (
    <div className={className}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <Icon size="md" color="primary">
          <SwatchIcon />
        </Icon>
        <div>
          <Body weight="medium" className="mb-1">Brand Color</Body>
          <Body size="sm" color="secondary">Your primary accent color</Body>
        </div>
      </div>

      {/* Color picker */}
      <ColorPicker
        colors={COLOR_OPTIONS}
        selected={currentHexColor}
        onChange={handleColorChange}
        variant="cards"
        size="md"
      />
    </div>
  );
}
