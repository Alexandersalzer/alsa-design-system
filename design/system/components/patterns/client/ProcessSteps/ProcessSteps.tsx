'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Card } from '../../../../../system/components/primitives/Card';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';
import { Icon } from '../../../../../system/components/primitives/Icon';
import React from 'react';

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactElement;
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
      as="section"
      height="auto"
      style={{
        paddingTop: 'var(--foundation-space-24)',
        paddingBottom: 'var(--foundation-space-24)',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        position: 'relative'
      }}
    >
      <Container maxWidth="xl" align="center">
        <Stack spacing="xl" align="center">
          {/* Header */}
          <div style={{ maxWidth: 'var(--size-page-content-max-width)', width: '100%' }}>
            <Stack spacing="lg" align="center">
              <Typography
                variant="h2"
                weight="bold"
                color="inverse"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                  lineHeight: 'var(--foundation-typography-line-height-tight)',
                  textAlign: 'center'
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
                color="inverse"
                style={{
                  textAlign: 'center',
                  opacity: 0.9
                }}
              >
                {subtitle}
              </Typography>
            </Stack>
          </div>

          {/* Steps Grid */}
          <Grid 
            columns={3} 
            gap="lg" 
            minItemWidth="300px"
            collapseOn="tablet"
          >
            {steps.map((step, index) => (
              <Card
                key={index}
                variant="elevated"
                padding="lg"
                style={{
                  height: '100%',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--foundation-radius-lg)'
                }}
              >
                <Stack spacing="lg" align="center">
                  {/* Step Icon/Number */}
                  <div style={{
                    background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}>
                    {step.icon ? (
                      <Icon size="xl" color="inverse">
                        {step.icon}
                      </Icon>
                    ) : (
                      <Typography variant="h3" weight="bold" color="inverse">
                        {step.number}
                      </Typography>
                    )}
                  </div>

                  {/* Step Content */}
                  <Stack spacing="md" align="center">
                    <Typography
                      variant="h4"
                      weight="semibold"
                      color="inverse"
                      style={{
                        textAlign: 'center'
                      }}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      variant="body-lg"
                      color="inverse"
                      style={{
                        textAlign: 'center',
                        lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                        opacity: 0.9
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}

ProcessSteps.displayName = 'ProcessSteps';