'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Card } from '../../../../../system/components/primitives/Card';
import { useState, useEffect, useRef } from 'react';
import './ProcessSteps.css';

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

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const rect = wrapperRef.current!.getBoundingClientRect();
          const totalHeight = rect.height - window.innerHeight;
          const scrolled = Math.min(Math.max(-rect.top, 0), totalHeight);

          const progress = scrolled / totalHeight;
          const stepIndex = Math.floor(progress * steps.length);

          setActiveStepIndex(Math.min(stepIndex, steps.length - 1));
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [steps.length]);

  const getStepVisibility = (index: number) => {
    return activeStepIndex >= index;
  };

  return (
    <div
      ref={wrapperRef}
      className="process-steps-wrapper"
      style={{
        '--steps-count': steps.length,
      } as React.CSSProperties}
    >
      {/* Sticky container - neutral div utanför design system */}
      <div className="process-steps-sticky">
        <div className="process-steps-container">
          <div className="process-steps-content">
            {/* Header */}
            <div className="process-steps-header">
              <Stack spacing="lg" align="center">
                <Typography
                  variant="h2"
                  weight="bold"
                  color="heading"
                  style={{
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    lineHeight:
                      'var(--foundation-typography-line-height-tight)',
                    textAlign: 'left',
                  }}
                >
                  {title.split(' ').map((word, index) => {
                    if (titleAccent && word === titleAccent) {
                      return (
                        <span
                          key={index}
                          style={{
                            background:
                              'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-400) 100%)',
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
                    lineHeight:
                      'var(--foundation-typography-line-height-relaxed)',
                    textAlign: 'left',
                  }}
                >
                  {subtitle}
                </Typography>
              </Stack>
            </div>

            {/* Steps Cards Container */}
            <div className="process-steps-cards-container">
              {steps.map((step, index) => {
                const isVisible = getStepVisibility(index);
                const isActive = activeStepIndex === index;

                return (
                  <Card
                    key={step.number}
                    variant="elevated"
                    padding="lg"
                    className={`process-steps-card ${
                      !isVisible
                        ? 'process-steps-card--hidden'
                        : isActive
                        ? 'process-steps-card--active'
                        : activeStepIndex > index
                        ? 'process-steps-card--passed'
                        : 'process-steps-card--upcoming'
                    }`}
                    style={{
                      background: step.backgroundImage
                        ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${step.backgroundImage})`
                        : 'var(--surface-card)',
                      zIndex: 10 + index,
                    }}
                  >
                    {/* Step Number */}
                    <div
                      className={`process-steps-number ${
                        step.iconBackground === 'accent'
                          ? 'process-steps-number--accent'
                          : 'process-steps-number--default'
                      }`}
                    >
                      <Typography
                        variant="h1"
                        weight="bold"
                        color="inverse"
                        style={{
                          fontSize: 'clamp(2rem, 5vw, 3rem)',
                        }}
                      >
                        {step.number}
                      </Typography>
                    </div>

                    {/* Step Content */}
                    <div className="process-steps-content-wrapper">
                      <Typography
                        variant="h3"
                        weight="bold"
                        color={
                          step.backgroundImage ? 'inverse' : 'heading'
                        }
                        style={{
                          marginBottom: 'var(--foundation-space-4)',
                          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                          lineHeight:
                            'var(--foundation-typography-line-height-tight)',
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body-lg"
                        color={
                          step.backgroundImage ? 'inverse' : 'secondary'
                        }
                        style={{
                          lineHeight:
                            'var(--foundation-typography-line-height-relaxed)',
                          opacity: step.backgroundImage ? 0.9 : 1,
                        }}
                      >
                        {step.description}
                      </Typography>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}