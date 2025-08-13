
// ===============================================
// RadiusControl.tsx - UPDATED to use DesignRadioCard
// ===============================================
import React from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
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

  // ✅ Convert from DesignRadioCard's string onChange to theme system
  const handleRadiusChange = (radiusValue: string) => {
    console.log('🔄 RadiusControl: Changing radius to:', radiusValue);
    setRadiusScale(radiusValue as RadiusScale);
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

      {/* ✅ Using DesignRadioCard with Root + Radius items */}
      <DesignRadioCard.Root
        name="radius-scale"
        value={radiusScale || 'md'}
        onChange={handleRadiusChange}
        columns={columns}
        gap="xs"
        size="xs"
      >
        {RADIUS_OPTIONS.map((option) => (
            <DesignRadioCardItem
            key={option.value}
            value={option.value}
            label={option.label}
            variant="radius"
            radiusPreview={option.description}
            />
        ))}
      </DesignRadioCard.Root>
    </div>
  );
}
