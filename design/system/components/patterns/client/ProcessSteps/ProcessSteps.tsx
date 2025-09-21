'use client';

import { useEffect, useRef, useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Container } from '../../../../../system/layout/frames/container';
import { Card } from '../../../../../system/components/primitives/Card';

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  backgroundImage?: string;
  iconBackground?: 'default' | 'accent';
}

interface ProcessStepsContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  steps: ProcessStep[];
}

interface ProcessStepsProps {
  content: ProcessStepsContent;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function ProcessSteps({ content }: ProcessStepsProps) {
  const { title, titleAccent, subtitle, steps } = content;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef({ top: 0, height: 0 });
  const ticking = useRef(false);

  const [activeStep, setActiveStep] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  // Measure wrapper on load/resize
  const measure = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    metricsRef.current.top = top;
    metricsRef.current.height = rect.height;
  };

  const onScroll = () => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const { top, height } = metricsRef.current;
      const vh = window.innerHeight;

      // range där pin ska vara aktiv
      const start = top;
      const end = top + height - vh;

      const y = window.scrollY;
      const pinnedNow = y >= start && y < end;
      setIsPinned(pinnedNow);

      // progress inom wrappern (0..1)
      const scrolled = clamp(y - start, 0, height - vh);
      const progress = (height - vh) > 0 ? scrolled / (height - vh) : 0;

      const idx = Math.floor(progress * steps.length);
      setActiveStep(clamp(idx, 0, steps.length - 1));

      ticking.current = false;
    });
  };

  useEffect(() => {
    measure();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length]);

  // Höjd på wrapper: en viewport per steg
  const wrapperHeight = `${Math.max(1, steps.length) * 100}vh`;

  // Pinned container style (fastnar alltid även om sticky blockeras)
  const pinnedStyle: React.CSSProperties = isPinned
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--foundation-space-12) 0',
      }
    : {
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--foundation-space-12) 0',
      };

  return (
    <div ref={wrapperRef} style={{ height: wrapperHeight, position: 'relative' }}>
      <div style={pinnedStyle}>
        <Container
          maxWidth="2xl"
          align="center"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: 'center',
              maxWidth: '900px',
              margin: '0 auto var(--foundation-space-16) auto',
              padding: 'var(--foundation-space-8) 0',
            }}
          >
            <Stack spacing="lg" align="center">
              <Typography
                variant="h2"
                weight="bold"
                color="heading"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3rem)', lineHeight: '1.15' }}
              >
                {title.split(' ').map((word, i) => {
                  const accented = titleAccent && word === titleAccent;
                  return (
                    <span
                      key={`${word}-${i}`}
                      style={{
                        display: 'inline-block',
                        marginRight: '0.25em',
                        background: accented
                          ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                          : undefined,
                        WebkitBackgroundClip: accented ? 'text' as any : undefined,
                        WebkitTextFillColor: accented ? 'transparent' : undefined,
                        backgroundClip: accented ? 'text' : undefined,
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </Typography>

              <Typography
                variant="body-xl"
                color="secondary"
                style={{
                  maxWidth: '650px',
                  lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                }}
              >
                {subtitle}
              </Typography>
            </Stack>
          </div>

          {/* Cards stack */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              marginTop: 'var(--foundation-space-8)',
              height: '60vh',
            }}
          >
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <Card
                  key={index}
                  variant="elevated"
                  padding="lg"
                  radius="lg"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: step.backgroundImage ? `url(${step.backgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: step.backgroundImage
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'var(--surface-card)',
                    backdropFilter: step.backgroundImage ? 'blur(8px)' : undefined,
                    border: step.backgroundImage ? '1px solid rgba(255, 255, 255, 0.1)' : undefined,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                    pointerEvents: isActive ? 'auto' : 'none',
                    zIndex: isActive ? 2 : 1,
                  }}
                >
                  <div style={{ maxWidth: '600px', width: '100%' }}>
                    <Stack spacing="lg" align="center">
                      {/* Number badge */}
                      <div
                        style={{
                          width: 'clamp(64px, 8vw, 96px)',
                          height: 'clamp(64px, 8vw, 96px)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background:
                            step.iconBackground === 'accent'
                              ? 'linear-gradient(135deg, var(--accent-500), var(--accent-400))'
                              : 'rgba(255,255,255,0.2)',
                          border:
                            step.iconBackground === 'accent'
                              ? 'none'
                              : '1px solid rgba(255,255,255,0.3)',
                          backdropFilter: step.iconBackground === 'accent' ? 'none' : 'blur(8px)',
                          boxShadow:
                            step.iconBackground === 'accent' ? 'var(--foundation-shadow-lg)' : undefined,
                        }}
                      >
                        <Typography variant="h2" weight="bold" color="inverse">
                          {step.number}
                        </Typography>
                      </div>

                      <Typography
                        variant="h3"
                        weight="bold"
                        color={step.iconBackground === 'accent' ? 'heading' : 'inverse'}
                        style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}
                      >
                        {step.title}
                      </Typography>

                      <Typography
                        variant="body-lg"
                        color={step.iconBackground === 'accent' ? 'secondary' : 'inverse'}
                        style={{
                          lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                          opacity: 0.9,
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Stack>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </div>
    </div>
  );
}

export type { ProcessStep, ProcessStepsContent, ProcessStepsProps };