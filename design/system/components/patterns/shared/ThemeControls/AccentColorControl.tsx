// ===============================================
// AccentColorControl.tsx - REVERTED to working SelectionCard version
// ===============================================
import React from 'react';
import { SelectionCard, Grid } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { Body, Icon, Label } from '@blimpify-im/ui';

// Clean color options - just names and hex values
const COLOR_OPTIONS = [
  { value: 'ruby', label: 'Ruby', hex: '#EF4444' },
  { value: 'purple', label: 'Purple', hex: '#A855F7' },
  { value: 'azure', label: 'Azure', hex: '#3B82F6' },
  { value: 'emerald', label: 'Emerald', hex: '#10B981' },
  { value: 'honey', label: 'Honey', hex: '#F59E0B' },
  { value: 'gray', label: 'Slate', hex: '#6B7280' },
];

interface AccentColorControlProps {
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function AccentColorControl({ columns = 3, className }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();

  const handleColorChange = (checked: boolean, colorValue: string) => {
    if (checked) {
      setAccentColor(colorValue as ColorScale);
    }
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

      {/* Color grid with visual previews */}
      <Grid columns={columns} gap="md" className="grid-cols-2 md:grid-cols-3">
        {COLOR_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            type="radio"
            name="accent-color"
            value={option.value}
            checked={accentColor === option.value}
            onChange={(checked) => handleColorChange(checked, option.value)}
            size="md"
            controlPosition="right"
          >
            <div className="text-center">
              <Label size="sm" weight="medium" className="mb-3 block">
                {option.label}
              </Label>
              
              {/* Large color preview rectangle */}
              <div className="flex justify-center mb-3">
                <div
                  className="w-16 h-10 rounded-md border border-gray-300 shadow-sm"
                  style={{ backgroundColor: option.hex }}
                />
              </div>
              
              {/* Mini UI elements preview using the color */}
              <div className="flex justify-center gap-1 mb-3">
                {/* Mini button */}
                <div
                  className="w-6 h-3 rounded-sm"
                  style={{ backgroundColor: option.hex }}
                />
                {/* Mini badge */}
                <div
                  className="w-4 h-3 rounded-full"
                  style={{ backgroundColor: option.hex }}
                />
                {/* Mini indicator */}
                <div
                  className="w-2 h-3 rounded-full"
                  style={{ backgroundColor: option.hex }}
                />
              </div>
              
              {/* Just the hex value */}
              <Body size="xs" color="secondary" className="font-mono">
                {option.hex}
              </Body>
            </div>
          </SelectionCard>
        ))}
      </Grid>
    </div>
  );
}
