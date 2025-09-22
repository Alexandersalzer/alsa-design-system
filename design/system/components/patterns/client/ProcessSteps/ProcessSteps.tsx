'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Card } from '../../../../../system/components/primitives/Card';
import { Icon } from '../../../../../system/components/primitives/Icon';

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
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
        paddingBottom: 'var(--foundation-space-24)'
      }}
    >
      <Container maxWidth="xl" align="center">
        <Stack spacing="xl" align="center">
          {/* Header */}
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <Stack spacing="lg" align="center">
              <Typography
                variant="h2"
                weight="bold"
                color="heading"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                  lineHeight: 'var(--foundation-typography-line-height-tight)',
                  textAlign: 'left'
                }}
              >
                {title.split(' ').map((word, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      marginRight: '0.25em',
                      background:
                        titleAccent && word === titleAccent
                          ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                          : undefined,
                      WebkitBackgroundClip:
                        titleAccent && word === titleAccent ? 'text' : undefined,
                      WebkitTextFillColor:
                        titleAccent && word === titleAccent ? 'transparent' : undefined,
                      backgroundClip:
                        titleAccent && word === titleAccent ? 'text' : undefined,
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--foundation-space-8)',
              width: '100%',
              maxWidth: '1200px'
            }}
          >
            {steps.map((step, index) => (
              <Card
                key={index}
                variant="elevated"
                padding="lg"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Stack spacing="lg" align="center">
                  {/* Step Number */}
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                      boxShadow: 'var(--foundation-shadow-lg)'
                    }}
                  >
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
                        fontSize: 'clamp(1.25rem, 3vw, 1.5rem)'
                      }}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      variant="body-lg"
                      color="secondary"
                      style={{
                        lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </div>
        </Stack>
      </Container>
    </Section>
  );
}