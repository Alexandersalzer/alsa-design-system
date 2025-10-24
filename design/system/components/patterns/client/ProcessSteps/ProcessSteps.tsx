'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { VStack } from '../../../layout/utilities/vStack/VStack';
import { Section } from '../../../layout/frames/section/Section';
import { Container } from '../../../layout/frames/container/Container';
import { Card } from '../../../../../system/components/primitives/Card';
import { IconContainer } from '../../../../../system/components/primitives/IconContainer';
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactElement;
  backgroundImage?: string;
}

export interface ProcessStepsContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  steps: ProcessStep[];
  autoScrollInterval?: number; // milliseconds, default 5000
}

export interface ProcessStepsProps {
  content: ProcessStepsContent;
}

export function ProcessSteps({ content }: ProcessStepsProps) {
  const { title, titleAccent, subtitle, steps, autoScrollInterval = 5000 } = content;
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / (autoScrollInterval / 100));
      });
    }, 100);

    const autoScrollTimer = setInterval(() => {
      setActiveStep((prev) => {
        const next = prev + 1;
        if (next >= steps.length) return 0;
        return next;
      });
      setProgress(0);
    }, autoScrollInterval);

    return () => {
      clearInterval(progressInterval);
      clearInterval(autoScrollTimer);
    };
  }, [steps.length, isPaused, autoScrollInterval]);

  const handleStepChange = (newStep: number) => {
    setActiveStep(newStep);
    setProgress(0);
  };

  return (
    <Section
      style={{
        paddingTop: 'var(--foundation-space-32)',
        paddingBottom: 'var(--foundation-space-32)',
        backgroundColor: 'transparent'
      }}
    >
      <Container maxWidth="xl" align="center">
        <VStack spacing="xl" align="center">
          {/* Header */}
          <div className="process-steps-header">
            <VStack spacing="lg" align="center">
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
            </VStack>
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
                <VStack spacing="lg" align="center">
                  {/* Step Number */}
                  <div className="process-step-number">
                    <Typography variant="h3" weight="bold" color="inverse">
                      {step.number}
                    </Typography>
                  </div>

                  {/* Step Content */}
                  <VStack spacing="md" align="center">
                    <Typography
                      variant="h4"
                      weight="semibold"
                      color="heading"
                      className="process-step-title"
                    >
                      {steps[activeStep]?.title}
                    </Typography>
                    <Typography 
                      variant="body-xl"
                      style={{ 
                        color: 'var(--text-primary)', 
                        opacity: 0.9,
                        maxWidth: '600px',
                        lineHeight: '1.8',
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)'
                      }}
                    >
                      {steps[activeStep]?.description}
                    </Typography>
                  </VStack>
                </VStack>
              </Card>
            ))}
          </div>
        </VStack>
      </Container>
    </Section>
  );
}

ProcessSteps.displayName = 'ProcessSteps';