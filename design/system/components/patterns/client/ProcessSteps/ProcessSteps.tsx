'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section';
import { Container } from '../../../../../system/layout/frames/container';
import { Card } from '../../../../../system/components/primitives/Card';

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  backgroundImage?: string;
  iconBackground?: 'default' | 'accent';
}

export interface ProcessStepsContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  steps: ProcessStep[];
}

export interface ProcessStepsProps {
  content: ProcessStepsContent;
}

export function ProcessSteps({ content }: ProcessStepsProps) {
  const { title, titleAccent, subtitle, steps } = content;

  return (
    <Section
      id="process-steps"
      style={{
        backgroundColor: 'transparent',
        paddingTop: 'var(--foundation-space-24)',
        paddingBottom: 'var(--foundation-space-16)',
      }}
    >
      <Container maxWidth="xl" align="center">
        <Stack spacing="xl" align="center">
          {/* Header */}
          <div style={{ maxWidth: '900px', width: '100%' }}>
            <Stack spacing="lg" align="center">
              <Typography
                variant="h2"
                weight="bold"
                color="heading"
                style={{
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
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
                          backgroundClip: 'text',
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
                  lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                  textAlign: 'left'
                }}
              >
                {subtitle}
              </Typography>
            </Stack>
          </div>

          {/* Steps Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: 'var(--foundation-space-8)',
              width: '100%',
              maxWidth: '1200px',
            }}
          >
            {steps.map((step) => (
              <Card
                key={step.number}
                variant="elevated"
                padding="lg"
                style={{
                  background: step.backgroundImage
                    ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${step.backgroundImage})`
                    : 'var(--surface-card)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--foundation-radius-lg)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--foundation-space-6)',
                  minHeight: '280px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Step Number */}
                <div
                  style={{
                    width: 'clamp(60px, 8vw, 80px)',
                    height: 'clamp(60px, 8vw, 80px)',
                    borderRadius: '50%',
                    background: step.iconBackground === 'accent' 
                      ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                      : 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: step.iconBackground === 'accent' 
                      ? 'none' 
                      : '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: step.iconBackground === 'accent' 
                      ? 'none' 
                      : 'blur(8px)',
                    boxShadow: step.iconBackground === 'accent' 
                      ? 'var(--foundation-shadow-lg)' 
                      : 'none',
                  }}
                >
                  <Typography
                    variant="h3"
                    weight="bold"
                    color={step.iconBackground === 'accent' ? 'inverse' : 'inverse'}
                  >
                    {step.number}
                  </Typography>
                </div>

                {/* Step Content */}
                <div style={{ flex: 1 }}>
                  <Typography
                    variant="h4"
                    weight="semibold"
                    color={step.backgroundImage ? 'inverse' : 'heading'}
                    style={{
                      marginBottom: 'var(--foundation-space-3)',
                      fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body-lg"
                    color={step.backgroundImage ? 'inverse' : 'secondary'}
                    style={{
                      lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                      opacity: step.backgroundImage ? 0.9 : 1,
                    }}
                  >
                    {step.description}
                  </Typography>
                </div>
              </Card>
            ))}
          </div>
        </Stack>
      </Container>
    </Section>
  );
}