// ===============================================
// design/system/components/patterns/client/ReviewCard/ReviewCard.tsx
// REVIEW CARD PATTERN - Customer review card with name, subtitle and review text
// ===============================================

import React from 'react';
import { Card } from '../../../../../system/components/primitives/Card';
import { Typography, TypographyColor } from '../../../../../system/components/primitives/Typography';
import { Icon, UserCircleIcon } from '../../../../../system/components/primitives/Icon';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';

// ===== TYPE DEFINITIONS =====

export interface ReviewCardProps {
  className?: string;
  
  // Review content
  name: string;
  subtitle: string;
  reviewText: string;
  
  // Profile icon configuration
  showIcon?: boolean;
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  iconColor?: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'muted';
  
  // Styling options
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
  
  // Typography variants
  nameVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-xl' | 'body-lg' | 'body-md' | 'body-sm';
  subtitleVariant?: 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs' | 'label-lg' | 'label-md' | 'label-sm';
  reviewTextVariant?: 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs';
  
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
  headerSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// ===== MAIN REVIEW CARD COMPONENT =====

export const ReviewCard: React.FC<ReviewCardProps> = ({
  className,
  name,
  subtitle,
  reviewText,
  
  // Icon defaults
  showIcon = true,
  iconSize = 'xl',
  iconColor = 'muted',
  
  // Card styling defaults
  variant = 'outlined',
  padding = 'lg',
  radius = 'md',
  
  // Typography defaults - matching KJ Marketing style
  nameVariant = 'h6',
  subtitleVariant = 'body-sm',
  reviewTextVariant = 'body-md',
  
  nameWeight = 'bold',
  subtitleWeight = 'medium',
  reviewTextWeight = 'regular',
  
  nameColor = 'primary',
  subtitleColor = 'secondary',
  reviewTextColor = 'primary',
  
  // Layout defaults
  spacing = 'md',
  headerSpacing = 'sm'
}) => {
  return (
    <Card
      className={className}
      variant={variant}
      padding={padding}
      radius={radius}
    >
      <Stack spacing={spacing}>
        {/* Header: Icon + Name/Subtitle horizontally */}
        <Cluster spacing={headerSpacing} align="start">
          {/* Profile Icon */}
          {showIcon && (
            <Icon size={iconSize} color={iconColor}>
              <UserCircleIcon />
            </Icon>
          )}
          
          {/* Name and Subtitle vertically */}
          <Stack spacing="xs" flexChild={true}>
            <Typography
              variant={nameVariant}
              weight={nameWeight}
              color={nameColor}
              align="left"
            >
              {name}
            </Typography>
            
            <Typography
              variant={subtitleVariant}
              weight={subtitleWeight}
              color={subtitleColor}
              align="left"
            >
              {subtitle}
            </Typography>
          </Stack>
        </Cluster>
        
        {/* Review Text - Below header */}
        <Typography
          variant={reviewTextVariant}
          weight={reviewTextWeight}
          color={reviewTextColor}
          align="left"
        >
          {reviewText}
        </Typography>
      </Stack>
    </Card>
  );
};

ReviewCard.displayName = 'ReviewCard'; 