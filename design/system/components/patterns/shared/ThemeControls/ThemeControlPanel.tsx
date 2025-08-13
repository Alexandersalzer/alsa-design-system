// ===============================================
// ThemeControlPanel.tsx - UPDATED to include all design controls
// ===============================================
import React from 'react';
import { Stack } from '@blimpify-im/ui';
import { AccentColorControl } from './AccentColorControl';
import { RadiusControl } from './RadiusControl';
import { ThemeModeControl } from './ThemeModeControl';
import { TypographyControl } from './TypographyControl';

interface ThemeControlPanelProps {
  showThemeToggle?: boolean;
  showColorControl?: boolean;
  showRadiusControl?: boolean;
  showTypographyControl?: boolean;
  colorColumns?: 1 | 2 | 3 | 4 | 5 | 6;
  radiusColumns?: 1 | 2 | 3 | 4 | 5 | 6;
  typographyColumns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  
  // Typography control props
  fontValue?: string;
  onFontChange?: (fontValue: string) => void;
}

export function ThemeControlPanel({
  showThemeToggle = true,
  showColorControl = true,
  showRadiusControl = true,
  showTypographyControl = true,
  colorColumns = 3,
  radiusColumns = 4,
  typographyColumns = 1,
  className,
  fontValue,
  onFontChange
}: ThemeControlPanelProps) {
  return (
    <div className={className}>
      <Stack spacing="xl">
        {showThemeToggle && (
          <ThemeModeControl />
        )}
        
        {showColorControl && (
          <AccentColorControl columns={colorColumns} />
        )}
        
        {showRadiusControl && (
          <RadiusControl columns={radiusColumns} />
        )}
        
        {showTypographyControl && (
          <TypographyControl
            value={fontValue}
            onChange={onFontChange}
            columns={typographyColumns}
          />
        )}
      </Stack>
    </div>
  );
}