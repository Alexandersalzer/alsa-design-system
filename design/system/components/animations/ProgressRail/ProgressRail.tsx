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
  /** Width of the rail line */
  railWidth?: number;
  /** Size of the step nodes */
  nodeSize?: number;
  /** Color of inactive rail */
  railColor?: string;
  /** Color of active/filled rail */
  activeRailColor?: string;
  /** Color of step nodes */
  nodeColor?: string;
  /** Color of active step nodes */
  activeNodeColor?: string;
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
  railWidth = 2,
  nodeSize = 16,
  railColor = 'var(--color-accent-muted)',
  activeRailColor = 'var(--color-accent)',
  nodeColor = 'var(--color-accent-subtle)',
  activeNodeColor = 'var(--color-accent)',
  gap = 'var(--spacing-xl)',
  className = '',
  scrollContainer,
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
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
      
      setProgress(scrollProgress);
      
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
        '--rail-width': `${railWidth}px`,
        '--node-size': `${nodeSize}px`,
        '--rail-color': railColor,
        '--active-rail-color': activeRailColor,
        '--node-color': nodeColor,
        '--active-node-color': activeNodeColor,
        '--rail-gap': gap,
        '--progress': progress,
      } as React.CSSProperties}
    >
      {/* Background rail */}
      <div className="progress-rail__track">
        <div className="progress-rail__track-background" />
        <div 
          className="progress-rail__track-fill" 
          style={{ height: `${progress * 100}%` }}
        />
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
