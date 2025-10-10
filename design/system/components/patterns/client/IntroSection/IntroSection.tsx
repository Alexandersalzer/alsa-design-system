'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';

// ===== TYPE DEFINITIONS =====

export interface IntroSectionContent {
  label?: string;
  heading: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export interface IntroSectionProps {
  content: IntroSectionContent;
  id?: string;
  
  // Layout controls
  paddingTop?: string;
  paddingBottom?: string;
  maxWidth?: string;
  textAlign?: 'left' | 'center' | 'right';
  
  // Typography controls
  textScale?: 'sm' | 'md' | 'lg' | 'xl';
  headingColor?: string;
  descriptionColor?: string;
  labelColor?: string;
  
  // Background controls
  backgroundColor?: string;
  
  // Button controls
  showButtons?: boolean;
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
  primaryButtonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  secondaryButtonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  
  // Callbacks
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

// ===== MAIN COMPONENT =====

export const IntroSection: React.FC<IntroSectionProps> = ({
  content,
  id = "intro-section",
  
  // Layout
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  maxWidth = 'var(--size-page-content-max-width)',
  textAlign = 'center',
  
  // Typography
  textScale = 'md',
  headingColor,
  descriptionColor,
  labelColor,
  
  // Background
  backgroundColor = 'var(--surface-page)',
  
  // Buttons
  showButtons = true,
  buttonSize = 'lg',
  primaryButtonVariant = 'primary',
  secondaryButtonVariant = 'secondary',
  
  // Callbacks
  onPrimaryClick,
  onSecondaryClick
}) => {
  const {
    label,
    heading,
    description,
    primaryButtonText,
    primaryButtonHref,
    secondaryButtonText,
    secondaryButtonHref
  } = content;

  // Map textScale to Typography variants
  const getHeadingVariant = () => {
    switch (textScale) {
      case 'xl': return 'display-lg';
      case 'lg': return 'display-md';
      case 'md': return 'h2';
      case 'sm': return 'h3';
      default: return 'h2';
    }
  };

  const getDescriptionVariant = () => {
    switch (textScale) {
      case 'xl': return 'body-xl';
      case 'lg': return 'body-xl';
      case 'md': return 'body-lg';
      case 'sm': return 'body-md';
      default: return 'body-lg';
    }
  };

  const getLabelVariant = () => {
    switch (textScale) {
      case 'xl': return 'label-md';
      case 'lg': return 'label-md';
      case 'md': return 'label-sm';
      case 'sm': return 'label-sm';
      default: return 'label-sm';
    }
  };

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else if (primaryButtonHref) {
      window.location.href = primaryButtonHref;
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else if (secondaryButtonHref) {
      window.location.href = secondaryButtonHref;
    }
  };

  return (
    <>
      <style>{`
        .intro-section-container {
          max-width: ${maxWidth};
          margin: 0 auto;
          padding: 0 var(--foundation-space-6);
          text-align: ${textAlign};
        }
        
        .intro-section-content {
          display: flex;
          flex-direction: column;
          align-items: ${textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center'};
          gap: var(--foundation-space-8);
        }
        
        .intro-section-text {
          display: flex;
          flex-direction: column;
          gap: ${textScale === 'xl' || textScale === 'lg' ? 'var(--foundation-space-6)' : 'var(--foundation-space-4)'};
          max-width: 100%;
        }
        
        .intro-section-buttons {
          display: flex;
          gap: var(--foundation-space-4);
          flex-wrap: wrap;
          justify-content: ${textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center'};
        }
        
        @media (max-width: 768px) {
          .intro-section-container {
            text-align: left;
          }
          
          .intro-section-content {
            align-items: flex-start;
          }
          
          .intro-section-buttons {
            justify-content: flex-start;
            width: 100%;
          }
          
          .intro-section-buttons button {
            flex: 1;
            min-width: 140px;
          }
        }
      `}</style>

      <Section
        id={id}
        as="section"
        style={{
          backgroundColor,
          paddingTop,
          paddingBottom
        }}
      >
        <div className="intro-section-container">
          <div className="intro-section-content">
            {/* Text Content */}
            <div className="intro-section-text">
              {label && (
                <Typography
                  variant={getLabelVariant()}
                  color={labelColor ? undefined : 'accent'}
                  weight="medium"
                  style={labelColor ? { color: labelColor } : undefined}
                >
                  {label}
                </Typography>
              )}
              
              <Typography
                variant={getHeadingVariant()}
                weight="semibold"
                color={headingColor ? undefined : 'primary'}
                as="h2"
                style={headingColor ? { color: headingColor } : undefined}
              >
                {heading}
              </Typography>
              
              <Typography
                variant={getDescriptionVariant()}
                color={descriptionColor ? undefined : 'secondary'}
                style={descriptionColor ? { color: descriptionColor } : undefined}
              >
                {description}
              </Typography>
            </div>
            
            {/* Buttons */}
            {showButtons && (primaryButtonText || secondaryButtonText) && (
              <div className="intro-section-buttons">
                {primaryButtonText && (
                  <Button
                    variant={primaryButtonVariant}
                    size={buttonSize}
                    onClick={handlePrimaryClick}
                    href={primaryButtonHref}
                  >
                    {primaryButtonText}
                  </Button>
                )}
                
                {secondaryButtonText && (
                  <Button
                    variant={secondaryButtonVariant}
                    size={buttonSize}
                    onClick={handleSecondaryClick}
                    href={secondaryButtonHref}
                  >
                    {secondaryButtonText}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
};

IntroSection.displayName = 'IntroSection';

