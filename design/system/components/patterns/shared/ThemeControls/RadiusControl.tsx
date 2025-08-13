
// ===============================================
// RadiusControl.tsx - REVERTED to working SelectionCard version
// ===============================================
import React from 'react';
import { SelectionCard, Grid } from '@blimpify-im/ui';
import { useTheme, type RadiusScale } from '../../../../hooks/useTheme';
import { Square2StackIcon } from '@heroicons/react/24/outline';
import { Body, Icon, Label } from '@blimpify-im/ui';

const RADIUS_OPTIONS = [
  { value: 'none', label: 'Sharp', description: '0px', preview: '0px' },
  { value: 'xs', label: 'Minimal', description: '2px', preview: '2px' },
  { value: 'sm', label: 'Small', description: '4px', preview: '4px' },
  { value: 'md', label: 'Medium', description: '8px', preview: '8px' },
  { value: 'lg', label: 'Large', description: '12px', preview: '12px' },
  { value: 'xl', label: 'XL', description: '16px', preview: '16px' },
  { value: '2xl', label: 'Max', description: '24px', preview: '24px' },
];

interface RadiusControlProps {
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function RadiusControl({ columns = 4, className }: RadiusControlProps) {
  const { radiusScale, setRadiusScale } = useTheme();

  const handleRadiusChange = (checked: boolean, radiusValue: string) => {
    if (checked) {
      setRadiusScale(radiusValue as RadiusScale);
    }
  };

  return (
    <div className={className}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <Icon size="md" color="primary">
          <Square2StackIcon />
        </Icon>
        <div>
          <Body weight="medium" className="mb-1">Corner Style</Body>
          <Body size="sm" color="secondary">Border radius for buttons and cards</Body>
        </div>
      </div>

      {/* Radius grid */}
      <Grid columns={columns} gap="md" className="grid-cols-2 md:grid-cols-4">
        {RADIUS_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            type="radio"
            name="radius-scale"
            value={option.value}
            checked={radiusScale === option.value}
            onChange={(checked) => handleRadiusChange(checked, option.value)}
            size="sm"
            controlPosition="right"
          >
            <div className="text-center">
              <Label size="sm" weight="medium" className="mb-3 block">
                {option.label}
              </Label>
              
              {/* Enhanced visual preview with multiple shapes */}
              <div className="flex flex-col items-center gap-2 mb-3">
                {/* Main preview shape */}
                <div
                  className="w-8 h-6 bg-gray-400 border border-gray-500"
                  style={{ borderRadius: option.preview }}
                />
                {/* Mini UI elements preview */}
                <div className="flex gap-1 items-center">
                  {/* Mini button */}
                  <div
                    className="w-4 h-2 bg-blue-400"
                    style={{ borderRadius: option.preview }}
                  />
                  {/* Mini card */}
                  <div
                    className="w-3 h-3 bg-white border border-gray-300"
                    style={{ borderRadius: option.preview }}
                  />
                  {/* Mini tag */}
                  <div
                    className="w-2 h-2 bg-green-400"
                    style={{ borderRadius: option.preview }}
                  />
                </div>
              </div>
              
              {/* Just the technical measurement */}
              <Body size="xs" color="secondary">
                {option.description}
              </Body>
            </div>
          </SelectionCard>
        ))}
      </Grid>
    </div>
  );
}
