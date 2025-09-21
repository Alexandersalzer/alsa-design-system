'use client';

import { useEffect, useRef, useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Container } from '../../../../../system/layout/frames/container';
import { Card } from '../../../../../system/components/primitives/Card';

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  backgroundImage?: string;
  iconBackground?: 'default' | 'accent';
}

interface ProcessStepsContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  steps: ProcessStep[];
}

interface ProcessStepsProps {
  content: ProcessStepsContent;
}

export function ProcessSteps({ content }: ProcessStepsProps) {
  const { title, titleAccent, subtitle, steps } = content;

  const [activeStep, setActiveStep] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), totalHeight);

      const progress = scrolled / totalHeight;
      const stepIndex = Math.floor(progress * steps.length);

      setActiveStep(Math.min(stepIndex, steps.length - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  return (
    <div
      ref={wrapperRef}
      style={{
        height: `${steps.length * 100}vh`,
        position: 'relative',
      }}
    >
      {/* Sticky container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--foundation-space-12) 0',
        }}
      >
        <Container maxWidth="2xl" align="center">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Typography variant="h2" weight="bold">
              {title}
            </Typography>
            <Typography variant="body-xl" color="secondary">
              {subtitle}
            </Typography>
          </div>

          {/* Cards */}
          <div style={{ position: 'relative', height: '60vh' }}>
            {steps.map((step, index) => (
              <Card
                key={index}
                padding="lg"
                radius="lg"
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  opacity: activeStep === index ? 1 : 0,
                  transform:
                    activeStep === index
                      ? 'translateY(0) scale(1)'
                      : 'translateY(40px) scale(0.96)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
              >
                <Stack spacing="lg" align="center">
                  <Typography variant="h2">{step.number}</Typography>
                  <Typography variant="h3">{step.title}</Typography>
                  <Typography variant="body-lg" color="secondary">
                    {step.description}
                  </Typography>
                </Stack>
              </Card>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}