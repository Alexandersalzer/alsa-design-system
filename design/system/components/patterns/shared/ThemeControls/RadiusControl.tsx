// ===============================================
// RadiusControl.tsx - UPPDATERAD för att använda DesignRadioCard (Svenska)
// ===============================================
import React from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { useTheme, type RadiusScale } from '../../../../hooks/useTheme';
import { Square2StackIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

const RADIUS_OPTIONS = [
  { value: 'skarp', label: 'Skarp', description: '0px' },
  { value: '2xs', label: 'Extra fin', description: '1px' },
  { value: 'xs', label: 'Fin', description: '2px' },
  { value: 'sm', label: 'Liten', description: '4px' },
  { value: 'md', label: 'Medium', description: '6px' },
  { value: 'lg', label: 'Stor', description: '8px' },
  { value: 'xl', label: 'Extra stor', description: '12px' },
  { value: '2xl', label: 'Dubbel stor', description: '16px' },
  { value: 'pill', label: 'Pill', description: 'Full' },
];

interface RadiusControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function RadiusControl({ columns = 3, className }: RadiusControlProps) {
  const { radiusScale, setRadiusScale } = useTheme();

  // ✅ Konvertera från DesignRadioCards string onChange till tema-systemet
  const handleRadiusChange = (radiusValue: string) => {
    console.log('🔄 RadiusControl: Ändrar radius till:', radiusValue);
    setRadiusScale(radiusValue as RadiusScale);
  };

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