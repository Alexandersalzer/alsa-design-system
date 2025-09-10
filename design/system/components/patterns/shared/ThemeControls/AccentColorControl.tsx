// ===============================================
// AccentColorControl.tsx - Kortare namn för bättre UX
// 3x10 grid med kortare, beskrivande namn
// ===============================================
import React from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

// Förkortade namn - behåller samma values för backend-kompatibilitet
const COLOR_GRID = [
  // Gray row
  [
    { value: 'gray-light', label: 'Ljus', hex: '#9CA3AF' },
    { value: 'gray', label: 'grå', hex: '#6B7280' },
    { value: 'slate', label: 'Mörk', hex: '#374151' }
  ],
  // Pink row
  [
    { value: 'pink-light', label: 'Ljus', hex: '#F9A8D4' },
    { value: 'pink', label: 'Rosa', hex: '#F43F5E' },
    { value: 'pink-dark', label: 'Ros', hex: '#E11D48' }
  ],
  // Red row
  [
    { value: 'red-light', label: 'Bär', hex: '#FCA5A5' },
    { value: 'red', label: 'Röd', hex: '#ef2a2aff' },
    { value: 'red-dark', label: 'Vinröd', hex: '#DC2626' }
  ],
  // Orange row
  [
    { value: 'orange-light', label: 'Persika', hex: '#FB923C' },
    { value: 'orange', label: 'Orange', hex: '#F97316' },
    { value: 'tangerine', label: 'Mandarin', hex: '#EA580C' }
  ],
  // Yellow row
  [
    { value: 'yellow-light', label: 'Citron', hex: '#FDE047' },
    { value: 'yellow', label: 'Gul', hex: '#F59E0B' },
    { value: 'yellow-dark', label: 'Guld', hex: '#D97706' }
  ],
  // Green row
  [
    { value: 'green-light', label: 'Mint', hex: '#4ADE80' },
    { value: 'green', label: 'Grön', hex: '#10B981' },
    { value: 'green-dark', label: 'Skog', hex: '#059669' }
  ],
  // Teal row
  [
    { value: 'teal-light', label: 'Aqua', hex: '#5EEAD4' },
    { value: 'teal', label: 'Teal', hex: '#14B8A6' },
    { value: 'teal-dark', label: 'Jade', hex: '#0F766E' }
  ],
  // Blue row
  [
    { value: 'blue-light', label: 'Himmel', hex: '#60A5FA' },
    { value: 'blue', label: 'Blå', hex: '#3B82F6' },
    { value: 'blue-dark', label: 'Marin', hex: '#1D4ED8' }
  ],
  // Indigo row
  [
    { value: 'indigo-light', label: 'Moln', hex: '#A5B4FC' },
    { value: 'indigo', label: 'Indigo', hex: '#6366F1' },
    { value: 'indigo-dark', label: 'Natt', hex: '#4338CA' }
  ],
  // Purple row
  [
    { value: 'purple-light', label: 'Orchid', hex: '#C084FC' },
    { value: 'purple', label: 'Lila', hex: '#A855F7' },
    { value: 'purple-dark', label: 'Violett', hex: '#7C3AED' }
  ],
];

// Flatten the grid for the radio group
const ALL_COLORS = COLOR_GRID.flat();

interface AccentColorControlProps {
  className?: string;
}

export function AccentColorControl({ className }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();

  // Handle color change
  const handleColorChange = (colorValue: string) => {
    console.log('🎨 AccentColorControl: Ändrar färg till:', colorValue);
    setAccentColor(colorValue as ColorScale);
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Icon size="md" color="primary">
          <SwatchIcon />
        </Icon>
        <div>
          <Body weight="medium" className="mb-1">
            Varumärkesfärg
          </Body>
          <Body size="sm" color="secondary">
            Välj din primära accentfärg
          </Body>
        </div>
      </div>

      {/* Single 3x10 Grid med kortare namn */}
      <div className="flex flex-col" style={{ gap: '6px' }}>
        {COLOR_GRID.map((colorRow, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3" style={{ gap: '6px' }}>
            {colorRow.map((color) => (
              <DesignRadioCardItem
                key={color.value}
                value={color.value}
                label={color.label} // Nu kortare namn som "Ljus", "Medium", "Mörk" etc
                variant="color"
                colorValue={color.hex}
                checked={accentColor === color.value}
                onClick={() => handleColorChange(color.value)}
                className="aspect-square hover:scale-105 transition-transform"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}