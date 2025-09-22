'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Card } from '../../../../../system/components/primitives/Card';
import { useState, useEffect, useRef } from 'react';

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

  // Card styling
  const cardStyle = {
    height: '65vh',
    maxHeight: '650px',
    borderRadius: 'var(--foundation-radius-xl)',
    transition:
      'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
    willChange: 'transform, opacity',
  };

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
      style={{
        height: `${steps.length * 100}vh`,
        position: 'relative',
      }}
    >
      {/* Sticky container - neutral div utanför design system */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          backgroundColor: 'transparent',
          paddingTop: 'var(--foundation-space-12)',
          paddingBottom: 'var(--foundation-space-12)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            height: '100%',
            paddingLeft: 'var(--foundation-space-6)',
            paddingRight: 'var(--foundation-space-6)',
          }}
        >
          <div style={{ height: '100%', position: 'relative' }}>
            {/* Header */}
            <div
              style={{
                position: 'absolute',
                top: 'var(--foundation-space-8)',
                left: 0,
                right: 0,
                zIndex: 100,
                textAlign: 'center',
                maxWidth: '900px',
                margin: '0 auto',
                padding: 'var(--foundation-space-8) 0',
              }}
            >
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
            <div
              style={{
                position: 'relative',
                height: '100%',
                marginTop: 'var(--foundation-space-20)',
              }}
            >
              {steps.map((step, index) => {
                const isVisible = getStepVisibility(index);
                const isActive = activeStepIndex === index;

                return (
                  <Card
                    key={step.number}
                    variant="elevated"
                    padding="lg"
                    style={{
                      ...cardStyle,
                      position: 'absolute',
                      inset: 0,
                      background: step.backgroundImage
                        ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${step.backgroundImage})`
                        : 'var(--surface-card)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid var(--border-subtle)',
                      zIndex: 10 + index,
                      transform: isVisible
                        ? `translateY(${
                            isActive
                              ? '0px'
                              : activeStepIndex > index
                              ? '20px'
                              : '60px'
                          }) scale(${
                            isActive
                              ? 1
                              : activeStepIndex > index
                              ? 0.98
                              : 0.95
                          })`
                        : 'translateY(200px) scale(0.9)',
                      opacity: isVisible ? (isActive ? 1 : 0.9) : 0,
                      pointerEvents: isVisible ? 'auto' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    {/* Step Number */}
                    <div
                      style={{
                        width: 'clamp(80px, 10vw, 120px)',
                        height: 'clamp(80px, 10vw, 120px)',
                        borderRadius: '50%',
                        background:
                          step.iconBackground === 'accent'
                            ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                            : 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 'var(--foundation-space-8)',
                        border:
                          step.iconBackground === 'accent'
                            ? 'none'
                            : '1px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter:
                          step.iconBackground === 'accent'
                            ? 'none'
                            : 'blur(8px)',
                        boxShadow:
                          step.iconBackground === 'accent'
                            ? 'var(--foundation-shadow-lg)'
                            : 'none',
                      }}
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
                    <div style={{ maxWidth: '600px', width: '100%' }}>
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