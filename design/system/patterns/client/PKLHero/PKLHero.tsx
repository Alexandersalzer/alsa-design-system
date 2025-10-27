'use client';

import React from 'react';
import { Typography } from '../../../../system/components';
import { Button } from '../../../../system/components';
import { Section } from '../../../components'
import { VStack } from '../../../components/layout';


export interface PKLHeroContent {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonHref?: string;
  secondaryButtonText: string;
  secondaryButtonHref?: string;
  heroImage?: string;
  imageAlt?: string;
}

export interface PKLHeroProps {
  content: PKLHeroContent;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  id?: string;
}

export const PKLHero: React.FC<PKLHeroProps> = ({ 
  content, 
  onPrimaryClick, 
  onSecondaryClick, 
  id = "pkl-hero" 
}) => {
  const { 
    title, 
    subtitle, 
    primaryButtonText,
    primaryButtonHref,
    secondaryButtonText,
    secondaryButtonHref,
    heroImage,
    imageAlt = "PKL Consulting"
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
      <style dangerouslySetInnerHTML={{
        __html: `
          .pkl-hero-container {
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
            position: relative;
          }
          
          .pkl-hero-content {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-12);
            min-height: 100vh;
            padding: var(--foundation-space-8) 0;
          }
          
          .pkl-hero-image-wrapper {
            position: relative;
            width: 100%;
            height: 400px;
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-lg);
          }
          
          .pkl-hero-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
          
          .pkl-hero-image-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50%;
            background: linear-gradient(to top, rgba(255, 255, 255, 0.95), transparent);
            pointer-events: none;
          }
          
          .pkl-hero-text-section {
            max-width: var(--size-page-content-max-width);
            margin: 0 auto;
            text-align: center;
          }
          
          .pkl-hero-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            line-height: var(--foundation-typography-line-height-tight);
            font-weight: var(--font-weight-semibold);
            color: var(--text-primary);
            margin: 0;
          }
          
          .pkl-hero-subtitle {
            font-size: clamp(1.125rem, 2vw, 1.5rem);
            line-height: var(--foundation-typography-line-height-relaxed);
            color: var(--text-secondary);
            max-width: var(--size-page-narrow-max-width);
            margin: 0 auto;
          }
          
          .pkl-hero-buttons {
            display: flex;
            gap: var(--foundation-space-4);
            justify-content: center;
            flex-wrap: wrap;
          }
          
          @media (min-width: 769px) {
            .pkl-hero-content {
              gap: var(--foundation-space-16);
              padding: var(--foundation-space-12) 0;
            }
            
            .pkl-hero-image-wrapper {
              height: 500px;
            }
            
            .pkl-hero-text-section {
              text-align: left;
              margin: 0;
            }
            
            .pkl-hero-subtitle {
              margin: 0;
            }
            
            .pkl-hero-buttons {
              justify-content: flex-start;
            }
          }
          
          @media (min-width: 1024px) {
            .pkl-hero-image-wrapper {
              height: 600px;
            }
          }
        `
      }} />
      
      <Section
        id={id}
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          minHeight: '100vh'
        }}
      >
        <div className="pkl-hero-container">
          <div className="pkl-hero-content">
            {/* Bildområde med gradient overlay */}
            {heroImage && (
              <div className="pkl-hero-image-wrapper">
                <img 
                  src={heroImage} 
                  alt={imageAlt}
                  className="pkl-hero-image"
                />
                <div className="pkl-hero-image-overlay" />
              </div>
            )}
            
            {/* Textinnehåll */}
            <div className="pkl-hero-text-section">
              <VStack spacing="lg">
                {/* Titel */}
                <Typography 
                  variant="display-lg" 
                  weight="semibold"
                  color="primary"
                  className="pkl-hero-title"
                  as="h1"
                >
                  {title}
                </Typography>
                
                {/* Brödtext */}
                <Typography 
                  variant="body-lg"
                  color="secondary"
                  className="pkl-hero-subtitle"
                >
                  {subtitle}
                </Typography>

                {/* Knappar */}
                <div className="pkl-hero-buttons">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handlePrimaryClick}
                  >
                    {primaryButtonText}
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handleSecondaryClick}
                  >
                    {secondaryButtonText}
                  </Button>
                </div>
              </VStack>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

PKLHero.displayName = 'PKLHero';
