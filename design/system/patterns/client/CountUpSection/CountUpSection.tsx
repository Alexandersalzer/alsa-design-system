// ===============================================
// design/system/components/patterns/client/CountUpSection/CountUpSection.tsx
// COUNT UP SECTION PATTERN - CountUp + Subtitle + Button with VStack layout
// ===============================================

import React from 'react';
import { VStack } from '../../../components/layout/vStack/VStack';
import { CountUp, CountUpProps } from '../../../../system/components/primitives/CountUp';
import { Typography, TypographyProps } from '../../../../system/components/primitives/Typography';
import { Button, ButtonProps } from '../../../../system/components';
import { Icon } from '../../../../system/components/primitives/media';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

// ===== TYPE DEFINITIONS =====

export interface CountUpSectionProps {
  className?: string;
  
  // CountUp configuration
  countUp: {
    end: number;
    start?: number;
    duration?: number;
    delay?: number;
    separator?: string;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    useEasing?: boolean;
    onComplete?: () => void;
    enableScrollTrigger?: boolean;
    triggerOffset?: number;
  } & Omit<CountUpProps, 'end' | 'start' | 'duration' | 'delay' | 'separator' | 'suffix' | 'prefix' | 'decimals' | 'useEasing' | 'onComplete' | 'enableScrollTrigger' | 'triggerOffset'>;
  
  // Subtitle configuration
  subtitle?: {
    text: string;
  } & Omit<TypographyProps, 'children'>;
  
  // Button configuration
  button?: {
    text: string;
    onClick?: () => void;
  } & Omit<ButtonProps, 'children' | 'onClick'>;
  
  // VStack configuration
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

// ===== MAIN COUNTUP SECTION COMPONENT =====

export const CountUpSection: React.FC<CountUpSectionProps> = ({
  className,
  countUp,
  subtitle,
  button,
  spacing = 'sm',
  align = 'center'
}) => {
  return (
    <VStack
      className={className}
      spacing={spacing}
      align={align}
    >
      {/* CountUp Display */}
      <CountUp
        {...countUp}
      />
      
      {/* Optional Subtitle */}
      {subtitle && (
        <Typography
          variant={subtitle.variant || 'body-lg'}
          weight={subtitle.weight || 'regular'}
          color={subtitle.color || 'secondary'}
          align={subtitle.align || 'center'}
          {...subtitle}
        >
          {subtitle.text}
        </Typography>
      )}
      
      {/* Optional Button */}
      {button && (
        <Button
          variant={button.variant || 'primary'}
          rightIcon={<Icon color="inverse"><ArrowRightIcon/></Icon>}
          size={button.size || 'md'}
          onClick={button.onClick}
          {...button}
        >
          {button.text}
        </Button>
      )}
    </VStack>
  );
};

CountUpSection.displayName = 'CountUpSection'; 