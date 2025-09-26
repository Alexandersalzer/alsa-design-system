// ===============================================
// RadiusControl.tsx - UPPDATERAD för att använda DesignRadioCard (Svenska)
// ===============================================
import React from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { useTheme, type RadiusScale } from '../../../../hooks/useTheme';
import { Square2StackIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

const RADIUS_OPTIONS = [
  { value: 'none', label: 'Skarp', description: '0px' },
  { value: 'xs', label: 'Minimal', description: '1px' },
  { value: 'sm', label: 'Liten', description: '2px' },
  { value: 'md', label: 'Medium', description: '3px' },
  { value: 'lg', label: 'Stor', description: '4px' },
  { value: 'xl', label: 'Extra stor', description: '5px' },
  { value: '2xl', label: 'Maximum', description: '24px' },
];

interface RadiusControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  value?: string; // External value control
  onChange?: (value: string) => void; // External change handler
}

export function RadiusControl({ columns = 4, className, value, onChange }: RadiusControlProps) {
  const { radiusScale, setRadiusScale } = useTheme();

  // ✅ Handle radius change - support both internal and external control
  const handleRadiusChange = (radiusValue: string) => {
    console.log('🔄 RadiusControl: Ändrar radius till:', radiusValue);
    
    // If external onChange is provided, use it (for ProjectContext integration)
    if (onChange) {
      onChange(radiusValue);
    }
    
    // Also update internal theme system
    setRadiusScale(radiusValue as RadiusScale);
  };

  // Use external value if provided, otherwise use internal theme state
  const currentValue = value || radiusScale;

  return (
    <div className={className}>
      {/* Sektionsrubrik */}
      <div className="flex items-center gap-3 mb-4">
        <Icon size="md" color="primary">
          <Square2StackIcon />
        </Icon>
        <div>
          <Body weight="medium" className="mb-1">Hörnstil</Body>
          <Body size="sm" color="secondary">Kantradius för knappar och kort</Body>
        </div>
      </div>

      {/* ✅ Använder DesignRadioCard med Root + Radius-objekt */}
      <DesignRadioCard.Root
        name="radius-scale"
        value={currentValue || 'md'} // Default matches project-builder defaults
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