// ===============================================
// AccentColorControl.tsx - UPDATED to use DesignRadioCard
// ===============================================
import React from 'react';
import { DesignRadioCard } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

// Clean color options - just names and hex values
const COLOR_OPTIONS = [
  { value: 'ruby', label: 'Ruby', hex: '#EF4444' },
  { value: 'purple', label: 'Purple', hex: '#A855F7' },
  { value: 'azure', label: 'Azure', hex: '#3B82F6' },
  { value: 'emerald', label: 'Emerald', hex: '#10B981' },
  { value: 'honey', label: 'Honey', hex: '#F59E0B' },
  { value: 'gray', label: 'Slate', hex: '#6B7280' },
];

interface AccentColorControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function AccentColorControl({ columns = 3, className }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();

  const handleColorChange = (colorValue: string) => {
    setAccentColor(colorValue as ColorScale);
  };

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

      {/* Color radio group */}
      <DesignRadioCard.Root
        name="accent-color"
        value={accentColor}
        onChange={handleColorChange}
        columns={columns}
        gap="sm"
        size="sm"
      >
        {COLOR_OPTIONS.map((option) => (
          <DesignRadioCard.Color
            key={option.value}
            value={option.value}
            label={option.label}
            colorValue={option.hex}
          />
        ))}
      </DesignRadioCard.Root>
    </div>
  );
}