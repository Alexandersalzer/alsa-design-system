
// ===============================================
// RadiusControl.tsx - Using REAL ChoiceGroup component
// ===============================================
import React from 'react';
import { ChoiceGroup, type ChoiceOption } from '@blimpify-im/ui';
import { useTheme, type RadiusScale } from '../../../../hooks/useTheme';
import { Square2StackIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

const RADIUS_OPTIONS: ChoiceOption[] = [
  { value: 'none', label: 'Sharp', description: '0px - No rounding' },
  { value: 'xs', label: 'Minimal', description: '2px - Subtle' },
  { value: 'sm', label: 'Small', description: '4px - Light' },
  { value: 'md', label: 'Medium', description: '8px - Balanced' },
  { value: 'lg', label: 'Large', description: '12px - Rounded' },
  { value: 'xl', label: 'XL', description: '16px - Very rounded' },
  { value: '2xl', label: 'Max', description: '24px - Maximum' },
];

interface RadiusControlProps {
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function RadiusControl({ columns = 2, className }: RadiusControlProps) {
  const { radiusScale, setRadiusScale } = useTheme();

  const handleRadiusChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setRadiusScale(value as RadiusScale);
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
          <Body size="sm" color="secondary">Border radius scale</Body>
        </div>
      </div>

      {/* Choice group */}
      <ChoiceGroup
        type="radio"
        options={RADIUS_OPTIONS}
        value={radiusScale}
        onChange={handleRadiusChange}
        layout="grid"
        size="sm"
      />
    </div>
  );
}
