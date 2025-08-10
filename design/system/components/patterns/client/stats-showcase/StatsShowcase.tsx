// ===============================================
// design/system/components/patterns/client/stats-showcase/StatsShowcase.tsx
// STATS SHOWCASE PATTERN COMPONENT
// ===============================================

import React from 'react';
import { Stack } from '../../../../layout/utilities/stack/Stack';
import { CountUp, CountUpProps } from '../../../primitives/CountUp';
import { Typography } from '../../../primitives/Typography';
import { Button, ButtonProps } from '../../../primitives/Button';

export interface StatsShowcaseProps {
  className?: string;
  
  // CountUp configuration
  countUpProps?: Omit<CountUpProps, 'children'>;
  
  // Subtitle text
  subtitle?: string;
  subtitleVariant?: 'body-sm' | 'body-md' | 'body-lg' | 'label-xs' | 'label-sm' | 'label-md';
  
  // Button configuration
  buttonText?: string;
  buttonProps?: Omit<ButtonProps, 'children'>;
  onButtonClick?: () => void;
  
  // Layout
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const StatsShowcase: React.FC<StatsShowcaseProps> = ({
  className = '',
  countUpProps = {
    end: 0,
    suffix: '+',
    variant: 'display-xl',
    weight: 'extrabold',
    color: 'primary'
  },
  subtitle = 'VIEWS IN 2024',
  subtitleVariant = 'label-sm',
  buttonText = 'Check my full portfolio',
  buttonProps = {
    variant: 'primary',
    size: 'lg',
    radius: 'md'
  },
  onButtonClick,
  spacing = 'md',
  align = 'center'
}) => {
  return (
    <div className={`stats-showcase ${className}`}>
      <Stack spacing={spacing} align={align}>
        {/* Count Up Number */}
        <CountUp
          separator=","
          duration={2500}
          enableScrollTrigger={true}
          triggerOffset={100}
          {...countUpProps}
        />
        
        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant={subtitleVariant}
            weight="medium"
            color="secondary"
            align="center"
            uppercase
          >
            {subtitle}
          </Typography>
        )}
        
        {/* Action Button */}
        {buttonText && (
          <Button
            onClick={onButtonClick}
            {...buttonProps}
          >
            {buttonText}
          </Button>
        )}
      </Stack>
    </div>
  );
}; 