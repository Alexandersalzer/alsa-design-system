// ===============================================
// FIXED ColorPicker.tsx - Uses radio pattern instead of button
// ===============================================

import React from 'react';
import { SelectionCard } from './SelectionCard';
import { Grid } from '../page/Grid';
import { Label, Body } from '../../../primitives/Typography';
import { cn } from '../../../../lib/utils';

export interface ColorOption {
  name: string;
  value: string;
  description?: string;
  hexValue?: string; // Add this for display
}

export interface ColorPickerProps {
  colors: ColorOption[];
  selected: string;
  onChange: (color: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'swatches' | 'cards';
  className?: string;
  name?: string; // For radio group
}

// Fallback color mapping for tokens without hexValue
const COLOR_TOKEN_MAP: Record<string, string> = {
  ruby: '#E11D48',
  purple: '#8B5CF6', 
  azure: '#3B82F6',
  emerald: '#10B981',
  honey: '#F59E0B',
  gray: '#6B7280',
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selected,
  onChange,
  size = 'md',
  variant = 'cards',
  className,
  name = 'color-picker'
}) => {
  const handleColorChange = (checked: boolean, colorValue: string) => {
    if (checked) {
      console.log('🎨 ColorPicker: Color selected:', colorValue);
      onChange(colorValue);
    }
  };

  // Helper function to get actual hex color for display
  const getDisplayColor = (color: ColorOption): string => {
    // First try hexValue if provided
    if (color.hexValue) {
      return color.hexValue;
    }
    
    // If value is already a hex color, use it
    if (color.value.startsWith('#')) {
      return color.value;
    }
    
    // Otherwise, map token to hex
    const mappedColor = COLOR_TOKEN_MAP[color.value];
    if (mappedColor) {
      return mappedColor;
    }
    
    // Fallback - try to use CSS custom property
    if (typeof window !== 'undefined') {
      const root = getComputedStyle(document.documentElement);
      const cssVar = root.getPropertyValue(`--foundation-${color.value}-500`).trim();
      if (cssVar) {
        return cssVar;
      }
    }
    
    // Final fallback
    console.warn(`🎨 ColorPicker: No display color found for ${color.value}`);
    return '#cccccc';
  };

  if (variant === 'swatches') {
    return (
      <div className={cn('flex flex-wrap gap-3', className)}>
        {colors.map((color) => {
          const isSelected = selected === color.value;
          const displayColor = getDisplayColor(color);
          
          return (
            <button
              key={color.value}
              className={cn(
                'w-10 h-10 rounded-full border-3 transition-all duration-200',
                isSelected 
                  ? 'border-gray-900 scale-110 shadow-lg' 
                  : 'border-gray-300 hover:scale-105'
              )}
              onClick={() => onChange(color.value)}
              style={{ backgroundColor: displayColor }}
              title={`${color.name} (${displayColor})`}
            />
          );
        })}
      </div>
    );
  }

  return (
    <Grid columns={3} gap="md" className={cn('grid-cols-2 md:grid-cols-3', className)}>
      {colors.map((color) => {
        const isSelected = selected === color.value;
        const displayColor = getDisplayColor(color);
        
        return (
          <SelectionCard
            key={color.value}
            type="radio"
            name={name}
            value={color.value}
            checked={isSelected}
            onChange={(checked) => handleColorChange(checked, color.value)}
            size={size}
            controlPosition="right"
          >
            <div className="text-center">
              <div 
                className="w-full h-12 rounded-md mb-3 border border-gray-200"
                style={{ backgroundColor: displayColor }}
                title={`${color.name} - ${displayColor}`}
              />
              <Label size="sm" weight="medium">{color.name}</Label>
            </div>
          </SelectionCard>
        );
      })}
    </Grid>
  );
};