// ===============================================
// src/design-system/components/patterns/RichText/RichText.tsx
// RICH TEXT PATTERN - Heading, subtitle, and buttons with Rhythm layout
// ===============================================

import React from 'react';
import { Rhythm, RhythmItem } from '../../../components/layout/rhythm/Rhythm';
import { Block } from '../../../components/frames/block/Block';
import { Button, ButtonProps } from '../../../../system/components';
import { Typography, TypographyVariant, TypographyColor, TypographyWeight, TypographyAlign } from '../../../../system/components';
import { Icon  } from '../../../components/media';
import { ArrowRightIcon } from 'lucide-react';

// ===== TYPE DEFINITIONS =====

export interface RichTextProps {
  className?: string;
  
  // Heading content and styling
  heading: React.ReactNode;
  headingVariant?: TypographyVariant;
  headingColor?: TypographyColor;
  headingWeight?: TypographyWeight;
  headingAs?: React.ElementType;
  
  // Subtitle content and styling
  subtitle?: React.ReactNode;
  subtitleVariant?: TypographyVariant;
  subtitleColor?: TypographyColor;
  subtitleWeight?: TypographyWeight;
  subtitleAs?: React.ElementType;
  
  // Single button props
  button?: {
    children: React.ReactNode;
    onClick?: () => void;
  } & Omit<ButtonProps, 'children' | 'rightIcon'>;
  
  // Rhythm layout configuration
  unit?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textPosition?: number;
  buttonPosition?: number;
  
  // Spacing configuration
  textSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  // Text alignment
  textAlign?: TypographyAlign;
  
  // Text wrapping control
  maxWidth?: string | number;
}

// ===== MAIN RICH TEXT COMPONENT =====

export const RichText: React.FC<RichTextProps> = ({
  className,
  heading,
  headingVariant, // Removed default value
  headingColor = 'heading',
  headingWeight,
  headingAs,
  subtitle,
  subtitleVariant, // Removed default value
  subtitleColor = 'secondary',
  subtitleWeight,
  subtitleAs,
  button,
  unit = 'lg',
  textPosition = 1,
  buttonPosition = 5,
  textSpacing = 'sm',
  textAlign = 'center',
  maxWidth = 'var(--size-page-narrow-max-width)',
}) => {


  const textAlignClass = textAlign !== 'left' ? `text-${textAlign}` : '';

  return (
      <Rhythm
        className={`${className || ''} ${textAlignClass}`.trim()}
        unit={unit}
        align="center"
        direction="column"
      >
        {/* Text Group (Heading + Subtitle) */}
        <RhythmItem at={textPosition}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: `var(--foundation-space-${textSpacing === 'xs' ? '1' : textSpacing === 'sm' ? '2' : textSpacing === 'md' ? '3' : textSpacing === 'lg' ? '4' : textSpacing === 'xl' ? '5' : '6'})` }}>
            <Typography
              variant={headingVariant}
              color={headingColor}
              weight={headingWeight}
              align={textAlign}
              as={headingAs}
            >
              {heading}
            </Typography>
            
            {subtitle && (
              <Typography
                variant={subtitleVariant}
                color={subtitleColor}
                weight={subtitleWeight}
                align={textAlign}
                as={subtitleAs}
              >
                {subtitle}
              </Typography>
            )}
          </div>
        </RhythmItem>
        
        {/* Button */}
        {button && (
          <RhythmItem at={buttonPosition}>
            <Block className="flex justify-center">
              <Button 
                {...button}
                variant={button.variant || "primary"}
                rightIcon={<Icon color="inverse"><ArrowRightIcon/></Icon>}
              >
                {button.children}
              </Button>
            </Block>
          </RhythmItem>
        )}
      </Rhythm>
  );
};

RichText.displayName = 'RichText'; 