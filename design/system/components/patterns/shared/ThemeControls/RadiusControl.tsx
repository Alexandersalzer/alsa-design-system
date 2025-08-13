// ===============================================
// RadiusControl.tsx - FIXED to actually work with theme system
// ===============================================
import React from 'react';
import { DesignRadioCard } from '@blimpify-im/ui';
import { useTheme, type RadiusScale } from '../../../../hooks/useTheme';
import { Square2StackIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

const RADIUS_OPTIONS = [
  { value: 'none', label: 'Sharp', description: '0px' },
  { value: 'xs', label: 'Minimal', description: '2px' },
  { value: 'sm', label: 'Small', description: '4px' },
  { value: 'md', label: 'Medium', description: '8px' },
  { value: 'lg', label: 'Large', description: '12px' },
  { value: 'xl', label: 'XL', description: '16px' },
  { value: '2xl', label: 'Max', description: '24px' },
];

interface RadiusControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function RadiusControl({ columns = 4, className }: RadiusControlProps) {
  const { radiusScale, setRadiusScale } = useTheme();

  const handleRadiusChange = (radiusValue: string) => {
    console.log('🔄 RadiusControl: Changing radius to:', radiusValue);
    setRadiusScale(radiusValue as RadiusScale);
  };

  console.log('🔄 RadiusControl: Current radiusScale:', radiusScale);

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

      {/* Radius radio group */}
      <DesignRadioCard.Root
        name="radius-scale"
        value={radiusScale || 'md'} // Default fallback
        onChange={handleRadiusChange}
        columns={columns}
        gap="xs"
        size="xs"
      >
        {RADIUS_OPTIONS.map((option) => (
          <DesignRadioCard.Radius
            key={option.value}
            value={option.value}
            label={option.label}
            radiusPreview={option.description}
          />
        ))}
      </DesignRadioCard.Root>
    </div>
  );
}