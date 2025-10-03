'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../layout/utilities/stack/Stack';
import { Section } from '../../../layout/frames/section/Section';
import { Container } from '../../../layout/frames/container/Container';
import { Card } from '../../../../../system/components/primitives/Card';

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
      className="process-steps-section"
    >
      <Container maxWidth="xl" align="center">
        <Stack spacing="xl" align="center">
          {/* Header */}
          <div className="process-steps-header">
            <Stack spacing="lg" align="center">
              <Typography
                variant="h2"
                weight="bold"
                color="heading"
                className="process-steps-title"
              >
                {title.split(' ').map((word, index) => (
                  <span
                    key={index}
                    className={titleAccent && word === titleAccent ? 'process-steps-title-accent' : ''}
                  >
                    {word}{' '}
                  </span>
                ))}
              </Typography>

              <Typography
                variant="body-xl"
                color="secondary"
                className="process-steps-subtitle"
              >
                {subtitle}
              </Typography>
            </Stack>
          </div>

          {/* Steps Grid */}
          <div className="process-steps-grid">
            {steps.map((step, index) => (
              <Card
                key={index}
                variant="elevated"
                padding="lg"
                className="process-step-card"
              >
                <Stack spacing="lg" align="center">
                  {/* Step Number */}
                  <div className="process-step-number">
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
                      className="process-step-title"
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      variant="body-lg"
                      color="secondary"
                      className="process-step-description"
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

ProcessSteps.displayName = 'ProcessSteps';