'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Card } from '../../../../../system/components/primitives/Card';
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

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
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div
      style={{
        paddingTop: 'var(--foundation-space-24)',
        paddingBottom: 'var(--foundation-space-24)',
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
                color: 'var(--primary-white)',
                marginBottom: 'var(--foundation-space-4)'
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
                color: 'var(--primary-white)',
                opacity: 0.9
              }}
            >
              {subtitle}
            </Typography>
          </div>

          {/* Single Step Card */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 'var(--size-page-narrow-max-width)' }}>
            <Card
              variant="elevated"
              padding="lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--foundation-radius-xl)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Stack spacing="lg" align="center">
                  {/* Large Icon */}
                  <div style={{
                    background: 'linear-gradient(135deg, #1f2937, #64748b)',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(31, 41, 55, 0.3)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: `rotate(${activeStep * 10}deg)`
                  }}>
                    {steps[activeStep]?.icon ? (
                      <div style={{
                        width: '60px',
                        height: '60px',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {steps[activeStep].icon}
                      </div>
                    ) : (
                      <Typography 
                        variant="h1" 
                        weight="bold"
                        style={{ color: '#ffffff', fontSize: '3rem' }}
                      >
                        {steps[activeStep]?.number}
                      </Typography>
                    )}
                  </div>

                  {/* Content */}
                  <Stack spacing="md" align="center">
                    <Typography 
                      variant="h3" 
                      weight="bold"
                      style={{ color: 'var(--primary-white)' }}
                    >
                      {steps[activeStep]?.title}
                    </Typography>
                    <Typography 
                      variant="body-lg"
                      style={{ 
                        color: 'var(--primary-white)', 
                        opacity: 0.9,
                        maxWidth: 'var(--size-page-content-max-width)',
                        lineHeight: 'var(--foundation-typography-line-height-relaxed)'
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
              marginTop: 'var(--foundation-space-6)',
              width: '100%'
            }}>
              {/* Previous Arrow */}
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: activeStep === 0 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: activeStep === 0 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'var(--primary-white)',
                  cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: activeStep === 0 ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (activeStep > 0) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeStep > 0) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <ChevronLeftIcon size={24} />
              </button>

              {/* Step Counter */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--foundation-space-2)'
              }}>
                {steps.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: index === activeStep 
                        ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                        : 'rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>

              {/* Next Arrow */}
              <button
                onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                disabled={activeStep === steps.length - 1}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: activeStep === steps.length - 1 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                  border: 'none',
                  color: 'white',
                  cursor: activeStep === steps.length - 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: activeStep === steps.length - 1 ? 0.5 : 1,
                  boxShadow: activeStep < steps.length - 1 
                    ? '0 4px 12px rgba(99, 102, 241, 0.3)' 
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeStep < steps.length - 1) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeStep < steps.length - 1) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                  }
                }}
              >
                <ChevronRightIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProcessSteps.displayName = 'ProcessSteps';