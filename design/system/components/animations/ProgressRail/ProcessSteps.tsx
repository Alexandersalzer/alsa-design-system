// ===============================================
// ProcessSteps.tsx - Scroll-animated process steps with rail segments
// ===============================================

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RailSegment } from './RailSegment';

export interface ProcessStep {
  id: string;
  number: string;
  type: 'start' | 'middle' | 'end';
  heading: string;
  body: string;
}

export interface ProcessStepsProps {
  steps: ProcessStep[];
  nodeSize?: number;
  lineWidth?: number;
  gap?: string;
  className?: string;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({
  steps,
  nodeSize = 16,
  lineWidth = 1,
  gap = '2xl',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = stepRefs.current.findIndex(
            (ref) => ref === entry.target
          );
          if (index !== -1) {
            setActiveStepIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    // Observe all step elements
    stepRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [steps.length]);

  // Map gap prop to CSS value
  const gapMap: Record<string, string> = {
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
    '2xl': 'var(--spacing-2xl)',
    '3xl': 'var(--spacing-3xl)',
  };

  const gapValue = gapMap[gap] || gap;

  return (
    <div
      ref={containerRef}
      className={`process-steps ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
      }}
    >
      {steps.map((step, index) => (
        <div
          key={step.id}
          ref={(el) => {
            stepRefs.current[index] = el;
          }}
          style={{
            display: 'flex',
            gap: gapValue,
            alignItems: 'flex-start',
          }}
        >
          {/* Rail Segment */}
          <RailSegment
            type={step.type}
            number={step.number}
            active={index <= activeStepIndex}
            nodeSize={nodeSize}
            lineWidth={lineWidth}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xs)',
              flex: 1,
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)',
              }}
            >
              {step.heading}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--line-height-relaxed)',
              }}
            >
              {step.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
