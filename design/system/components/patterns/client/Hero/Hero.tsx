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
import './Hero.css';

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
    <Section
      id={id}
      as="section"
      height="full"
      className={`hero-section ${backgroundImage ? 'hero-section--with-bg' : ''}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {backgroundImage && <div className="hero-background-overlay" />}
      
      <Container maxWidth="xl" align="center" height="full" className="hero-container">
        <Grid columns={2} gap="xl" alignItems="center" collapseOn="tablet" className="hero-grid">
          {/* Text först i DOM på desktop */}
          <Stack spacing="lg" align="start" className="hero-text-content">
            <Typography variant="display-lg" as="h1" weight="bold" color="heading">
              {title} {titleAccent && <span className="hero-title-accent">{titleAccent}</span>}
            </Typography>
            
            <Typography variant="body-xl" color="body">
              {subtitle}
            </Typography>

            <Cluster className="hero-cta-cluster">
              <Button 
                variant="accent" 
                size="lg"
                rightIcon={<Icon color="inverse"><ArrowRightIcon /></Icon>}
                onClick={handleCtaClick}
              >
                {ctaText}
              </Button>
            </Cluster>
          </Stack>
          
          {/* Bilden höger på desktop, ovanpå på mobil */}
          {visualImage && (
            <div className="hero-visual">
              <img src={visualImage} alt={visualAlt} className="hero-visual-image" />
            </div>
          )}
        </Grid>
      </Container>
    </Section>
  );
};

Hero.displayName = 'Hero';