
// ===============================================
// blimpify-ui/design/system/components/patterns/shared/ThemeControls/RadiusControl.tsx
// FIXED: Correct relative imports
// ===============================================

import React from 'react';
import { OptionGridSection, type OptionItem } from '../../dashboard/selection/OptionGrid';
import { useTheme, type RadiusScale } from '../../../../hooks/useTheme';
import { Square2StackIcon } from '@heroicons/react/24/outline';

const RADIUS_OPTIONS: OptionItem[] = [
  { id: 'none', name: 'Sharp', value: 'none', px: '0px' },
  { id: 'xs', name: 'Minimal', value: 'xs', px: '2px' },
  { id: 'sm', name: 'Small', value: 'sm', px: '4px' },
  { id: 'md', name: 'Medium', value: 'md', px: '8px' },
  { id: 'lg', name: 'Large', value: 'lg', px: '12px' },
  { id: 'xl', name: 'XL', value: 'xl', px: '16px' },
  { id: '2xl', name: 'Max', value: '2xl', px: '24px' },
];

interface RadiusControlProps {
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function RadiusControl({ columns = 2, className }: RadiusControlProps) {
  const { radiusScale, setRadiusScale } = useTheme();

  return (
    <OptionGridSection
      title="Corner Style"
      description="Border radius scale"
      icon={<Square2StackIcon />}
      options={RADIUS_OPTIONS}
      selected={radiusScale}
      onChange={(value) => setRadiusScale(value as RadiusScale)}
      columns={columns}
      variant="radius"
      className={className} children={undefined}
    />
  );
}