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
    let isScrolling = false;
    
    const handleScroll = (e: Event) => {
      if (!sectionRef.current || isScrolling) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if section is in viewport
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        e.preventDefault();
        
        const scrollDelta = (e as WheelEvent).deltaY;
        const direction = scrollDelta > 0 ? 1 : -1;
        
        setActiveStep(prevStep => {
          const newStep = prevStep + direction;
          return Math.max(0, Math.min(newStep, steps.length - 1));
        });
        
        // Prevent default scroll behavior
        isScrolling = true;
        setTimeout(() => {
          isScrolling = false;
        }, 100);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if section is in viewport
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        e.preventDefault();
        
        const direction = e.deltaY > 0 ? 1 : -1;
        
        setActiveStep(prevStep => {
          const newStep = prevStep + direction;
          return Math.max(0, Math.min(newStep, steps.length - 1));
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
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
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: index <= activeStep 
                        ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                        : 'rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
                <Typography 
                  variant="body-sm" 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginLeft: 'var(--foundation-space-3)'
                  }}
                >
                  {activeStep + 1} av {steps.length}
                </Typography>
              </div>
              
              {/* Scroll Instruction */}
              <Typography 
                variant="body-sm" 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginBottom: 'var(--foundation-space-4)'
                }}
              >
                Scrolla för att gå igenom stegen
              </Typography>

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
                      transform: activeStep === index ? 'translateX(8px)' : 'translateX(0)'
                    }}
                    onClick={() => setActiveStep(index)}
                  >
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