'use client';

import './Hero.css';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface HeroContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  ctaText: string;
  ctaHref?: string;
  backgroundImage?: string;
  visualImage?: string;
  visualAlt?: string;
}

interface HeroProps {
  content: HeroContent;
  onCtaClick?: () => void;
}

const Hero = ({ content, onCtaClick }: HeroProps) => {
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
    <section 
      id="hero" 
      className="hero-section" 
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined
      }}
    >
      {/* Overlay för bättre textläsbarhet */}
      <div className="hero-overlay" />
      
      <div className="hero-container">
        <div className="hero-grid">
          {/* Vänster sida - Text content */}
          <div className="hero-content">
            <Stack spacing="xl">
              <Typography 
                variant="display-lg" 
                as="h1" 
                weight="bold"
                color="heading"
                className="hero-title"
              >
                {title.split(' ').map((word, index) => {
                  if (titleAccent && word === titleAccent) {
                    return (
                      <span key={index} className="hero-title-accent">
                        {word}
                      </span>
                    );
                  }
                  return word + ' ';
                })}
              </Typography>
              
              <Typography 
                variant="body-xl" 
                color="body"
                className="hero-subtitle"
              >
                {subtitle}
              </Typography>

              <div className="hero-cta">
                <Button 
                  variant="accent" 
                  size="lg"
                  rightIcon={<Icon color="inverse"><ArrowRightIcon /></Icon>}
                  onClick={handleCtaClick}
                  style={{ color: 'white' }}
                >
                  {ctaText}
                </Button>
              </div>
            </Stack>
          </div>
          
          {/* Höger sida - Visual */}
          {visualImage && (
            <div className="hero-visual">
              <img
                src={visualImage}
                alt={visualAlt}
                className="hero-visual-image"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Hero };
export type { HeroContent, HeroProps };
