'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Card } from '../../../../../system/components/primitives/Card';
import React, { useState, useEffect, useRef } from 'react';

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


  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      
      // Calculate progress through the section (0 to 1)
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top) / (windowHeight + sectionHeight)
      ));
      
      // Determine active step based on progress
      const stepIndex = Math.floor(progress * steps.length);
      setActiveStep(Math.min(stepIndex, steps.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  return (
    <div
      ref={sectionRef}
      style={{
        paddingTop: 'var(--foundation-space-24)',
        paddingBottom: 'var(--foundation-space-24)',
        backgroundColor: 'transparent',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="xl" align="center">
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 768px) {
              .process-steps-grid {
                grid-template-columns: 1fr !important;
                gap: var(--foundation-space-8) !important;
              }
              .process-steps-left {
                order: 2;
              }
              .process-steps-right {
                order: 1;
              }
            }
          `
        }} />
        <div 
          className="process-steps-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 'var(--foundation-space-16)',
            alignItems: 'center',
            width: '100%',
            maxWidth: 'var(--size-page-max-width)'
          }}
        >
          {/* Left Side - Step Titles */}
          <div className="process-steps-left">
            <Stack spacing="lg">
              {/* Header */}
              <div>
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

              {/* Progress Bar */}
              <div style={{
                marginBottom: 'var(--foundation-space-6)',
                padding: 'var(--foundation-space-4)',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--foundation-radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--foundation-space-3)'
                }}>
                  <Typography 
                    variant="body-sm" 
                    weight="semibold"
                    style={{ color: 'var(--primary-white)' }}
                  >
                    Steg {activeStep + 1} av {steps.length}
                  </Typography>
                  <Typography 
                    variant="body-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {Math.round(((activeStep + 1) / steps.length) * 100)}% klart
                  </Typography>
                </div>
                
                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${((activeStep + 1) / steps.length) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                    borderRadius: '3px',
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
              </div>

              {/* Step Titles */}
              <Stack spacing="md">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    style={{
                      padding: 'var(--foundation-space-6)',
                      borderRadius: 'var(--foundation-radius-lg)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: activeStep === index 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'transparent',
                      border: activeStep === index 
                        ? '1px solid rgba(255, 255, 255, 0.2)' 
                        : '1px solid transparent',
                      transform: activeStep === index ? 'translateX(8px)' : 'translateX(0)',
                      position: 'relative'
                    }}
                    onClick={() => setActiveStep(index)}
                  >
                    {/* Step Number Badge */}
                    <div style={{
                      position: 'absolute',
                      top: 'var(--foundation-space-3)',
                      right: 'var(--foundation-space-3)',
                      background: activeStep === index 
                        ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                        : 'rgba(255, 255, 255, 0.1)',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}>
                      <Typography 
                        variant="body-xs" 
                        weight="bold"
                        style={{ 
                          color: activeStep === index ? 'white' : 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px'
                        }}
                      >
                        {step.number}
                      </Typography>
                    </div>

                    <Stack spacing="sm">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--foundation-space-3)' }}>
                        <div style={{
                          background: activeStep === index 
                            ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                            : 'rgba(255, 255, 255, 0.1)',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                          {step.icon ? (
                            <div style={{
                              width: '20px',
                              height: '20px',
                              color: activeStep === index ? 'white' : 'rgba(255, 255, 255, 0.6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.3s ease'
                            }}>
                              {step.icon}
                            </div>
                          ) : (
                            <Typography 
                              variant="body-sm" 
                              weight="bold"
                              style={{ 
                                color: activeStep === index ? 'white' : 'rgba(255, 255, 255, 0.6)',
                                transition: 'color 0.3s ease'
                              }}
                            >
                              {step.number}
                            </Typography>
                          )}
                        </div>
                        <Typography 
                          variant="h4" 
                          weight="bold"
                          style={{
                            color: activeStep === index ? 'var(--primary-white)' : 'rgba(255, 255, 255, 0.7)',
                            transition: 'color 0.3s ease'
                          }}
                        >
                          {step.title}
                        </Typography>
                      </div>
                    </Stack>
                  </div>
                ))}
              </Stack>
            </Stack>
          </div>

          {/* Right Side - Active Step Card */}
          <div className="process-steps-right" style={{ position: 'relative' }}>
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
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `scale(${activeStep === 0 ? 1 : 0.95})`,
                opacity: activeStep === 0 ? 1 : 0.8
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Stack spacing="lg" align="center">
                  {/* Progress Indicator */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--foundation-space-2)',
                    marginBottom: 'var(--foundation-space-4)'
                  }}>
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: index <= activeStep 
                            ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                            : 'rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                          boxShadow: index === activeStep 
                            ? '0 0 0 4px rgba(99, 102, 241, 0.2)' 
                            : 'none'
                        }}
                      />
                    ))}
                  </div>

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
                      maxWidth: '400px',
                      lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                    }}
                  >
                    {steps[activeStep]?.description}
                  </Typography>

                  {/* Next Step Indicator */}
                  {activeStep < steps.length - 1 && (
                    <div style={{
                      marginTop: 'var(--foundation-space-4)',
                      padding: 'var(--foundation-space-3)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 'var(--foundation-radius-md)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <Typography 
                        variant="body-sm"
                        weight="semibold"
                        style={{ 
                          color: 'var(--accent-400)',
                          marginBottom: 'var(--foundation-space-1)'
                        }}
                      >
                        Nästa steg:
                      </Typography>
                      <Typography 
                        variant="body-sm"
                        style={{ 
                          color: 'rgba(255, 255, 255, 0.8)'
                        }}
                      >
                        {steps[activeStep + 1]?.title}
                      </Typography>
                    </div>
                  )}

                  {/* Completion Message */}
                  {activeStep === steps.length - 1 && (
                    <div style={{
                      marginTop: 'var(--foundation-space-4)',
                      padding: 'var(--foundation-space-3)',
                      background: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: 'var(--foundation-radius-md)',
                      border: '1px solid rgba(34, 197, 94, 0.2)'
                    }}>
                      <Typography 
                        variant="body-sm"
                        weight="semibold"
                        style={{ 
                          color: '#22c55e',
                          marginBottom: 'var(--foundation-space-1)'
                        }}
                      >
                        🎉 Processen är klar!
                      </Typography>
                      <Typography 
                        variant="body-sm"
                        style={{ 
                          color: 'rgba(255, 255, 255, 0.8)'
                        }}
                      >
                        Du har gått igenom alla steg i vår process.
                      </Typography>
                    </div>
                  )}
                </Stack>
                </Stack>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

ProcessSteps.displayName = 'ProcessSteps';