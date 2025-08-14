// ===============================================
// design/system/components/patterns/client/results/results.tsx
// RESULTS PATTERN - Display result statistics with icon and description
// ===============================================

import React from 'react';
import { Card } from '../../../../../system/components/primitives/Card';
import { Typography, TypographyColor } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import Image from 'next/image';
import './results.css';

// ===== TYPE DEFINITIONS =====

export interface ResultsProps {
  className?: string;
  
  // Content
  subtitle: string;
  body: string;
  title: string;
  image: string;
  
  // Image aspect ratio for different content types
  imageAspectRatio?: 'landscape' | 'portrait' | 'square';
  
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
  imageAspectRatio = 'landscape', // Default to landscape
  
  // Card styling defaults
  variant = 'default',
  padding = 'sm', // Minimal padding since we handle it in CSS
  radius = 'md',
  
  // Layout defaults
  spacing = 'sm', // Increased spacing between card and text
}) => {
  // Determine aspect ratio class
  const aspectRatioClass = imageAspectRatio === 'portrait' ? 'portrait' : 
                          imageAspectRatio === 'square' ? 'square' : '';

  return (
    <Stack spacing={spacing}>
      <Card
        className={`results-card ${className || ''}`}
        variant={variant}
        padding={padding}
        radius={radius}
      >
          {/* Image with proper aspect ratio matching KJ Marketing design */}
          <div className={`results-image-container ${aspectRatioClass}`}>
            <Image
              src={`/images/results/${image}`}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
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