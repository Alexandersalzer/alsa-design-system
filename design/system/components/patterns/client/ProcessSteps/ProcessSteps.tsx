'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Card } from '../../../../../system/components/primitives/Card';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';
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
        backgroundColor: '#f9fafb'
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
                color="primary"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                  lineHeight: 'var(--foundation-typography-line-height-tight)',
                  textAlign: 'center',
                  color: '#000000'
                }}
              >
                {title.split(' ').map((word, index) => {
                  if (titleAccent && word === titleAccent) {
                    return (
                      <span 
                        key={index} 
                        style={{
                          background: 'linear-gradient(135deg, #1f2937 0%, #64748b 100%)',
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
                  textAlign: 'center',
                  color: '#374151'
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
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 'var(--foundation-radius-lg)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Stack spacing="lg" align="center">
                  {/* Step Icon */}
                  <div style={{
                    background: 'linear-gradient(135deg, #1f2937, #64748b)',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 16px rgba(31, 41, 55, 0.2)'
                  }}>
                    {step.icon ? (
                      <div style={{ 
                        width: '32px', 
                        height: '32px',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {step.icon}
                      </div>
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
                      color="primary"
                      style={{
                        textAlign: 'center',
                        color: '#000000'
                      }}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      variant="body-lg"
                      color="secondary"
                      style={{
                        textAlign: 'center',
                        lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                        color: '#6b7280'
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