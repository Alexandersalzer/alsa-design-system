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
            max-width: var(--size-page-narrow-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
            text-align: center;
          }
          
          .why-choose-us-header {
            margin-bottom: var(--foundation-space-12);
          }
          
          .benefits-list {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-4);
            margin-bottom: var(--foundation-space-12);
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .benefit-item {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-4);
            padding: var(--foundation-space-4);
            background: var(--surface-subtle);
            border-radius: var(--radius-md);
            transition: all 0.2s ease;
          }
          
          .benefit-item:hover {
            background: var(--surface-muted);
            transform: translateX(4px);
          }
          
          .benefit-icon {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
            color: var(--accent-500);
          }
          
          .benefit-text {
            text-align: left;
            flex: 1;
          }
          
          .cta-section {
            display: flex;
            justify-content: center;
          }
          
          @media (max-width: 768px) {
            .why-choose-us-container {
              max-width: 100%;
            }
            
            .benefit-item {
              padding: var(--foundation-space-3);
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
          {/* Header */}
          <div className="why-choose-us-header">
            <Stack spacing="md" align="center">
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
          
          {/* Simple Benefits List */}
          <div className="benefits-list">
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
      </Section>
    </>
  );
};

WhyChooseUs.displayName = 'WhyChooseUs';
