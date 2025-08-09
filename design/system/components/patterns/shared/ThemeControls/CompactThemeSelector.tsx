// ===============================================
// blimpify-ui/design/system/components/patterns/ThemeControls/CompactThemeSelector.tsx
// NEW FILE: Compact theme selector for toolbars
// ===============================================

import React from 'react';
import { useTheme } from 'design/system/hooks/useTheme';
import { ColorScale, RadiusScale } from '@/design/system/utils/themeManager';

const QUICK_COLORS: Array<{name: string, value: ColorScale, hex: string}> = [
  { name: 'Ruby', value: 'ruby', hex: '#EF4444' },
  { name: 'Purple', value: 'purple', hex: '#A855F7' },
  { name: 'Azure', value: 'azure', hex: '#3B82F6' },
  { name: 'Emerald', value: 'emerald', hex: '#10B981' },
];

const QUICK_RADIUS: Array<{name: string, value: RadiusScale}> = [
  { name: 'Sharp', value: 'sm' },
  { name: 'Medium', value: 'md' },
  { name: 'Large', value: 'lg' },
  { name: 'Max', value: 'xl' },
];

interface CompactThemeSelectorProps {
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function CompactThemeSelector({ 
  showLabels = false, 
  orientation = 'horizontal',
  className 
}: CompactThemeSelectorProps) {
  const { accentColor, setAccentColor, radiusScale, setRadiusScale } = useTheme();

  const containerClass = orientation === 'horizontal' 
    ? 'flex items-center gap-4' 
    : 'flex flex-col gap-4';

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Color swatches */}
      <div className="flex gap-2">
        {showLabels && <span className="text-sm font-medium">Color:</span>}
        <div className="flex gap-1">
          {QUICK_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setAccentColor(color.value)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                accentColor === color.value 
                  ? 'border-gray-900 scale-110' 
                  : 'border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Radius selector */}
      <div className="flex gap-2">
        {showLabels && <span className="text-sm font-medium">Radius:</span>}
        <div className="flex gap-1">
          {QUICK_RADIUS.map((radius) => (
            <button
              key={radius.value}
              onClick={() => setRadiusScale(radius.value)}
              className={`w-6 h-6 border-2 transition-all flex items-center justify-center ${
                radiusScale === radius.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ borderRadius: `var(--foundation-radius-${radius.value}-sm)` }}
              title={radius.name}
            >
              <div 
                className="w-3 h-3 bg-gray-400"
                style={{ borderRadius: `var(--foundation-radius-${radius.value}-xs)` }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
