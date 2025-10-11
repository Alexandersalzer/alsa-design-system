'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
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
    <div
      style={{
        paddingTop: 'var(--foundation-space-32)',
        paddingBottom: 'var(--foundation-space-32)',
        backgroundColor: 'transparent'
      }}
    >
      <div style={{ 
        maxWidth: 'var(--size-page-max-width)',
        margin: '0 auto',
        padding: '0 var(--foundation-space-6)'
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 'var(--size-page-max-width)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--foundation-space-8)' }}>
            <Typography
              variant="h2"
              weight="bold"
              color="inverse"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                lineHeight: 'var(--foundation-typography-line-height-tight)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--foundation-space-4)'
              }}
            >
              {title}
            </Typography>

            <Typography 
              variant="body-xl" 
              color="inverse"
              style={{
                color: 'var(--text-primary)',
                opacity: 0.9
              }}
            >
              {subtitle}
            </Typography>
          </div>

          {/* Single Step Card */}
          <div 
            style={{ position: 'relative', width: '100%', maxWidth: 'var(--size-page-content-max-width)' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <Card
              variant="elevated"
              padding="lg"
              style={{
                background: 'var(--surface-primary)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--foundation-radius-xl)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
                minHeight: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Image with overlay */}
              {steps[activeStep]?.backgroundImage && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url('${steps[activeStep].backgroundImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.08,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 0
                }} />
              )}

              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--foundation-space-8)',
                position: 'relative',
                zIndex: 1
              }}>
                <Stack spacing="xl" align="center">
                  {/* Large Icon */}
                  {steps[activeStep]?.icon && (
                    <IconContainer
                      variant="circle"
                      size="xl"
                      iconColor="accent"
                    >
                      {steps[activeStep].icon}
                    </IconContainer>
                  )}

                  {/* Content */}
                  <Stack spacing="lg" align="center">
                    <Typography 
                      variant="h2" 
                      weight="bold"
                      style={{ 
                        color: 'var(--text-primary)',
                        fontSize: 'clamp(1.75rem, 3vw, 2.5rem)'
                      }}
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
                  </Stack>
                </Stack>
              </div>
            </Card>

            {/* Arrow Navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'var(--foundation-space-8)',
              width: '100%'
            }}>
              {/* Previous Arrow */}
              <button
                onClick={() => handleStepChange(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: activeStep === 0 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: activeStep === 0 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'var(--text-primary)',
                  cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: activeStep === 0 ? 0.4 : 1
                }}
                onMouseEnter={(e) => {
                  if (activeStep > 0) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeStep > 0) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <ChevronLeftIcon size={28} />
              </button>

              {/* Step Counter with Click */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--foundation-space-3)'
              }}>
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleStepChange(index)}
                    style={{
                      width: index === activeStep ? '32px' : '12px',
                      height: '12px',
                      borderRadius: '6px',
                      background: index === activeStep 
                        ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                        : 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                      if (index !== activeStep) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== activeStep) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                      }
                    }}
                  />
                ))}
              </div>

              {/* Next Arrow */}
              <button
                onClick={() => handleStepChange(Math.min(steps.length - 1, activeStep + 1))}
                disabled={activeStep === steps.length - 1}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: activeStep === steps.length - 1 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                  border: 'none',
                  color: 'white',
                  cursor: activeStep === steps.length - 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: activeStep === steps.length - 1 ? 0.4 : 1
                }}
                onMouseEnter={(e) => {
                  if (activeStep < steps.length - 1) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeStep < steps.length - 1) {
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <ChevronRightIcon size={28} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProcessSteps.displayName = 'ProcessSteps';