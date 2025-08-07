// ===============================================
// src/design-system/components/patterns/selection/VisualChoiceGroup.tsx
// Reusable visual selection component - similar to Chakra's approach
// ===============================================

import React from 'react';
import { SelectionCard } from './SelectionCard';
import { Grid } from '../page/Grid';
import { Stack } from '../page/Stack';
import { Label, Body } from '../../../primitives/Typography';
import { cn } from '../../../../lib/utils';

export interface VisualChoiceOption {
  value: string;
  label: string;
  description?: string;
  preview?: React.ReactNode; // Custom visual preview
  disabled?: boolean;
}

export interface VisualChoiceGroupProps {
  /** Available options */
  options: VisualChoiceOption[];
  /** Current selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Group label */
  label?: string;
  /** Group description */
  description?: string;
  /** Number of columns in grid */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** Size of selection cards */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
  /** Error message */
  error?: string;
  /** Preview height for consistent sizing */
  previewHeight?: string;
}

export const VisualChoiceGroup: React.FC<VisualChoiceGroupProps> = ({
  options,
  value,
  onChange,
  label,
  description,
  columns = 4,
  size = 'md',
  className,
  error,
  previewHeight = '3rem' // 48px default
}) => {
  const handleChange = (optionValue: string) => {
    console.log('🎯 VisualChoiceGroup: Option selected:', optionValue);
    onChange(optionValue);
  };

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  }[columns];

  return (
    <div className={cn('visual-choice-group', className)}>
      {/* Header */}
      {label && (
        <Stack spacing="xs" className="mb-4">
          <Label size="md" weight="semibold" color="primary">
            {label}
          </Label>
          {description && (
            <Body size="sm" color="secondary">
              {description}
            </Body>
          )}
        </Stack>
      )}

      {/* Options Grid */}
      <Grid 
        columns={columns} 
        gap="sm" 
        className={gridClass}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const isDisabled = option.disabled;
          
          return (
            <SelectionCard
              key={option.value}
              selected={isSelected}
              disabled={isDisabled}
              onClick={() => !isDisabled && handleChange(option.value)}
              size={size}
            >
              <div className="text-center">
                {/* Visual Preview Area */}
                {option.preview && (
                  <div 
                    className="w-full mb-3 flex items-center justify-center"
                    style={{ height: previewHeight }}
                  >
                    {option.preview}
                  </div>
                )}
                
                {/* Label */}
                <Label 
                  size="sm" 
                  weight="medium" 
                  color={isDisabled ? 'disabled' : 'primary'}
                >
                  {option.label}
                </Label>
                
                {/* Optional description for detailed cards */}
                {option.description && size === 'lg' && (
                  <Body 
                    size="xs" 
                    color={isDisabled ? 'disabled' : 'secondary'} 
                    className="mt-1"
                  >
                    {option.description}
                  </Body>
                )}
              </div>
            </SelectionCard>
          );
        })}
      </Grid>

      {/* Error Message */}
      {error && (
        <Body size="sm" color="error" className="mt-2">
          {error}
        </Body>
      )}
    </div>
  );
};

// ===============================================
// Helper functions for common visual previews
// ===============================================

export const createColorPreview = (color: string, hexValue?: string) => {
  const displayColor = hexValue || color;
  return (
    <div 
      className="w-full h-8 rounded border border-gray-200"
      style={{ backgroundColor: displayColor }}
      title={`Color: ${displayColor}`}
    />
  );
};

export const createRadiusPreview = (radiusKey: string) => {
  const radiusMap: Record<string, string> = {
    'none': '0px', 'xs': '2px', 'sm': '4px', 'md': '8px',
    'lg': '12px', 'xl': '16px', '2xl': '24px', 'full': '50px'
  };
  const radiusValue = radiusMap[radiusKey] || '8px';
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className="w-8 h-6 bg-gray-300 border border-gray-400"
        style={{ borderRadius: radiusValue }}
      />
      <div className="flex gap-1">
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            className="w-1.5 h-1.5 bg-gray-400"
            style={{ borderRadius: radiusValue }}
          />
        ))}
      </div>
    </div>
  );
};

export const createFontPreview = (fontFamily: string, sampleText = 'Aa') => {
  return (
    <div 
      className="text-2xl font-medium text-gray-700"
      style={{ fontFamily }}
    >
      {sampleText}
    </div>
  );
};

export const createIconPreview = (icon: React.ReactNode, bgColor = 'bg-gray-100') => {
  return (
    <div className={`w-8 h-8 rounded flex items-center justify-center ${bgColor}`}>
      {icon}
    </div>
  );
};

// ===============================================
// Usage Examples for LiveDesignPanel
// ===============================================

/*
// For colors:
<VisualChoiceGroup
  label="Brand Color"
  description="Your primary brand color"
  options={BRAND_COLORS.map(color => ({
    value: color.value,
    label: color.name,
    preview: createColorPreview(color.value, color.hexValue)
  }))}
  value={choices.accentColor}
  onChange={(color) => handleChoiceChange('accentColor', color)}
  columns={3}
  size="md"
/>

// For radius:
<VisualChoiceGroup
  label="Corner Style"
  description="How rounded should elements be?"
  options={RADIUS_SCALES.map(radius => ({
    value: radius.value,
    label: radius.label,
    preview: createRadiusPreview(radius.value),
    description: radius.description
  }))}
  value={choices.radiusScale}
  onChange={(radius) => handleChoiceChange('radiusScale', radius)}
  columns={4}
  size="sm"
/>

// For fonts:
<VisualChoiceGroup
  label="Typography"
  description="Your font personality"
  options={FONT_OPTIONS.map(font => ({
    value: font.value,
    label: font.label,
    preview: createFontPreview(font.fontFamily),
    description: font.description
  }))}
  value={choices.fontFamily}
  onChange={(font) => handleChoiceChange('fontFamily', font)}
  columns={3}
  size="lg"
/>
*/