// ===============================================
// AccentColorControl.tsx - Accent color selector component
// ===============================================
import React from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

export interface ColorOption {
  value: string;
  label: string;
  hex: string;
}

export type ColorGrid = ColorOption[][];

interface AccentColorControlProps {
  className?: string;
  colors: ColorGrid;
}

export function AccentColorControl({ className, colors }: AccentColorControlProps) {
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

      {/* Color Grid */}
      <div className="flex flex-col" style={{ gap: '6px' }}>
        {colors.map((colorRow, rowIndex) => (
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
    </div>
  );
}