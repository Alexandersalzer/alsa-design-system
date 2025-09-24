'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  backgroundImage?: string;
  iconBackground?: string;
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ticking = useRef(false);

  // Card styling with smooth transitions
  const cardStyle = {
    height: '65vh',
    maxHeight: '650px',
    borderRadius: 'var(--foundation-radius-lg)',
    transition: 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
    willChange: 'transform, opacity'
  };

  useEffect(() => {
    // Intersection observer to detect when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    // Optimized scroll handler
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          
          const sectionRect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const totalScrollDistance = viewportHeight * 2.5;
          
          // Calculate scroll progress
          let progress = 0;
          if (sectionRect.top <= 400) {
            progress = Math.min(1, Math.max(0, Math.abs(sectionRect.top - 400) / totalScrollDistance));
          }
          
          // Determine active step based on progress
          if (progress >= 0.6) {
            setActiveStepIndex(2);
          } else if (progress >= 0.3) {
            setActiveStepIndex(1);
          } else {
            setActiveStepIndex(0);
          }
          
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Step visibility states
  const isFirstStepVisible = isIntersecting;
  const isSecondStepVisible = activeStepIndex >= 1;
  const isThirdStepVisible = activeStepIndex >= 2;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes cardEnter {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-card-enter {
            animation: cardEnter 0.8s ease-out;
          }
        `
      }} />
      <div 
        ref={sectionRef} 
        style={{ height: '320vh' }}
      >
        <Section
          id="process-steps"
          as="section"
          height="auto"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'var(--surface-page)',
            paddingTop: 'var(--foundation-space-24)',
            paddingBottom: 'var(--foundation-space-24)'
          }}
        >
          <Container maxWidth="xl" align="center" style={{ height: '100%' }}>
            <div style={{ height: '100%' }}>
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
                      textAlign: 'center',
                      lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                    }}
                  >
                    {subtitle}
                  </Typography>
                </Stack>
              </div>

              {/* Steps Cards */}
              <div style={{ position: 'relative', flex: 1, width: '100%' }}>
                {steps.map((step, index) => {
                  const isVisible = index === 0 ? isFirstStepVisible : 
                                   index === 1 ? isSecondStepVisible : 
                                   isThirdStepVisible;
                  
                  return (
                    <div 
                      key={index}
                      className={isVisible ? 'animate-card-enter' : ''}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 10 + index,
                        transform: `translateY(${isVisible ? 
                          (index === 0 ? '90px' : 
                           index === 1 ? (activeStepIndex === 1 ? '55px' : '45px') : 
                           activeStepIndex === 2 ? '15px' : '0') : '200px'}) scale(${
                          index === 0 ? 0.9 : 
                          index === 1 ? 0.95 : 1})`,
                        opacity: isVisible ? (index === 0 ? 0.9 : 1) : 0,
                        pointerEvents: isVisible ? 'auto' : 'none'
                      }}
                    >
                      <Card
                        variant="elevated"
                        padding="lg"
                        style={{
                          ...cardStyle,
                          background: step.backgroundImage ? 
                            `url(${step.backgroundImage})` : 
                            'var(--surface-card)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {step.backgroundImage && (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.4)',
                            zIndex: 1
                          }} />
                        )}
                        
                        <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
                          <div style={{ height: '100%' }}>
                            <Stack spacing="lg" align="center">
                            {/* Step Number */}
                            <div style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              backgroundColor: step.iconBackground === 'accent' ? 
                                'var(--accent-500)' : 'var(--interactive-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: 'var(--foundation-shadow-lg)'
                            }}>
                              <Typography variant="h3" weight="bold" color="inverse">
                                {step.number}
                              </Typography>
                            </div>

                            {/* Step Content */}
                            <div style={{ flex: 1, justifyContent: 'center' }}>
                              <Stack spacing="md" align="center">
                              <Typography
                                variant="h4"
                                weight="semibold"
                                color={step.backgroundImage ? "inverse" : "heading"}
                                style={{
                                  textAlign: 'center',
                                  fontSize: 'clamp(1.5rem, 3vw, 2rem)'
                                }}
                              >
                                {step.title}
                              </Typography>

                              <Typography
                                variant="body-lg"
                                color={step.backgroundImage ? "inverse" : "secondary"}
                                style={{
                                  textAlign: 'center',
                                  lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                                  opacity: step.backgroundImage ? 0.9 : 1
                                }}
                              >
                                {step.description}
                              </Typography>
                              </Stack>
                            </div>
                          </Stack>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
              </Stack>
            </div>
          </Container>
        </Section>
      </div>
    </>
  );
}

ProcessSteps.displayName = 'ProcessSteps';