// ===============================================
// blimpify-ui/design/system/components/patterns/ThemeControls/ThemeControlPanel.tsx
// NEW FILE: Combined theme panel
// ===============================================

import React from 'react';
import { Stack } from '../../dashboard/page/Stack';
import { AccentColorControl } from './AccentColorControl';
import { RadiusControl } from './RadiusControl';

interface ThemeControlPanelProps {
  showColorControl?: boolean;
  showRadiusControl?: boolean;
  colorColumns?: 1 | 2 | 3 | 4;
  radiusColumns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ThemeControlPanel({
  showColorControl = true,
  showRadiusControl = true,
  colorColumns = 3,
  radiusColumns = 2,
  className
}: ThemeControlPanelProps) {
  return (
    <div className={className}>
      <Stack spacing="xl">
        {showColorControl && (
          <AccentColorControl columns={colorColumns} />
        )}
        {showRadiusControl && (
          <RadiusControl columns={radiusColumns} />
        )}
      </Stack>
    </div>
  );
}