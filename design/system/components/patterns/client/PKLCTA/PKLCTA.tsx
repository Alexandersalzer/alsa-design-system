// ===============================================
// design/system/components/patterns/client/PKLCTA/PKLCTA.tsx
// PKL CTA SECTION - Conversion-focused call to action
// ===============================================

'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { VStack, Section } from '../../../layout';

// ===== TYPE DEFINITIONS =====

export interface PKLCTAContent {
  label?: string;
  heading: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export interface PKLCTAProps {
  content: PKLCTAContent;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'bordered';
}

// ===== MAIN CTA COMPONENT =====

export const PKLCTA: React.FC<PKLCTAProps> = ({ 
  content, 
  onPrimaryClick,
  onSecondaryClick,
  id = "pkl-cta",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md',
  variant = 'gradient'
}) => {
  const { 
    label,
    heading, 
    description, 
    primaryButtonText,
    primaryButtonHref,
    secondaryButtonText,
    secondaryButtonHref,
    stats
  } = content;

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
        .pkl-cta-outer-container {
          max-width: var(--size-page-max-width);
          margin: 0 auto;
        }
        
        .pkl-cta-card {
          position: relative;
          border-radius: var(--radius-xl);
          padding: var(--foundation-space-16) var(--foundation-space-10);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .pkl-cta-card.variant-default {
          background: var(--surface-card);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-md);
        }
        
        .pkl-cta-card.variant-gradient {
          background: linear-gradient(
            135deg,
            var(--accent-600) 0%,
            var(--accent-500) 50%,
            var(--accent-400) 100%
          );
          box-shadow: var(--shadow-xl);
        }
        
        .pkl-cta-card.variant-bordered {
          background: var(--surface-page);
          border: 2px solid var(--accent-500);
          box-shadow: var(--shadow-lg);
        }
        
        .pkl-cta-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-2xl);
        }
        
        .pkl-cta-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .pkl-cta-buttons {
          display: flex;
          gap: var(--foundation-space-4);
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: var(--foundation-space-6);
        }
        
        .pkl-cta-buttons button {
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        
        .pkl-cta-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: var(--foundation-space-8);
          margin-top: var(--foundation-space-12);
          padding-top: var(--foundation-space-12);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .pkl-cta-stat {
          text-align: center;
        }
        
        .pkl-cta-stat-value {
          font-size: clamp(2rem, 3vw, 3rem);
          font-weight: var(--font-weight-bold);
          line-height: 1.2;
          background: linear-gradient(135deg, var(--accent-300), var(--accent-100));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--foundation-space-2);
        }
        
        .pkl-cta-stat-label {
          color: var(--text-secondary);
          font-size: var(--foundation-typography-size-sm);
        }
        
        /* Variant-specific text colors */
        .pkl-cta-card.variant-gradient .pkl-cta-heading,
        .pkl-cta-card.variant-gradient .pkl-cta-description {
          color: white;
        }
        
        .pkl-cta-card.variant-gradient .pkl-cta-stat-label {
          color: rgba(255, 255, 255, 0.8);
        }
        
        .pkl-cta-card.variant-gradient .pkl-cta-label {
          color: rgba(255, 255, 255, 0.9);
        }
        
        /* Decorative background elements */
        .pkl-cta-bg-decoration {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.05;
          pointer-events: none;
        }
        
        .pkl-cta-bg-circle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, var(--accent-400), transparent);
        }
        
        .pkl-cta-bg-circle-1 {
          width: 400px;
          height: 400px;
          top: -200px;
          right: -100px;
        }
        
        .pkl-cta-bg-circle-2 {
          width: 300px;
          height: 300px;
          bottom: -150px;
          left: -50px;
        }
        
        @media (max-width: 768px) {
          .pkl-cta-card {
            padding: var(--foundation-space-8) var(--foundation-space-4);
            margin: 0 var(--foundation-space-2);
          }
          
          .pkl-cta-content {
            max-width: 100%;
            padding: 0;
          }
          
          .pkl-cta-buttons {
            flex-direction: column;
            width: 100%;
            gap: var(--foundation-space-3);
          }
          
          .pkl-cta-buttons button {
            width: 100%;
            min-height: 48px;
          }
          
          .pkl-cta-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--foundation-space-4);
            margin-top: var(--foundation-space-6);
            padding-top: var(--foundation-space-6);
          }
          
          /* Hide decorative elements on mobile to avoid clutter */
          .pkl-cta-bg-decoration {
            display: none;
          }
          
          /* Ensure text is readable on mobile */
          .pkl-cta-heading {
            font-size: clamp(1.5rem, 5vw, 2.25rem) !important;
            line-height: 1.3 !important;
          }
          
          .pkl-cta-description {
            font-size: clamp(1rem, 4vw, 1.125rem) !important;
            line-height: 1.5 !important;
          }
        }
        
        @media (max-width: 480px) {
          .pkl-cta-card {
            padding: var(--foundation-space-6) var(--foundation-space-3);
            margin: 0 var(--foundation-space-1);
          }
          
          .pkl-cta-buttons {
            gap: var(--foundation-space-2);
          }
          
          .pkl-cta-stats {
            grid-template-columns: 1fr;
            gap: var(--foundation-space-3);
          }
        }
      `}</style>

      <Section 
        id={id} 
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop,
          paddingBottom
        }}
      >
        <div className="pkl-cta-outer-container">
          <div className={`pkl-cta-card variant-${variant}`}>
            {/* Background decoration */}
            <div className="pkl-cta-bg-decoration">
              <div className="pkl-cta-bg-circle pkl-cta-bg-circle-1" />
              <div className="pkl-cta-bg-circle pkl-cta-bg-circle-2" />
            </div>
            
            {/* Content */}
            <div className="pkl-cta-content">
              <VStack spacing="lg" align="center">
                {/* Label */}
                {label && (
                  <Typography 
                    variant="label-sm" 
                    color={variant === 'gradient' ? undefined : 'accent'}
                    weight="medium"
                    className="pkl-cta-label"
                  >
                    {label}
                  </Typography>
                )}
                
                {/* Heading */}
                <Typography 
                  variant={textScale === 'lg' ? 'display-md' : textScale === 'sm' ? 'h3' : 'h2'}
                  weight="semibold" 
                  color="primary" 
                  as="h2"
                  className="pkl-cta-heading"
                >
                  {heading}
                </Typography>
                
                {/* Description */}
                <Typography 
                  variant={textScale === 'lg' ? 'body-xl' : textScale === 'sm' ? 'body-sm' : 'body-md'}
                  color="secondary"
                  className="pkl-cta-description"
                >
                  {description}
                </Typography>
                
                {/* Buttons */}
                <div className="pkl-cta-buttons">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handlePrimaryClick}
                  >
                    {primaryButtonText}
                  </Button>
                  
                  {secondaryButtonText && (
                    <Button 
                      variant={variant === 'gradient' ? 'secondary' : 'ghost'}
                      size="lg"
                      onClick={handleSecondaryClick}
                    >
                      {secondaryButtonText}
                    </Button>
                  )}
                </div>
                
                {/* Stats (optional) */}
                {stats && stats.length > 0 && (
                  <div className="pkl-cta-stats">
                    {stats.map((stat, index) => (
                      <div key={index} className="pkl-cta-stat">
                        <div className="pkl-cta-stat-value">
                          {stat.value}
                        </div>
                        <Typography 
                          variant="body-sm" 
                          className="pkl-cta-stat-label"
                        >
                          {stat.label}
                        </Typography>
                      </div>
                    ))}
                  </div>
                )}
              </VStack>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

