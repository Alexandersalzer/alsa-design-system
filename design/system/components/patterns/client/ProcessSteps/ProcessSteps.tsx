'use client';

import './ProcessSteps.css';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { useState, useEffect, useRef } from 'react';

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

const ProcessSteps = ({ content }: ProcessStepsProps) => {
  const { title, titleAccent, subtitle, steps } = content;

  const [activeStep, setActiveStep] = useState(0);
  const ticking = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current && wrapperRef.current) {
        requestAnimationFrame(() => {
          const rect = wrapperRef.current!.getBoundingClientRect();
          const totalHeight = rect.height - window.innerHeight;
          const scrolled = Math.min(Math.max(-rect.top, 0), totalHeight);

          const progress = scrolled / totalHeight;
          const stepIndex = Math.floor(progress * steps.length);

          setActiveStep(Math.min(stepIndex, steps.length - 1));
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  return (
    <div
      ref={wrapperRef}
      className="process-steps-wrapper"
      style={{ height: `${steps.length * 100}vh` }}
    >
      <section id="process-steps" className="process-steps-section">
        <div className="process-steps-container">
          {/* Header */}
          <div className="process-steps-header">
            <Stack spacing="lg" align="center">
              <Typography
                variant="h2"
                weight="bold"
                color="heading"
                className="process-steps-title"
              >
                {title.split(' ').map((word, index) => {
                  if (titleAccent && word === titleAccent) {
                    return (
                      <span key={index} className="process-steps-title-accent">
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
                className="process-steps-subtitle"
              >
                {subtitle}
              </Typography>
            </Stack>
          </div>

          {/* Steps */}
          <div className="process-steps-container-animation">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`process-step ${
                  activeStep === index ? 'process-step--active' : ''
                }`}
                style={{
                  backgroundImage: step.backgroundImage
                    ? `url(${step.backgroundImage})`
                    : undefined,
                  zIndex: steps.length - index,
                }}
              >
                <div className="process-step-content">
                  <div
                    className={`process-step-icon ${
                      step.iconBackground === 'accent'
                        ? 'process-step-icon--accent'
                        : ''
                    }`}
                  >
                    <Typography variant="h2" weight="bold" color="inverse">
                      {step.number}
                    </Typography>
                  </div>

                  <Typography
                    variant="h3"
                    weight="bold"
                    color={
                      step.iconBackground === 'accent' ? 'heading' : 'inverse'
                    }
                    className="process-step-title"
                  >
                    {step.title}
                  </Typography>

                  <Typography
                    variant="body-lg"
                    color={
                      step.iconBackground === 'accent' ? 'secondary' : 'inverse'
                    }
                    className="process-step-description"
                  >
                    {step.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { ProcessSteps };
export type { ProcessStep, ProcessStepsContent, ProcessStepsProps };
