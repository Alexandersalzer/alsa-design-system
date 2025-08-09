// ===============================================
// RadiusControl.tsx - Using SelectionCard for better visual controls
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

  return (
    <div className={className}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <Icon size="md" color="primary">
          <Square2StackIcon />
        </Icon>
        <div>
          <Body weight="medium" className="mb-1">Corner Style</Body>
          <Body size="sm" color="secondary">Border radius scale</Body>
        </div>
      </div>

      {/* Radius grid */}
      <Grid columns={columns} gap="md" className="grid-cols-2 md:grid-cols-4">
        {RADIUS_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            selected={radiusScale === option.value}
            onClick={() => setRadiusScale(option.value as RadiusScale)}
            size="sm"
          >
            <div className="text-center">
              <Label size="sm" weight="medium" className="mb-2 block">
                {option.label}
              </Label>
              
              {/* Visual preview */}
              <div className="flex justify-center mb-2">
                <div 
                  className="w-8 h-8 bg-gray-300 border border-gray-400"
                  style={{ borderRadius: option.preview }}
                />
              </div>
              
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
