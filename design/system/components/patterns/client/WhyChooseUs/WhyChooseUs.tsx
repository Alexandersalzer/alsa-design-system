'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';

export interface Benefit {
  title: string;
  subtitle: string;
  number: string;
}

export interface WhyChooseUsContent {
  heading: string;
  description: string;
  approachLabel: string;
  approachTitle: string;
  approachDescription: string;
  ctaText: string;
  ctaHref?: string;
  processImage?: string;
  performanceText: string;
  performanceNumber: string;
  benefits: Benefit[];
}

export interface WhyChooseUsProps {
  content: WhyChooseUsContent;
  onCtaClick?: () => void;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ 
  content, 
  onCtaClick,
  id = "why-choose-us",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)'
}) => {
  const { 
    heading, 
    description, 
    approachLabel,
    approachTitle,
    approachDescription,
    ctaText,
    ctaHref,
    processImage,
    performanceText,
    performanceNumber,
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
          
          .why-choose-us-header {
            max-width: var(--size-page-content-max-width);
            margin-bottom: var(--foundation-space-12);
          }
          
          .process-card {
            background: var(--surface-muted);
            border-radius: var(--radius-lg);
            padding: var(--foundation-space-8);
            margin-bottom: var(--foundation-space-12);
          }
          
          .process-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-light);
          }
          
          .performance-card {
            background: var(--surface-card);
            border-radius: var(--radius-lg);
            padding: var(--foundation-space-8);
            text-align: center;
            margin-bottom: var(--foundation-space-10);
            border: 1px solid var(--border-medium);
          }
          
          .performance-number {
            font-size: clamp(3rem, 6vw, 4.5rem);
            font-weight: var(--font-weight-bold);
            line-height: 1;
            color: var(--primary-500);
            margin-bottom: var(--foundation-space-3);
          }
          
          .benefits-grid {
            gap: var(--foundation-space-6);
          }
          
          .benefit-card {
            padding: var(--foundation-space-6) 0;
            border-top: 1px solid var(--border-light);
            position: relative;
            padding-top: var(--foundation-space-8);
          }
          
          .benefit-card:first-child {
            border-top: none;
            padding-top: var(--foundation-space-6);
          }
          
          .benefit-number {
            position: absolute;
            top: var(--foundation-space-2);
            right: 0;
            font-size: var(--foundation-typography-size-sm);
            font-weight: var(--font-weight-medium);
            color: var(--text-tertiary);
            background: var(--surface-subtle);
            border-radius: var(--radius-full);
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .benefit-title {
            margin-bottom: var(--foundation-space-2);
            color: var(--text-primary);
          }
          
          .benefit-subtitle {
            color: var(--text-secondary);
          }
          
          .cta-button {
            margin-top: var(--foundation-space-4);
          }
          
          @media (max-width: 768px) {
            .benefits-grid {
              grid-template-columns: 1fr;
              gap: 0;
            }
            
            .benefit-card {
              padding: var(--foundation-space-6) 0;
              border-top: 1px solid var(--border-light);
            }
            
            .benefit-card:first-child {
              border-top: none;
            }
            
            .process-card {
              padding: var(--foundation-space-6);
            }
            
            .performance-card {
              padding: var(--foundation-space-6);
            }
          }
          
          @media (min-width: 769px) and (max-width: 1024px) {
            .benefits-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1025px) {
            .benefits-grid {
              grid-template-columns: repeat(3, 1fr);
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
          {/* 1️⃣ Header Area */}
          <div className="why-choose-us-header">
            <Stack spacing="lg">
              <Typography 
                variant="h2" 
                weight="semibold"
                color="primary"
                as="h2"
              >
                {heading}
              </Typography>
              
              <Typography 
                variant="body-md"
                color="secondary"
                style={{
                  maxWidth: 'var(--size-page-narrow-max-width)'
                }}
              >
                {description}
              </Typography>
            </Stack>
          </div>
          
          {/* 2️⃣ Feature Block / Process Card */}
          <div className="process-card">
            <Grid 
              columns={2} 
              gap="xl" 
              alignItems="center"
              collapseOn="tablet"
              minItemWidth="300px"
            >
              {/* Left Side - Text Content */}
              <Stack spacing="md">
                <Typography 
                  variant="label-sm" 
                  color="primary"
                  weight="medium"
                >
                  {approachLabel}
                </Typography>
                
                <Typography 
                  variant="h3" 
                  weight="semibold"
                  color="primary"
                  as="h3"
                >
                  {approachTitle}
                </Typography>
                
                <Typography 
                  variant="body-sm"
                  color="secondary"
                >
                  {approachDescription}
                </Typography>
                
                <Button 
                  variant="ghost" 
                  size="md"
                  onClick={handleCtaClick}
                  className="cta-button"
                  style={{
                    alignSelf: 'flex-start',
                    padding: 0,
                    height: 'auto',
                    color: 'var(--primary-500)',
                    textDecoration: 'underline'
                  }}
                >
                  {ctaText}
                </Button>
              </Stack>
              
              {/* Right Side - Image */}
              {processImage && (
                <div>
                  <img 
                    src={processImage} 
                    alt="PKL Consulting Process"
                    className="process-image"
                  />
                </div>
              )}
            </Grid>
          </div>
          
          {/* 3️⃣ Performance Metrics + Benefits */}
          <div>
            {/* Performance Card */}
            <div className="performance-card">
              <div className="performance-number">
                {performanceNumber}
              </div>
              <Typography 
                variant="display-sm"
                color="primary"
                weight="semibold"
              >
                {performanceText}
              </Typography>
            </div>
            
            {/* Benefits Grid */}
            <Grid 
              columns={3} 
              gap="lg" 
              collapseOn="tablet"
              minItemWidth="250px"
              className="benefits-grid"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <div className="benefit-number">
                    {benefit.number}
                  </div>
                  
                  <Typography 
                    variant="h4" 
                    weight="semibold"
                    className="benefit-title"
                    as="h4"
                  >
                    {benefit.title}
                  </Typography>
                  
                  <Typography 
                    variant="body-sm"
                    color="secondary"
                    className="benefit-subtitle"
                  >
                    {benefit.subtitle}
                  </Typography>
                </div>
              ))}
            </Grid>
          </div>
        </div>
      </Section>
    </>
  );
};

WhyChooseUs.displayName = 'WhyChooseUs';
