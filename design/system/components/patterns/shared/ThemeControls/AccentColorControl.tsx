// ===============================================
// AccentColorControl.tsx - Simplified Single Grid (Svenska)
// 3x10 grid with 3 variants per color
// ===============================================
import React from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

// Simplified color structure: 10 colors, 3 variants each
const COLOR_GRID = [
  // Gray row
  [
    { value: 'gray-light', label: 'Ljusgrå', hex: '#9CA3AF' },
    { value: 'gray', label: 'Grå', hex: '#6B7280' },
    { value: 'gray-dark', label: 'Mörkgrå', hex: '#374151' }
  ],
  // Red row
  [
    { value: 'red-light', label: 'Ljusröd', hex: '#FCA5A5' },
    { value: 'red', label: 'Röd', hex: '#EF4444' },
    { value: 'red-dark', label: 'Mörkröd', hex: '#DC2626' }
  ],
  // Orange row
  [
    { value: 'orange-light', label: 'Ljusorange', hex: '#FB923C' },
    { value: 'orange', label: 'Orange', hex: '#F97316' },
    { value: 'orange-dark', label: 'Mörkorange', hex: '#EA580C' }
  ],
  // Yellow row
  [
    { value: 'yellow-light', label: 'Ljusgul', hex: '#FDE047' },
    { value: 'yellow', label: 'Gul', hex: '#F59E0B' },
    { value: 'yellow-dark', label: 'Mörkgul', hex: '#D97706' }
  ],
  // Green row
  [
    { value: 'green-light', label: 'Ljusgrön', hex: '#4ADE80' },
    { value: 'green', label: 'Grön', hex: '#10B981' },
    { value: 'green-dark', label: 'Mörkgrön', hex: '#059669' }
  ],
  // Teal row
  [
    { value: 'teal-light', label: 'Ljus Teal', hex: '#5EEAD4' },
    { value: 'teal', label: 'Teal', hex: '#14B8A6' },
    { value: 'teal-dark', label: 'Mörk Teal', hex: '#0F766E' }
  ],
  // Blue row
  [
    { value: 'blue-light', label: 'Ljusblå', hex: '#60A5FA' },
    { value: 'blue', label: 'Blå', hex: '#3B82F6' },
    { value: 'blue-dark', label: 'Mörkblå', hex: '#1D4ED8' }
  ],
  // Indigo row
  [
    { value: 'indigo-light', label: 'Ljus Indigo', hex: '#A5B4FC' },
    { value: 'indigo', label: 'Indigo', hex: '#6366F1' },
    { value: 'indigo-dark', label: 'Mörk Indigo', hex: '#4338CA' }
  ],
  // Purple row
  [
    { value: 'purple-light', label: 'Ljuslila', hex: '#C084FC' },
    { value: 'purple', label: 'Lila', hex: '#A855F7' },
    { value: 'purple-dark', label: 'Mörklila', hex: '#7C3AED' }
  ],
  // Pink row
  [
    { value: 'pink-light', label: 'Ljusrosa', hex: '#F9A8D4' },
    { value: 'pink', label: 'Rosa', hex: '#F43F5E' },
    { value: 'pink-dark', label: 'Mörkrosa', hex: '#E11D48' }
  ]
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
            Välj din primära accentfärg från paletten nedan
          </Body>
        </div>
      </div>

      {/* Single 3x10 Grid */}
      <div className="flex flex-col" style={{ gap: '6px' }}>
        {COLOR_GRID.map((colorRow, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3" style={{ gap: '6px' }}>
            {colorRow.map((color) => (
              <DesignRadioCardItem
                key={color.value}
                value={color.value}
                label={color.label}
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

      {/* Selected color display */}
      {accentColor && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg border border-gray-300 shadow-sm"
              style={{ 
                backgroundColor: ALL_COLORS.find(c => c.value === accentColor)?.hex 
              }}
            />
            <div>
              <Body size="sm" weight="medium" className="text-gray-900">
                Vald färg: {ALL_COLORS.find(c => c.value === accentColor)?.label}
              </Body>
              <Body size="xs" color="secondary" className="font-mono">
                {ALL_COLORS.find(c => c.value === accentColor)?.hex}
              </Body>
            </div>
          </div>
        </div>
      )}

      {/* Wrap in radio group for proper form behavior */}
      <div className="sr-only">
        <DesignRadioCard.Root
          name="accent-color-hidden"
          value={accentColor || ''}
          onChange={handleColorChange}
        >
          {/* Hidden radio inputs for accessibility */}
          {ALL_COLORS.map((color) => (
            <input
              key={color.value}
              type="radio"
              name="accent-color-hidden"
              value={color.value}
              checked={accentColor === color.value}
              onChange={() => handleColorChange(color.value)}
              className="sr-only"
            />
          ))}
        </DesignRadioCard.Root>
      </div>
    </div>
  );
}