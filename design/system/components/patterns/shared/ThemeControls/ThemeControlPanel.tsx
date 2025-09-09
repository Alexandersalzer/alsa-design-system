// ===============================================
// ThemeControlPanel.tsx - Updated for simplified AccentColorControl
// ===============================================
import React from 'react';
import { Stack } from '@blimpify-im/ui';
import { AccentColorControl } from './AccentColorControl';
import { RadiusControl } from './RadiusControl';
import { ThemeModeControl } from './ThemeModeControl';

interface ThemeControlPanelProps {
  showThemeToggle?: boolean;
  showColorControl?: boolean;
  showRadiusControl?: boolean;
  // Removed colorColumns since AccentColorControl is now fixed 3x10 grid
  radiusColumns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ThemeControlPanel({
  showThemeToggle = true,
  showColorControl = true,
  showRadiusControl = true,
  radiusColumns = 2,
  className
}: ThemeControlPanelProps) {
  return (
    <div className={className}>
      <Stack spacing="xl">
        {showThemeToggle && (
          <ThemeModeControl />
        )}
        
        {showColorControl && (
          <AccentColorControl />
        )}
        
        {showRadiusControl && (
          <RadiusControl columns={radiusColumns} />
        )}
      </Stack>
    </div>
  );
}