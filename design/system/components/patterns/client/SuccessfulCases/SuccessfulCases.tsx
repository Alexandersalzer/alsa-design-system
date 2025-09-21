'use client';

import { useState, useEffect, ReactElement } from 'react';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Card } from '../../../../../system/components/primitives/Card';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';
import { Icon } from '../../../../../system/components/primitives/Icon';

export interface SuccessCase {
  id: string;
  title: string;
  description: string;
  compensation: string;
  duration: string;
  icon: ReactElement;
}

export interface SuccessfulCasesContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  cases: SuccessCase[];
}

export interface SuccessfulCasesProps {
  id?: string;
  content: SuccessfulCasesContent;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const SuccessfulCases = ({ 
  id = "portfolio", 
  content, 
  className,
  autoPlay = true,
  autoPlayInterval = 5000
}: SuccessfulCasesProps) => {
  const { title, titleAccent, subtitle, cases } = content;
  const [currentCase, setCurrentCase] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentCase(index);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || cases.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentCase((prev) => (prev + 1) % cases.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, cases.length]);

  return (
    <Section 
      id={id} 
      className={className}
      style={{
        backgroundColor: 'transparent',
        paddingTop: 'var(--foundation-space-24)',
        paddingBottom: 'var(--foundation-space-24)'
      }}
    >
      <Container maxWidth="xl" align="center">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 'var(--foundation-space-16)',
            alignItems: 'start',
            marginBottom: 'var(--foundation-space-16)'
          }}
        >
          {/* Left side - Title and Description */}
          <Stack spacing="lg">
            <Typography 
              variant="h2" 
              weight="bold" 
              color="heading"
              style={{
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)'
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
                      {word}
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
                lineHeight: 'var(--foundation-typography-line-height-relaxed)'
              }}
            >
              {subtitle}
            </Typography>
          </Stack>

          {/* Right side - Carousel */}
          <Stack spacing="lg">
            {/* Case Card */}
            <Card 
              variant="elevated"
              padding="lg"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--foundation-radius-xl)',
                textAlign: 'center',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <Stack spacing="lg" align="center">
                {/* Case Icon */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <Icon color="inverse" style={{ width: '40px', height: '40px' }}>
                    {cases[currentCase]?.icon}
                  </Icon>
                </div>
                
                {/* Case Title */}
                <Typography variant="h4" weight="semibold" color="heading">
                  {cases[currentCase]?.title}
                </Typography>
                
                {/* Case Description */}
                <Typography 
                  variant="body-lg" 
                  color="secondary"
                  style={{
                    lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                    maxWidth: '600px'
                  }}
                >
                  {cases[currentCase]?.description}
                </Typography>
                
                {/* Case Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 'var(--foundation-space-8)',
                    maxWidth: '400px',
                    width: '100%'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Typography variant="body-sm" color="secondary" style={{ marginBottom: 'var(--foundation-space-2)' }}>
                      Ersättning
                    </Typography>
                    <Typography variant="h5" weight="bold" color="accent">
                      {cases[currentCase]?.compensation}
                    </Typography>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Typography variant="body-sm" color="secondary" style={{ marginBottom: 'var(--foundation-space-2)' }}>
                      Handläggningstid
                    </Typography>
                    <Typography variant="h6" weight="semibold" color="primary">
                      {cases[currentCase]?.duration}
                    </Typography>
                  </div>
                </div>
              </Stack>
            </Card>

            {/* Navigation Dots */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--foundation-space-4)'
              }}
            >
              {cases.map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleDotClick(index)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: index === currentCase ? 'var(--accent-500)' : 'rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: index === currentCase ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
};

export { SuccessfulCases };
