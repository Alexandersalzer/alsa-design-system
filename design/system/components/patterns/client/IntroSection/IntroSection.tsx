'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';

// ===== TYPE DEFINITIONS =====

export interface TrustMetric {
  number: string;
  label: string;
}

export interface IntroSectionContent {
  heading: string;
  description: string;
  image?: string;
  imageAlt?: string;
  metrics?: TrustMetric[];
}

export interface IntroSectionProps {
  content: IntroSectionContent;
  id?: string;
  
  // Layout controls
  paddingTop?: string;
  paddingBottom?: string;
  
  // Typography controls
  textScale?: 'sm' | 'md' | 'lg' | 'xl';
  
  // Background controls
  backgroundColor?: string;
  
  // Visual controls
  showImage?: boolean;
  showMetrics?: boolean;
  reverseLayout?: boolean; // Text on right, image on left
}

// ===== MAIN COMPONENT =====

export const IntroSection: React.FC<IntroSectionProps> = ({
  content,
  id = "intro-section",
  
  // Layout
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  
  // Typography
  textScale = 'md',
  
  // Background
  backgroundColor = 'var(--surface-page)',
  
  // Visual
  showImage = true,
  showMetrics = true,
  reverseLayout = false
}) => {
  const {
    heading,
    description,
    image,
    imageAlt,
    metrics = []
  } = content;

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
      case 'lg': return 'body-lg';
      case 'md': return 'body-md';
      case 'sm': return 'body-sm';
      default: return 'body-md';
    }
  };

  return (
    <>
      <style>{`
        .intro-section-container {
          max-width: var(--size-page-max-width);
          margin: 0 auto;
          padding: 0 var(--foundation-space-6);
        }
        
        .intro-section-grid {
          display: grid;
          grid-template-columns: ${reverseLayout ? '1fr 1.2fr' : '1.2fr 1fr'};
          gap: var(--foundation-space-12);
          align-items: center;
        }
        
        .intro-section-text {
          display: flex;
          flex-direction: column;
          gap: var(--foundation-space-6);
          order: ${reverseLayout ? '2' : '1'};
        }
        
        .intro-section-visual {
          display: flex;
          flex-direction: column;
          gap: var(--foundation-space-8);
          order: ${reverseLayout ? '1' : '2'};
        }
        
        .intro-section-image {
          width: 100%;
          height: auto;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-light);
          object-fit: cover;
          max-height: 400px;
        }
        
        .intro-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: var(--foundation-space-6);
        }
        
        .metric-item {
          text-align: center;
          padding: var(--foundation-space-4);
          background: var(--surface-subtle);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
        }
        
        .metric-number {
          font-size: ${textScale === 'xl' || textScale === 'lg' ? 'clamp(2rem, 4vw, 3rem)' : 'clamp(1.5rem, 3vw, 2rem)'};
          font-weight: var(--font-weight-bold);
          color: var(--accent-500);
          line-height: 1;
          margin-bottom: var(--foundation-space-2);
        }
        
        .metric-label {
          font-size: var(--foundation-typography-size-sm);
          color: var(--text-secondary);
          line-height: 1.4;
        }
        
        @media (max-width: 968px) {
          .intro-section-grid {
            grid-template-columns: 1fr;
            gap: var(--foundation-space-8);
          }
          
          .intro-section-text {
            order: 1;
          }
          
          .intro-section-visual {
            order: 2;
          }
          
          .intro-section-image {
            max-height: 300px;
          }
          
          .intro-metrics {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: var(--foundation-space-4);
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
          <div className="intro-section-grid">
            {/* Text Side */}
            <div className="intro-section-text">
              <Typography
                variant={getHeadingVariant()}
                weight="semibold"
                color="primary"
                as="h2"
              >
                {heading}
              </Typography>
              
              <Typography
                variant={getDescriptionVariant()}
                color="secondary"
                style={{ lineHeight: '1.7' }}
              >
                {description}
              </Typography>
              
              {/* Metrics under text */}
              {showMetrics && metrics && metrics.length > 0 && (
                <div className="intro-metrics">
                  {metrics.map((metric, index) => (
                    <div key={index} className="metric-item">
                      <div className="metric-number">{metric.number}</div>
                      <div className="metric-label">{metric.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Visual Side */}
            {showImage && image && (
              <div className="intro-section-visual">
                <img
                  src={image}
                  alt={imageAlt || 'Company visual'}
                  className="intro-section-image"
                />
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
};

IntroSection.displayName = 'IntroSection';

