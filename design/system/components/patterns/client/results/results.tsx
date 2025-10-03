// ===============================================
// design/system/components/patterns/client/results/results.tsx
// RESULTS PATTERN - Display result statistics with icon and description
// ===============================================

import React from 'react';
import { Card } from '../../../../../system/components/primitives/Card';
import { Typography, TypographyColor } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../layout/utilities/stack/Stack';
import Image from 'next/image';

// ===== TYPE DEFINITIONS =====

export interface ResultsProps {
  className?: string;
  
  // Content
  subtitle: string;
  body: string;
  title: string;
  image: string;
  
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
  image,
  
  // Card styling defaults
  variant = 'default',
  padding = 'md', // Changed from 'lg' to 'md' since we handle padding in CSS
  radius = 'md',
  
  // Layout defaults
  spacing = 'sm', // Increased spacing between card and text
}) => {
  return (
    <Stack spacing={spacing}>
      <Card
        className={`results-card ${className || ''}`}
        variant={variant}
        padding={padding}
        radius={radius}
      >
          {/* Image with proper spacing inside card */}
          <div className="results-image-container">
            <Image
              src={`/images/results/${image}`}
              alt={title}
              width={500}
              height={300} // Adjusted height ratio
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain' // Changed to contain to show full image compressed
              }}
              priority
            />
          </div>
      </Card>
      
      {/* Description below card */}
      <Stack spacing="xs">
        <Typography variant="body-lg" weight="regular" color="secondary" align="left">
          {subtitle}
        </Typography>
        <Typography variant="h4" weight="bold" color="primary" align="left">
          {title}
        </Typography>
        <Typography variant="body-md" weight="regular" color="secondary" align="left">
          {body}
        </Typography>
      </Stack>
    </Stack>
  );
};

Results.displayName = 'Results'; 