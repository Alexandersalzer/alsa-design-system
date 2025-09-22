'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
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
    <Section
      id="hero"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Overlay för bättre textläsbarhet */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}
      />
      
      <Container
        maxWidth="xl"
        align="center"
        style={{
          position: 'relative',
          zIndex: 3,
          paddingTop: 'var(--foundation-space-24)',
          paddingBottom: 'var(--foundation-space-24)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 'var(--foundation-space-8)',
            alignItems: 'center',
            minHeight: '80vh'
          }}
        >
          {/* Vänster sida - Text content */}
          <div style={{ maxWidth: '500px' }}>
            <Stack spacing="md">
              <Typography 
                variant="display-lg" 
                as="h1" 
                weight="bold"
                color="heading"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  lineHeight: 'var(--foundation-typography-line-height-tight)',
                  letterSpacing: '-0.02em',
                  textAlign: 'left'
                }}
              >
                {title.split(' ').map((word, index) => {
                  if (titleAccent && word === titleAccent) {
                    return (
                      <span 
                        key={index}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
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
                style={{
                  fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                  lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                  textAlign: 'left'
                }}
              >
                {subtitle}
              </Typography>

              <Button 
                variant="accent" 
                size="lg"
                rightIcon={<Icon color="inverse"><ArrowRightIcon /></Icon>}
                onClick={handleCtaClick}
                style={{ color: 'white' }}
              >
                {ctaText}
              </Button>
            </Stack>
          </div>
          
          {/* Höger sida - Visual */}
          {visualImage && (
            <div
              style={{
                position: 'relative',
                height: 'clamp(300px, 50vh, 500px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 'var(--foundation-space-8)'
              }}
            >
              <img
                src={visualImage}
                alt={visualAlt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

export { Hero };
export type { HeroContent, HeroProps };
