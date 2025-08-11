// ===============================================
// design/system/components/patterns/client/results/results.tsx
// RESULTS PATTERN - Display result statistics with icon and description
// ===============================================

import React from 'react';
import { Card } from '../../../../../system/components/primitives/Card';
import { Typography, TypographyColor } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';

// ===== TYPE DEFINITIONS =====

export interface ResultsProps {
  className?: string;
  
  // Review content
  subtitle: string;
  body: string;
  title: string;
  // Profile icon configuration
  showIcon?: boolean;
  
  // Styling options
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
  
  // Typography variants
  nameVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-xl' | 'body-lg' | 'body-md' | 'body-sm';

  // Typography weights
  nameWeight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  subtitleWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  reviewTextWeight?: 'regular' | 'medium' | 'semibold';
  
  // Typography colors
  nameColor?: TypographyColor;
  subtitleColor?: TypographyColor;
  reviewTextColor?: TypographyColor;
  
  // Layout spacing
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// ===== MAIN RESULTS COMPONENT =====

export const Results: React.FC<ResultsProps> = ({
  className,
  subtitle,
  body,
  title,

  
  // Card styling defaults
  variant = 'default',
  padding = 'lg',
  radius = 'md',

  
  // Layout defaults
  spacing = 'md',
}) => {
  return (
    <Stack spacing={spacing}>
    <Card
      className={`results-card ${className || ''}`}
      variant={variant}
      padding={padding}
      radius={radius}
    >
        <Stack spacing="xs">
            <Typography variant="body-md" weight="bold" color="primary">
                {subtitle}
            </Typography>
            <Typography variant="body-md" weight="bold" color="primary">
                {title}
            </Typography>
        </Stack>
    </Card>
    <Stack spacing="xs">
      <Typography variant="body-xl" weight="regular" color="secondary" align="left">
        {subtitle}
      </Typography>
      <Typography variant="body-xl" weight="bold" color="primary" align="left">
        {title}
      </Typography>
      <Typography variant="body-lg" weight="regular" color="secondary" align="left">
      {body}
      </Typography>
    </Stack>
</Stack>
  );
};

Results.displayName = 'Results'; 