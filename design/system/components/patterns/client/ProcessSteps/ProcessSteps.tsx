'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Card } from '../../../../../system/components/primitives/Card';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
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
        paddingTop: 'var(--foundation-space-16)'
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
                color="heading"
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
                color="secondary"
                style={{
                  textAlign: 'center'
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
                  textAlign: 'center'
                }}
              >
                <Stack spacing="lg" align="center">
                  {/* Step Number */}
                  <div style={{
                    background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Typography variant="h3" weight="bold" color="inverse">
                      {step.number}
                    </Typography>
                  </div>

                  {/* Step Content */}
                  <Stack spacing="md" align="center">
                    <Typography
                      variant="h4"
                      weight="semibold"
                      color="heading"
                      style={{
                        textAlign: 'center'
                      }}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      variant="body-lg"
                      color="secondary"
                      style={{
                        textAlign: 'center',
                        lineHeight: 'var(--foundation-typography-line-height-relaxed)'
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