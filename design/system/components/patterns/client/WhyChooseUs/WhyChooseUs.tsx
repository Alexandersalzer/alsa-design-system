'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';

export interface Benefit {
  title: string;
  icon?: React.ReactNode;
}

export interface WhyChooseUsContent {
  heading: string;
  description: string;
  ctaText: string;
  ctaHref?: string;
  benefits: Benefit[];
}

export interface WhyChooseUsProps {
  content: WhyChooseUsContent;
  onCtaClick?: () => void;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ 
  content, 
  onCtaClick,
  id = "why-choose-us",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { 
    heading, 
    description, 
    ctaText,
    ctaHref,
    benefits
  } = content;

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaHref) {
      window.location.href = ctaHref;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .why-choose-us-container {
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
          }
          
          .why-choose-us-content {
            max-width: 1000px;
            margin: 0 auto;
          }
          
          .why-choose-us-header {
            text-align: center;
            margin-bottom: var(--foundation-space-16);
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .benefits-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--foundation-space-6);
            margin-bottom: var(--foundation-space-12);
          }
          
          .benefit-item {
            display: flex;
            align-items: flex-start;
            gap: var(--foundation-space-4);
            padding: var(--foundation-space-6);
            background: var(--surface-subtle);
            border-radius: var(--radius-lg);
            transition: all 0.3s ease;
            border: 1px solid transparent;
          }
          
          .benefit-item:hover {
            background: var(--surface-muted);
            border-color: var(--border-medium);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
          }
          
          .benefit-icon {
            width: 28px;
            height: 28px;
            flex-shrink: 0;
            color: var(--accent-500);
            margin-top: 2px;
          }
          
          .benefit-text {
            text-align: left;
            flex: 1;
            line-height: 1.6;
          }
          
          .cta-section {
            display: flex;
            justify-content: center;
            margin-top: var(--foundation-space-8);
          }
          
          @media (max-width: 768px) {
            .benefits-grid {
              grid-template-columns: 1fr;
              gap: var(--foundation-space-4);
            }
            
            .benefit-item {
              padding: var(--foundation-space-5);
            }
            
            .benefit-icon {
              width: 24px;
              height: 24px;
            }
          }
        `
      }} />
      
      <Section
        id={id}
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop,
          paddingBottom
        }}
      >
        <div className="why-choose-us-container">
          <div className="why-choose-us-content">
            {/* Header */}
            <div className="why-choose-us-header">
              <Stack spacing="lg" align="center">
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
                >
                  {description}
                </Typography>
              </Stack>
            </div>
            
            {/* Benefits Grid */}
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  {benefit.icon && (
                    <div className="benefit-icon">
                      {React.cloneElement(benefit.icon as React.ReactElement<any>, {
                        style: { width: '100%', height: '100%', strokeWidth: 2 }
                      })}
                    </div>
                  )}
                  <Typography 
                    variant={textScale === 'lg' ? 'body-lg' : 'body-md'}
                    weight="medium"
                    className="benefit-text"
                    color="primary"
                  >
                    {benefit.title}
                  </Typography>
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="cta-section">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleCtaClick}
              >
                {ctaText}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

WhyChooseUs.displayName = 'WhyChooseUs';
