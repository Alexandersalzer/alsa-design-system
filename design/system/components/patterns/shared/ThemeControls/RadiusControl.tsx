// ===============================================
// blimpify-ui/design/system/components/patterns/shared/ThemeControls/RadiusControl.tsx
// FIXED: Better styling
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
      className={className}
    >
      <></>
    </OptionGridSection>
  );
}

export function SimpleRadiusControl({ columns = 2, className }: RadiusControlProps) {
  const { radiusScale, setRadiusScale } = useTheme();

    function getGridCols(columns: number): string {
    switch (columns) {
        case 1: return 'grid-cols-1';
        case 2: return 'grid-cols-2';
        case 3: return 'grid-cols-3';
        case 4: return 'grid-cols-4';
        default: return 'grid-cols-3';
    }
    }
    
  return (
    <div className={`radius-control ${className || ''}`}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Square2StackIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Corner Style</h3>
        </div>
        <p className="text-sm text-gray-600">Border radius scale</p>
      </div>
      
      <div className={`grid gap-2 ${getGridCols(columns)}`}>
        {RADIUS_OPTIONS.map((radius) => (
          <button
            key={radius.id}
            onClick={() => setRadiusScale(radius.value as RadiusScale)}
            className={`relative p-3 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
              radiusScale === radius.value
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {/* Selected indicator */}
            {radiusScale === radius.value && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <div className="flex flex-col items-center gap-1 mb-2">
              <div
                className="w-6 h-4 bg-gray-300"
                style={{ borderRadius: radius.px }}
              />
              <div
                className="w-4 h-2 bg-gray-400"
                style={{ borderRadius: radius.px }}
              />
            </div>
            <div className="text-xs font-medium text-gray-900">{radius.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}