// ===============================================
// File 1: @blimpify-im/ui/src/components/primitives/BrandColorPicker/BrandColorPicker.tsx
// ===============================================

import React from 'react';
import { Label, Body } from '../Typography';
import { cn } from '../../../lib/utils';

export interface BrandColorOption {
  name: string;
  value: string;
  description?: string;
  primary: string;    // Main color (500 level)
  light: string;      // Light variant (100 level)  
  dark: string;       // Dark variant (700 level)
}

export interface BrandColorPickerProps {
  /** Available color options */
  colors: BrandColorOption[];
  /** Currently selected color value */
  selected: string;
  /** Change handler */
  onChange: (colorValue: string) => void;
  /** Size of color swatches */
  size?: 'sm' | 'md' | 'lg';
  /** Show color names */
  showNames?: boolean;
  /** Show descriptions */
  showDescriptions?: boolean;
  /** Custom className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

export const BrandColorPicker: React.FC<BrandColorPickerProps> = ({
  colors,
  selected,
  onChange,
  size = 'md',
  showNames = true,
  showDescriptions = false,
  className,
  disabled = false
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  };

  const handleColorSelect = (colorValue: string) => {
    if (!disabled) {
      onChange(colorValue);
    }
  };

  return (
    <div className={cn('brand-color-picker', className)}>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {colors.map((color) => {
          const isSelected = selected === color.value;
          
          return (
            <div key={color.value} className="flex flex-col items-center space-y-2">
              {/* Color Swatch Button */}
              <button
                onClick={() => handleColorSelect(color.value)}
                disabled={disabled}
                className={cn(
                  'relative rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 group',
                  sizeClasses[size],
                  isSelected 
                    ? 'ring-2 ring-gray-900 ring-offset-2 scale-110 shadow-lg' 
                    : 'hover:scale-105 hover:shadow-md',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                style={{
                  background: `linear-gradient(135deg, ${color.light} 0%, ${color.primary} 50%, ${color.dark} 100%)`,
                  boxShadow: isSelected 
                    ? `0 8px 32px ${color.primary}40` 
                    : `0 2px 8px ${color.primary}20`
                }}
                aria-label={`Select ${color.name} color`}
                title={color.description || color.name}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path 
                          d="M13.5 4.5L6 12L2.5 8.5" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="text-gray-900"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              </button>

              {/* Color Name */}
              {showNames && (
                <Label 
                  size="sm" 
                  weight="medium" 
                  color={isSelected ? 'primary' : 'secondary'}
                  className="text-center leading-tight"
                >
                  {color.name}
                </Label>
              )}

              {/* Color Description */}
              {showDescriptions && color.description && (
                <Body size="xs" color="tertiary" className="text-center">
                  {color.description}
                </Body>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Color Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <Label size="sm" weight="medium" color="primary">
              Selected: {colors.find(c => c.value === selected)?.name || 'None'}
            </Label>
            {showDescriptions && (
              <Body size="sm" color="secondary" className="mt-1">
                {colors.find(c => c.value === selected)?.description}
              </Body>
            )}
          </div>
          
          {/* Color Preview */}
          <div 
            className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm"
            style={{ 
              backgroundColor: colors.find(c => c.value === selected)?.primary 
            }}
          />
        </div>
      </div>
    </div>
  );
};