'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section';
import { Container } from '../../../../../system/layout/frames/container';
import { Card } from '../../../../../system/components/primitives/Card';
import { useState, useEffect, useRef } from 'react';

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

const ProcessSteps = ({ content }: ProcessStepsProps) => {
  const { title, titleAccent, subtitle, steps } = content;

  const [activeStep, setActiveStep] = useState(0);
  const ticking = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current && wrapperRef.current) {
        requestAnimationFrame(() => {
          const rect = wrapperRef.current!.getBoundingClientRect();
          const totalHeight = rect.height - window.innerHeight;
          const scrolled = Math.min(Math.max(-rect.top, 0), totalHeight);

          const progress = scrolled / totalHeight;
          const stepIndex = Math.floor(progress * steps.length);

          setActiveStep(Math.min(stepIndex, steps.length - 1));
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  return (
    <div
      ref={wrapperRef}
      style={{ 
        height: `${steps.length * 100}vh`,
        position: 'relative'
      }}
    >
      <Section 
        id="process-steps" 
        height="screen"
        sticky
        style={{
          paddingTop: 'var(--foundation-space-12)',
          paddingBottom: 'var(--foundation-space-12)'
        }}
      >
        <Container 
          maxWidth="2xl" 
          align="center"
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {/* Header */}
          <div style={{
            marginBottom: 'var(--foundation-space-16)',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto var(--foundation-space-16) auto',
            padding: 'var(--foundation-space-8) 0'
          }}>
            <Stack spacing="lg" align="center">
            <Typography
              variant="h2"
              weight="bold"
              color="heading"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                lineHeight: '1.15'
              }}
            >
              {title.split(' ').map((word, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.25em',
                    background: titleAccent && word === titleAccent
                      ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                      : undefined,
                    WebkitBackgroundClip: titleAccent && word === titleAccent ? 'text' : undefined,
                    WebkitTextFillColor: titleAccent && word === titleAccent ? 'transparent' : undefined,
                    backgroundClip: titleAccent && word === titleAccent ? 'text' : undefined
                  }}
                >
                  {word}
                </span>
              ))}
            </Typography>

            <Typography
              variant="body-xl"
              color="secondary"
              style={{
                maxWidth: '650px',
                lineHeight: 'var(--foundation-typography-line-height-relaxed)'
              }}
            >
              {subtitle}
            </Typography>
            </Stack>
          </div>

          {/* Steps */}
          <div style={{
            flex: 1,
            position: 'relative',
            marginTop: 'var(--foundation-space-8)',
            height: '60vh'
          }}>
            {steps.map((step, index) => (
              <Card
                key={index}
                variant="elevated"
                padding="lg"
                radius="lg"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: step.backgroundImage ? `url(${step.backgroundImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: step.backgroundImage 
                    ? 'rgba(255, 255, 255, 0.04)' 
                    : 'var(--surface-card)',
                  backdropFilter: step.backgroundImage ? 'blur(8px)' : undefined,
                  border: step.backgroundImage 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  opacity: activeStep === index ? 1 : 0,
                  transform: activeStep === index 
                    ? 'translateY(0) scale(1)' 
                    : 'translateY(40px) scale(0.96)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                  pointerEvents: activeStep === index ? 'auto' : 'none',
                  zIndex: activeStep === index ? 2 : 1
                }}
              >
                <div style={{ maxWidth: '600px', width: '100%' }}>
                  <Stack spacing="lg" align="center">
                  {/* Icon */}
                  <div
                    style={{
                      width: 'clamp(64px, 8vw, 96px)',
                      height: 'clamp(64px, 8vw, 96px)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: step.iconBackground === 'accent'
                        ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                        : 'rgba(255,255,255,0.2)',
                      border: step.iconBackground === 'accent'
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.3)',
                      backdropFilter: step.iconBackground === 'accent' ? 'none' : 'blur(8px)',
                      boxShadow: step.iconBackground === 'accent'
                        ? 'var(--foundation-shadow-lg)'
                        : undefined
                    }}
                  >
                    <Typography variant="h2" weight="bold" color="inverse">
                      {step.number}
                    </Typography>
                  </div>

                  <Typography
                    variant="h3"
                    weight="bold"
                    color={step.iconBackground === 'accent' ? 'heading' : 'inverse'}
                    style={{
                      fontSize: 'clamp(1.75rem, 5vw, 2.25rem)'
                    }}
                  >
                    {step.title}
                  </Typography>

                  <Typography
                    variant="body-lg"
                    color={step.iconBackground === 'accent' ? 'secondary' : 'inverse'}
                    style={{
                      lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                      opacity: 0.9
                    }}
                  >
                    {step.description}
                  </Typography>
                  </Stack>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
};

export { ProcessSteps };
export type { ProcessStep, ProcessStepsContent, ProcessStepsProps };
