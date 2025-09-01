// ===============================================
// AccentColorControl.tsx - UPDATED to use DesignRadioCard
// ===============================================
import React from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

// Clean color options - just names and hex values
const COLOR_OPTIONS = [
  { value: 'ruby', label: 'Ruby', hex: '#EF4444' },        // Röd ✓
  { value: 'rose', label: 'Rose', hex: '#F43F5E' },        // Rosa - NY
  { value: 'purple', label: 'Purple', hex: '#A855F7' },    // Lila ✓
  { value: 'azure', label: 'Azure', hex: '#3B82F6' },      // Blå ✓
  { value: 'cyan', label: 'Cyan', hex: '#06B6D4' },        // Cyan - NY
  { value: 'emerald', label: 'Emerald', hex: '#10B981' },  // Grön ✓
  { value: 'honey', label: 'Honey', hex: '#F59E0B' },      // Gul ✓
  { value: 'orange', label: 'Orange', hex: '#F97316' },    // Orange - NY
  { value: 'gray', label: 'Slate', hex: '#6B7280' },       // Grå ✓
  { value: 'indigo', label: 'Indigo', hex: '#6366F1' },    // Indigo - NY (optional)
];
interface AccentColorControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function AccentColorControl({ columns = 3, className }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();

  // ✅ Convert from DesignRadioCard's string onChange to theme system
  const handleColorChange = (colorValue: string) => {
    console.log('🎨 AccentColorControl: Changing color to:', colorValue);
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

      {/* ✅ Using DesignRadioCard with Root + Color items */}
      <DesignRadioCard.Root
        name="accent-color"
        value={accentColor || 'purple'}
        onChange={handleColorChange}
        columns={columns}
        gap="sm"
        size="sm"
      >
        {COLOR_OPTIONS.map((option) => (
        <DesignRadioCardItem
        key={option.value}
        value={option.value}
        label={option.label}
        variant="color"
        colorValue={option.hex}
        />
        ))}
      </DesignRadioCard.Root>
    </div>
  );
}
