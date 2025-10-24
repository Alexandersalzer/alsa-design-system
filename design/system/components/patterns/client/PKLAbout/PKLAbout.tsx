// ===============================================
// design/system/components/patterns/client/PKLAbout/PKLAbout.tsx
// PKL ABOUT SECTION - Modern fintech-inspired about section
// ===============================================

'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { VStack, Section } from '../../../layout';

// ===== TYPE DEFINITIONS =====

export interface PKLAboutStat {
  value: string;
  label: string;
}

export interface PKLAboutContent {
  label?: string;
  heading: string;
  description: string;
  stats: PKLAboutStat[];
  ctaText?: string;
  ctaHref?: string;
  image?: string;
}

export interface PKLAboutProps {
  content: PKLAboutContent;
  onCtaClick?: () => void;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

// ===== MAIN PKL ABOUT COMPONENT =====

export const PKLAbout: React.FC<PKLAboutProps> = ({ 
  content, 
  onCtaClick,
  id = "pkl-about",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { 
    label,
    heading, 
    description,
    stats,
    ctaText,
    ctaHref,
    image
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
          .pkl-about-container {
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
          }
          
          .pkl-about-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--foundation-space-16);
            align-items: center;
          }
          
          .pkl-about-content {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-8);
          }
          
          .pkl-about-text {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-6);
          }
          
          .pkl-about-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--foundation-space-8);
            padding: var(--foundation-space-8);
            background: var(--surface-subtle);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-light);
          }
          
          .pkl-about-stat {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-2);
          }
          
          .pkl-about-stat-value {
            font-size: ${textScale === 'lg' ? 'var(--foundation-typography-size-5xl)' : textScale === 'sm' ? 'var(--foundation-typography-size-3xl)' : 'var(--foundation-typography-size-4xl)'};
            font-weight: var(--font-weight-bold);
            line-height: 1;
            background: linear-gradient(135deg, var(--accent-500) 0%, var(--accent-400) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .pkl-about-stat-label {
            color: var(--text-secondary);
            font-size: ${textScale === 'lg' ? 'var(--foundation-typography-size-sm)' : 'var(--foundation-typography-size-xs)'};
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: var(--font-weight-medium);
          }
          
          .pkl-about-image-container {
            position: relative;
            height: 100%;
            min-height: 500px;
          }
          
          .pkl-about-image-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: var(--radius-2xl);
            overflow: hidden;
          }
          
          .pkl-about-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-xl);
            border: 1px solid var(--border-medium);
          }
          
          /* Decorative gradient overlay on image */
          .pkl-about-image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.15) 0%,
              transparent 50%
            );
            border-radius: var(--radius-2xl);
            pointer-events: none;
          }
          
          /* Decorative accent element */
          .pkl-about-accent {
            position: absolute;
            top: -20px;
            right: -20px;
            width: 200px;
            height: 200px;
            background: radial-gradient(
              circle at center,
              rgba(59, 130, 246, 0.2) 0%,
              transparent 70%
            );
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
          }
          
          @media (max-width: 1024px) {
            .pkl-about-grid {
              grid-template-columns: 1fr;
              gap: var(--foundation-space-12);
            }
            
            .pkl-about-image-container {
              min-height: 400px;
              order: -1;
            }
            
            .pkl-about-stats {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (max-width: 640px) {
            .pkl-about-stats {
              grid-template-columns: 1fr;
              gap: var(--foundation-space-6);
            }
            
            .pkl-about-image-container {
              min-height: 300px;
            }
            
            .pkl-about-accent {
              width: 150px;
              height: 150px;
              top: -10px;
              right: -10px;
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
        <div className="pkl-about-container">
          <div className="pkl-about-grid">
            {/* Left Side - Content */}
            <div className="pkl-about-content">
              <div className="pkl-about-text">
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
                  style={{ lineHeight: 1.7 }}
                >
                  {description}
                </Typography>
                
                {ctaText && (
                  <div style={{ marginTop: 'var(--foundation-space-4)' }}>
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleCtaClick}
                    >
                      {ctaText}
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Stats Grid */}
              <div className="pkl-about-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="pkl-about-stat">
                    <div className="pkl-about-stat-value">
                      {stat.value}
                    </div>
                    <div className="pkl-about-stat-label">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Side - Image */}
            {image && (
              <div className="pkl-about-image-container">
                <div className="pkl-about-accent" />
                <div className="pkl-about-image-wrapper">
                  <img 
                    src={image} 
                    alt="PKL Consulting"
                    className="pkl-about-image"
                  />
                  <div className="pkl-about-image-overlay" />
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
};

PKLAbout.displayName = 'PKLAbout';

