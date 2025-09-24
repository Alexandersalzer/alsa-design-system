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
            display: flex;
            justify-content: center;
          }
          .hero-grid {
            gap: var(--foundation-space-12) !important;
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
              justify-content: flex-start;
            }
            .hero-grid {
              gap: var(--foundation-space-8) !important;
            }
          }
        `
      }} />
      <Section
      id={id}
      as="section"
      height="full"
      style={{
        background: backgroundImage ? `url(${backgroundImage})` : 'var(--surface-page)',
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
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }} />
      )}
      
      <Container maxWidth="xl" align="center" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
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
            <Stack spacing="lg" align="start">
            <Typography 
              variant="h1" 
              weight="bold" 
              color="heading"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 'var(--foundation-typography-line-height-tight)',
                textAlign: 'left'
              }}
            >
              {title.split(' ').map((word, index) => {
                if (titleAccent && word === titleAccent) {
                  return (
                    <span 
                      key={index} 
                      style={{
                        background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-400) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      {word}{' '}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </Typography>
            
            <Typography 
              variant="body-xl" 
              color="secondary"
              style={{
                textAlign: 'left'
              }}
            >
              {subtitle}
            </Typography>

            <div className="hero-cta-cluster">
              <Button 
                variant="accent" 
                size="lg"
                rightIcon={<Icon color="inverse"><ArrowRightIcon /></Icon>}
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
                  maxWidth: 'clamp(300px, 40vw, 500px)',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
              </Stack>
            </div>
          )}
        </Grid>
      </Container>
    </Section>
    </>
  );
};

Hero.displayName = 'Hero';