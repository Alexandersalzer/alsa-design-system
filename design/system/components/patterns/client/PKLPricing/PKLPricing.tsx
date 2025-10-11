// ===============================================
// design/system/components/patterns/client/PKLPricing/PKLPricing.tsx
// PKL PRICING SECTION - Pricing tiers with features
// ===============================================

'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { CheckIcon } from '@heroicons/react/24/outline';

// ===== TYPE DEFINITIONS =====

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  buttonHref?: string;
}

export interface PKLPricingContent {
  label?: string;
  heading: string;
  description: string;
  tiers: PricingTier[];
  footnote?: string;
}

export interface PKLPricingProps {
  content: PKLPricingContent;
  onButtonClick?: (tierName: string) => void;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

// ===== MAIN PKL PRICING COMPONENT =====

export const PKLPricing: React.FC<PKLPricingProps> = ({
  content,
  onButtonClick,
  id = "pkl-pricing",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { label, heading, description, tiers, footnote } = content;

  const handleButtonClick = (tierName: string, href?: string) => {
    if (onButtonClick) {
      onButtonClick(tierName);
    } else if (href) {
      window.location.href = href;
    }
  };

  return (
    <>
      <style>{`
        .pkl-pricing-outer-container {
          max-width: var(--size-page-max-width);
          margin: 0 auto;
          padding: 0 var(--foundation-space-6);
        }
        
        .pkl-pricing-header {
          text-align: center;
          max-width: var(--size-page-content-max-width);
          margin: 0 auto var(--foundation-space-12);
        }
        
        .pkl-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--foundation-space-8);
          margin-bottom: var(--foundation-space-8);
        }
        
        .pkl-pricing-card {
          background: var(--surface-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: var(--foundation-space-10);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .pkl-pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }
        
        .pkl-pricing-card.highlighted {
          border-color: var(--accent-500);
          border-width: 2px;
          box-shadow: var(--shadow-lg);
        }
        
        .pkl-pricing-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--accent-500);
          color: white;
          padding: var(--foundation-space-2) var(--foundation-space-4);
          border-radius: var(--radius-full);
          font-size: var(--foundation-typography-size-xs);
          font-weight: var(--font-weight-semibold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .pkl-pricing-card-header {
          text-align: center;
          margin-bottom: var(--foundation-space-6);
          padding-bottom: var(--foundation-space-6);
          border-bottom: 1px solid var(--border-light);
        }
        
        .pkl-pricing-name {
          color: var(--text-primary);
          margin-bottom: var(--foundation-space-2);
        }
        
        .pkl-pricing-price-wrapper {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: var(--foundation-space-2);
          margin-bottom: var(--foundation-space-2);
        }
        
        .pkl-pricing-price {
          font-size: ${textScale === 'lg' ? 'clamp(3rem, 5vw, 4rem)' : 'clamp(2.5rem, 4vw, 3.5rem)'};
          font-weight: var(--font-weight-bold);
          line-height: 1;
          color: var(--accent-500);
        }
        
        .pkl-pricing-period {
          color: var(--text-secondary);
          font-size: var(--foundation-typography-size-md);
        }
        
        .pkl-pricing-description {
          color: var(--text-secondary);
          text-align: center;
        }
        
        .pkl-pricing-features {
          list-style: none;
          padding: 0;
          margin: var(--foundation-space-6) 0;
          flex: 1;
        }
        
        .pkl-pricing-feature {
          display: flex;
          align-items: flex-start;
          gap: var(--foundation-space-3);
          margin-bottom: var(--foundation-space-3);
        }
        
        .pkl-pricing-feature-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: var(--accent-500);
          margin-top: 2px;
        }
        
        .pkl-pricing-feature-text {
          color: var(--text-primary);
          font-size: var(--foundation-typography-size-md);
          line-height: 1.5;
        }
        
        .pkl-pricing-button-wrapper {
          margin-top: auto;
        }
        
        .pkl-pricing-footnote {
          text-align: center;
          color: var(--text-secondary);
          font-size: var(--foundation-typography-size-sm);
          font-style: italic;
          margin-top: var(--foundation-space-8);
          max-width: var(--size-page-narrow-max-width);
          margin-left: auto;
          margin-right: auto;
        }
        
        @media (max-width: 1024px) {
          .pkl-pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .pkl-pricing-grid {
            grid-template-columns: 1fr;
            gap: var(--foundation-space-6);
          }
          
          .pkl-pricing-card {
            padding: var(--foundation-space-8);
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
        <div className="pkl-pricing-outer-container">
          {/* Header */}
          <div className="pkl-pricing-header">
            <Stack spacing="md" align="center">
              {label && (
                <Typography 
                  variant="label-sm" 
                  color="accent"
                  weight="medium"
                >
                  {label}
                </Typography>
              )}
              
              <Typography 
                variant={textScale === 'lg' ? 'display-md' : textScale === 'sm' ? 'h3' : 'h2'}
                weight="semibold"
                color="primary"
                as="h2"
              >
                {heading}
              </Typography>
              
              <Typography 
                variant={textScale === 'lg' ? 'body-xl' : textScale === 'sm' ? 'body-sm' : 'body-md'}
                color="secondary"
                style={{
                  maxWidth: 'var(--size-page-narrow-max-width)'
                }}
              >
                {description}
              </Typography>
            </Stack>
          </div>

          {/* Pricing Grid */}
          <div className="pkl-pricing-grid">
            {tiers.map((tier, index) => (
              <div 
                key={index} 
                className={`pkl-pricing-card ${tier.highlighted ? 'highlighted' : ''}`}
              >
                {tier.highlighted && (
                  <div className="pkl-pricing-badge">
                    Populärast
                  </div>
                )}
                
                {/* Card Header */}
                <div className="pkl-pricing-card-header">
                  <Typography 
                    variant={textScale === 'lg' ? 'h3' : 'h4'}
                    weight="semibold"
                    className="pkl-pricing-name"
                    as="h3"
                  >
                    {tier.name}
                  </Typography>
                  
                  <div className="pkl-pricing-price-wrapper">
                    <Typography as="span" className="pkl-pricing-price">
                      {tier.price}
                    </Typography>
                    {tier.period && (
                      <Typography as="span" className="pkl-pricing-period">
                        {tier.period}
                      </Typography>
                    )}
                  </div>
                  
                  <Typography 
                    variant="body-sm"
                    color="secondary"
                    className="pkl-pricing-description"
                  >
                    {tier.description}
                  </Typography>
                </div>
                
                {/* Features List */}
                <ul className="pkl-pricing-features">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="pkl-pricing-feature">
                      <CheckIcon className="pkl-pricing-feature-icon" />
                      <Typography as="span" className="pkl-pricing-feature-text">
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <div className="pkl-pricing-button-wrapper">
                  <Button
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    size="lg"
                    onClick={() => handleButtonClick(tier.name, tier.buttonHref)}
                    href={tier.buttonHref}
                    style={{ width: '100%' }}
                  >
                    {tier.buttonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footnote */}
          {footnote && (
            <Typography as="p" className="pkl-pricing-footnote">
              {footnote}
            </Typography>
          )}
        </div>
      </Section>
    </>
  );
};

