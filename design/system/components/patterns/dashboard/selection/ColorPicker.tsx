

// ===============================================
// FIXED ColorPicker.tsx - Med debugging
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
}

export interface ColorPickerProps {
  colors: ColorOption[];
  selected: string;
  onChange: (color: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'swatches' | 'cards';
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selected,
  onChange,
  size = 'md',
  variant = 'cards',
  className
}) => {
  // DEBUG: Log props
  console.log('🎨 ColorPicker props:', { colors, selected, onChange });

  const handleColorChange = (colorValue: string) => {
    console.log('🎨 ColorPicker: Color clicked:', colorValue);
    console.log('🎨 ColorPicker: Current selected:', selected);
    onChange(colorValue);
  };

  if (variant === 'swatches') {
    return (
      <div className={cn('flex flex-wrap gap-3', className)}>
        {colors.map((color) => {
          const isSelected = selected === color.value;
          console.log(`🎨 Swatch ${color.name}: selected=${isSelected} (${selected} === ${color.value})`);
          
          return (
            <button
              key={color.value}
              className={cn(
                'w-10 h-10 rounded-full border-3 transition-all duration-200',
                isSelected 
                  ? 'border-gray-900 scale-110 shadow-lg' 
                  : 'border-gray-300 hover:scale-105'
              )}
              onClick={() => handleColorChange(color.value)}
              style={{ backgroundColor: color.value }}
              title={color.name}
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
        console.log(`🎨 Card ${color.name}: selected=${isSelected} (${selected} === ${color.value})`);
        
        return (
          <SelectionCard
            key={color.value}
            selected={isSelected}
            onClick={() => handleColorChange(color.value)}
            size={size}
          >
            <div className="text-center">
              <div 
                className="w-full h-12 rounded-md mb-3 border border-gray-200"
                style={{ backgroundColor: color.value }}
              />
              <Label size="sm" weight="medium">{color.name}</Label>
              {color.description && (
                <Body size="xs" color="secondary" className="mt-1">{color.description}</Body>
              )}
            </div>
          </SelectionCard>
        );
      })}
    </Grid>
  );
};
