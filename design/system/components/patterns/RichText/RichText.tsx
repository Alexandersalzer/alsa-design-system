// ===============================================
// src/design-system/components/patterns/RichText/RichText.tsx
// RICH TEXT PATTERN - Heading, subtitle, and buttons with Rhythm layout
// ===============================================

import React from 'react';
import { Rhythm, RhythmItem } from '@/design/system/layout/utilities/rhythm/Rhythm';
import { Cluster } from '@/design/system/layout/utilities/cluster/Cluster';
import { Button, ButtonProps } from '@/design/system/components/primitives/Button';
import { Typography, TypographyVariant, TypographyColor, TypographyWeight, TypographyAlign } from '@/design/system/components/primitives/Typography';
import { Icons } from '@/design/system/components/primitives/Icon';

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
  
  // Primary button props (single button like KJ Marketing Sweden)
  primaryButton?: {
    children: React.ReactNode;
    onClick?: () => void;
  } & Omit<ButtonProps, 'children' | 'rightIcon'>;
  
  // Additional buttons for future flexibility (keeping Cluster structure)
  additionalButtons?: ({
    children: React.ReactNode;
    onClick?: () => void;
  } & Omit<ButtonProps, 'children'>)[];
  
  // Rhythm layout configuration
  unit?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textPosition?: number;
  buttonsPosition?: number;
  
  // Spacing configuration
  textSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  buttonSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Text alignment
  textAlign?: TypographyAlign;
  
  // Text wrapping control
  maxWidth?: string | number;
}

// ===== MAIN RICH TEXT COMPONENT =====

export const RichText: React.FC<RichTextProps> = ({
  className,
  heading,
  headingVariant = 'display-xl',
  headingColor = 'heading',
  headingWeight,
  headingAs,
  subtitle,
  subtitleVariant = 'body-xl',
  subtitleColor = 'secondary',
  subtitleWeight,
  subtitleAs,
  primaryButton,
  additionalButtons = [],
  unit = 'lg',
  textPosition = 1,
  buttonsPosition = 5, // Increased from 3 to 5 for more spacing
  textSpacing = 'sm',
  buttonSpacing = 'md',
  textAlign = 'center',
  maxWidth = '600px', // Reduced from 800px for tighter text wrapping
}) => {
  const containerStyle = {
    ...(maxWidth && { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }),
    width: '100%',
    margin: '0 auto', // Center the container
    display: 'flex',
    justifyContent: 'center', // Center content horizontally
  };

  const textAlignClass = textAlign !== 'left' ? `text-${textAlign}` : '';

  // Check if we have any buttons to render
  const hasButtons = primaryButton || additionalButtons.length > 0;

  return (
    <div style={containerStyle}>
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
        
        {/* Buttons */}
        {hasButtons && (
          <RhythmItem at={buttonsPosition}>
            <Cluster
              spacing={buttonSpacing}
              align="center"
              justify="center"
              wrap={false}
            >
              {primaryButton && (
                <Button 
                  {...primaryButton}
                  variant="primary"
                  rightIcon={Icons.Button.ArrowRight('primary', false)}
                >
                  {primaryButton.children}
                </Button>
              )}
              {additionalButtons.map((button, index) => (
                <Button key={index} {...button}>
                  {button.children}
                </Button>
              ))}
            </Cluster>
          </RhythmItem>
        )}
      </Rhythm>
    </div>
  );
};

RichText.displayName = 'RichText'; 