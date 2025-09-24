// ===============================================
// AccentColorControl.tsx - Accent color selector component
// ===============================================
import React from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';
import { ThemeManager } from '../../../../utils/themeManager';

export interface ColorOption {
  value: string;
  label: string;
  hex: string;
}

export type ColorGrid = ColorOption[][];

interface AccentColorControlProps {
  className?: string;
  colors: ColorGrid;
  onChange?: (colorValue: string, hexColor: string) => void;
}

export function AccentColorControl({ className, colors, onChange }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();

  // Handle color change
  const handleColorChange = (colorValue: string, hexColor: string) => {
    console.log('🎨 AccentColorControl: Ändrar färg till:', colorValue, 'hex:', hexColor);
    
    // Use the new hex-based method for color-mix generation
    const themeManager = ThemeManager.getInstance();
    themeManager.setAccentColorFromHex(hexColor);
    
    // Still update the theme hook for consistency
    setAccentColor(colorValue as ColorScale);
    
    // Call the onChange callback if provided
    onChange?.(colorValue, hexColor);
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
                onClick={() => handleColorChange(color.value, color.hex)}
                className="aspect-square hover:scale-105 transition-transform"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}