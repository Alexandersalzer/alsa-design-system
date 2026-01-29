// ===============================================
// design/system/components/animations/ProgressRail/ProgressRail.tsx
// PROGRESS RAIL - Vertical progress indicator with scroll-based animation
// ===============================================

'use client';

import React, { useEffect, useRef, useState } from 'react';
import './ProgressRail.css';

export interface ProgressRailStep {
  id: string;
  number: string;
  label?: string;
}

export interface ProgressRailProps {
  steps: ProgressRailStep[];
  /** Height of the rail */
  height?: string;
  /** Width of the connecting line */
  lineWidth?: number;
  /** Size of the step nodes */
  nodeSize?: number;
  /** Gap between rail and content */
  gap?: string;
  /** Custom className */
  className?: string;
  /** Container element to track scroll within */
  scrollContainer?: HTMLElement | null;
}

export const ProgressRail: React.FC<ProgressRailProps> = ({
  steps,
  height = '100%',
  lineWidth = 1,
  nodeSize = 16,
  gap = 'var(--spacing-xl)',
  className = '',
  scrollContainer,
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!railRef.current) return;

      const rail = railRef.current;
      const rect = rail.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far the rail has scrolled into view
      const railTop = rect.top;
      const railHeight = rect.height;
      
      // Start progress when rail enters viewport, complete when it exits
      const scrollStart = viewportHeight - railHeight * 0.2;
      const scrollEnd = -railHeight * 0.8;
      
      let scrollProgress = 0;
      
      if (railTop <= scrollStart && railTop >= scrollEnd) {
        const scrollRange = scrollStart - scrollEnd;
        const scrolled = scrollStart - railTop;
        scrollProgress = Math.max(0, Math.min(1, scrolled / scrollRange));
      } else if (railTop < scrollEnd) {
        scrollProgress = 1;
      }
      
      // Calculate active step based on progress
      const stepIndex = Math.min(
        steps.length - 1,
        Math.floor(scrollProgress * steps.length)
      );
      setActiveStep(stepIndex);
    };

    const targetElement = scrollContainer || window;
    targetElement.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      targetElement.removeEventListener('scroll', handleScroll);
    };
  }, [steps.length, scrollContainer]);

  return (
    <div 
      ref={railRef}
      className={`progress-rail ${className}`}
      style={{
        '--rail-height': height,
        '--line-width': `${lineWidth}px`,
        '--node-size': `${nodeSize}px`,
        '--rail-gap': gap,
      } as React.CSSProperties}
    >
      {/* Connecting lines between nodes */}
      <div className="progress-rail__lines">
        {steps.map((step, index) => {
          if (index === steps.length - 1) return null;
          
          const isActive = index < activeStep;
          const startPos = (index / Math.max(1, steps.length - 1)) * 100;
          const endPos = ((index + 1) / Math.max(1, steps.length - 1)) * 100;
          const lineHeight = endPos - startPos;
          
          return (
            <div
              key={`line-${step.id}`}
              className={`progress-rail__line ${
                isActive ? 'progress-rail__line--active' : ''
              }`}
              style={{
                top: `${startPos}%`,
                height: `${lineHeight}%`,
              }}
            />
          );
        })}
      </div>

      {/* Step nodes */}
      <div className="progress-rail__nodes">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`progress-rail__node ${
              index <= activeStep ? 'progress-rail__node--active' : ''
            }`}
            style={{
              top: `${(index / Math.max(1, steps.length - 1)) * 100}%`,
            }}
          >
            <div className="progress-rail__node-dot" />
            <div className="progress-rail__node-label">
              {step.number}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
