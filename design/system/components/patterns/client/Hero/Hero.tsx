'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export interface HeroContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  ctaText: string;
  ctaHref?: string;
  backgroundImage?: string;
  visualImage?: string;
  visualAlt?: string;
}

export interface HeroProps {
  content: HeroContent;
  onCtaClick?: () => void;
  id?: string;
}

export const Hero: React.FC<HeroProps> = ({ content, onCtaClick, id = "hero" }) => {
  const { 
    title, 
    titleAccent, 
    subtitle, 
    ctaText, 
    ctaHref,
    backgroundImage,
    visualImage,
    visualAlt = "Hero visual"
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
          .hero-text-content {
            order: 2;
            text-align: center;
          }
          .hero-image-content {
            order: 1;
          }
          .hero-text-content h1,
          .hero-text-content p {
            text-align: center !important;
          }
          .hero-cta-cluster {
            display: flex !important;
            justify-content: center !important;
          }
          .hero-text-stack {
            align-items: center !important;
          }
          .hero-grid {
            gap: var(--foundation-space-12) !important;
          }
          .hero-image-content img {
            transform: translateX(20px);
            max-width: 90%;
          }
          @media (min-width: 769px) {
            .hero-text-content {
              order: 1;
              text-align: left;
            }
            .hero-image-content {
              order: 2;
            }
            .hero-text-content h1,
            .hero-text-content p {
              text-align: left !important;
            }
            .hero-cta-cluster {
              justify-content: flex-start !important;
            }
            .hero-text-stack {
              align-items: flex-start !important;
            }
            .hero-grid {
              gap: var(--foundation-space-8) !important;
            }
            .hero-image-content img {
              transform: translateX(40px);
              max-width: 85%;
            }
          }
        `
      }} />
      <Section
      id={id}
      as="section"
      height="full"
      style={{
        background: backgroundImage 
          ? `linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 50%, rgba(51, 65, 85, 0.4) 100%), url(${backgroundImage})`
          : 'linear-gradient(135deg, var(--surface-page) 0%, var(--surface-subtle) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        minHeight: '100vh'
      }}
    >
      {backgroundImage && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.1) 100%)',
          zIndex: 1
        }} />
      )}
      
      <div style={{ 
        maxWidth: 'var(--size-page-max-width)',
        margin: '0 auto',
        padding: '0 var(--foundation-space-6)',
        position: 'relative', 
        zIndex: 2, 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center' 
      }}>
        <Grid 
          columns={2} 
          gap="xl" 
          alignItems="center" 
          collapseOn="tablet"
          minItemWidth="300px"
          className="hero-grid"
        >
          {/* Text content */}
          <div className="hero-text-content">
            <Stack spacing="lg" align="center" className="hero-text-stack">
            <Typography 
              variant="h1" 
              weight="bold" 
              color="primary"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 'var(--foundation-typography-line-height-tight)',
                textAlign: 'left',
                color: 'var(--primary-white)'
              }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="body-xl" 
              weight="semibold"
              style={{
                textAlign: 'left',
                color: 'var(--primary-white)',
                opacity: 0.9
              }}
            >
              {subtitle}
            </Typography>

            <div className="hero-cta-cluster">
              <Button 
                variant="accent" 
                size="lg"
                rightIcon={<ArrowRightIcon style={{ width: '20px', height: '20px', color: 'white' }} />}
                onClick={handleCtaClick}
              >
                {ctaText}
              </Button>
            </div>
            </Stack>
          </div>
          
          {/* Visual image */}
          {visualImage && (
            <div className="hero-image-content">
              <Stack align="center">
              <img 
                src={visualImage} 
                alt={visualAlt}
                style={{
                  width: '100%',
                  maxWidth: 'var(--size-page-narrow-max-width)',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
              </Stack>
            </div>
          )}
        </Grid>
      </div>
    </Section>
    </>
  );
};

Hero.displayName = 'Hero';