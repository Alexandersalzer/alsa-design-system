
// ===============================================
// STEP 4: Update your existing ThemeControlPanel.tsx
// Just ADD the theme mode control and prop
// ===============================================

import React from 'react';
import { Stack } from '@blimpify-im/ui';
import { AccentColorControl } from './AccentColorControl';
import { RadiusControl } from './RadiusControl';
import { ThemeModeControl } from './ThemeModeControl'; // ✅ ADD this import

interface ThemeControlPanelProps {
  showThemeToggle?: boolean; // ✅ ADD this prop
  showColorControl?: boolean;
  showRadiusControl?: boolean;
  colorColumns?: 1 | 2 | 3 | 4;
  radiusColumns?: 1 | 2 | 3 | 4;
  className?: string;
  logoUrl?: string; // Optional logo URL for brand color extraction
  setCustomBrand?: () => void; // Function to set custom brand in preferences
}

export function ThemeControlPanel({
  showThemeToggle = true, // ✅ ADD this line
  showColorControl = true,
  showRadiusControl = true,
  colorColumns = 3,
  radiusColumns = 2,
  className,
  logoUrl,
  setCustomBrand
}: ThemeControlPanelProps) {
  return (
    <div className={className}>
      <Stack spacing="xl">
        {showThemeToggle && ( // ✅ ADD this block
          <ThemeModeControl />
        )}
        {showColorControl && (
          <AccentColorControl columns={colorColumns} logoUrl={logoUrl} setCustomBrand={setCustomBrand} />
        )}
        {showRadiusControl && (
          <RadiusControl columns={radiusColumns} />
        )}
      </Stack>
    </div>
  );
}