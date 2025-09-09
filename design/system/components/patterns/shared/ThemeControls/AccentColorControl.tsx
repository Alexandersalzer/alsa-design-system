// ===============================================
// AccentColorControl.tsx - Compact 6x5 Grid Version
// Color dots only, no labels, much shorter height
// ===============================================
import React from 'react';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

// Compact color structure: 30 colors in 6x5 grid
const COLOR_GRID = [
  // Row 1 - Grays
  [
    { value: 'gray-light', hex: '#9CA3AF' },
    { value: 'gray', hex: '#6B7280' },
    { value: 'gray-dark', hex: '#374151' },
    { value: 'slate', hex: '#64748B' },
    { value: 'charcoal', hex: '#1F2937' }
  ],
  // Row 2 - Reds
  [
    { value: 'red-light', hex: '#FCA5A5' },
    { value: 'red', hex: '#EF4444' },
    { value: 'red-dark', hex: '#DC2626' },
    { value: 'crimson', hex: '#DC143C' },
    { value: 'ruby', hex: '#E11D48' }
  ],
  // Row 3 - Oranges
  [
    { value: 'orange-light', hex: '#FB923C' },
    { value: 'orange', hex: '#F97316' },
    { value: 'orange-dark', hex: '#EA580C' },
    { value: 'amber', hex: '#F59E0B' },
    { value: 'tangerine', hex: '#FF8C00' }
  ],
  // Row 4 - Yellows
  [
    { value: 'yellow-light', hex: '#FDE047' },
    { value: 'yellow', hex: '#F59E0B' },
    { value: 'yellow-dark', hex: '#D97706' },
    { value: 'honey', hex: '#FBBF24' },
    { value: 'gold', hex: '#FFD700' }
  ],
  // Row 5 - Greens
  [
    { value: 'green-light', hex: '#4ADE80' },
    { value: 'green', hex: '#10B981' },
    { value: 'green-dark', hex: '#059669' },
    { value: 'emerald', hex: '#10B981' },
    { value: 'forest', hex: '#047857' }
  ],
  // Row 6 - Blues & Purples
  [
    { value: 'blue-light', hex: '#60A5FA' },
    { value: 'blue', hex: '#3B82F6' },
    { value: 'indigo', hex: '#6366F1' },
    { value: 'purple', hex: '#A855F7' },
    { value: 'pink', hex: '#F43F5E' }
  ]
];

// Flatten the grid for easier searching
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
      <div className="flex items-center gap-3 mb-4">
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

      {/* Compact 6x5 Color Grid */}
      <div className="flex flex-col" style={{ gap: '4px' }}>
        {COLOR_GRID.map((colorRow, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5" style={{ gap: '4px' }}>
            {colorRow.map((color) => (
              <button
                key={color.value}
                className={`
                  relative w-8 h-8 rounded-md border-2 transition-all duration-200 hover:scale-110
                  ${accentColor === color.value 
                    ? 'border-gray-900 shadow-lg scale-110' 
                    : 'border-gray-200 hover:border-gray-400'
                  }
                `}
                style={{ backgroundColor: color.hex }}
                onClick={() => handleColorChange(color.value)}
                title={color.value}
                aria-label={`Select ${color.value} color`}
              >
                {accentColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg 
                      className="w-4 h-4 text-white drop-shadow-sm" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Selected color display */}
      {accentColor && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div 
              className="w-6 h-6 rounded border border-gray-300 shadow-sm"
              style={{ 
                backgroundColor: ALL_COLORS.find(c => c.value === accentColor)?.hex 
              }}
            />
            <div>
              <Body size="sm" weight="medium" className="text-gray-900">
                Vald färg: {accentColor}
              </Body>
              <Body size="xs" color="secondary" className="font-mono">
                {ALL_COLORS.find(c => c.value === accentColor)?.hex}
              </Body>
            </div>
          </div>
        </div>
      )}

      {/* Hidden radio inputs for accessibility */}
      <div className="sr-only">
        {ALL_COLORS.map((color) => (
          <input
            key={color.value}
            type="radio"
            name="accent-color"
            value={color.value}
            checked={accentColor === color.value}
            onChange={() => handleColorChange(color.value)}
            aria-label={`Select ${color.value} color`}
          />
        ))}
      </div>
    </div>
  );
}