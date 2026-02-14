// ===============================================
// ProcessRailContainer.tsx
// Container that combines ProgressRail with process step items
// Provides proper architecture: ONE unified rail, clean items
// ===============================================

'use client';

import React from 'react';
import { ProgressRail, ProgressRailStep } from './ProgressRail';
import './ProcessRailContainer.css';

export interface ProcessStepContent {
  id: string;
  number: string;
  tag?: React.ReactNode;
  heading?: React.ReactNode;
  body?: React.ReactNode;
}

export interface ProcessRailContainerProps {
  /** Array of process steps with content */
  steps: ProcessStepContent[];

  /** Width of the connecting line */
  lineWidth?: number;

  /** Size of the step nodes */
  nodeSize?: number;

  /** Spacing between steps */
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

  /** Custom className */
  className?: string;
}

export const ProcessRailContainer: React.FC<ProcessRailContainerProps> = ({
  steps,
  lineWidth = 2,
  nodeSize = 24,
  spacing = 'xl',
  className = '',
}) => {
  // Convert steps to ProgressRail format
  const railSteps: ProgressRailStep[] = steps.map(step => ({
    id: step.id,
    number: step.number,
  }));

  return (
    <div className={`process-rail-container ${className}`}>
      {/* Unified Progress Rail */}
      <div className="process-rail-container__rail">
        <ProgressRail
          steps={railSteps}
          lineWidth={lineWidth}
          nodeSize={nodeSize}
        />
      </div>

      {/* Process Step Content */}
      <div className={`process-rail-container__content process-rail-container__content--spacing-${spacing}`}>
        {steps.map((step) => (
          <div
            key={step.id}
            className="process-rail-container__step"
            id={`process-step-${step.id}`}
          >
            <div className="process-rail-container__step-content">
              {step.tag && (
                <div className="process-rail-container__tag">
                  {step.tag}
                </div>
              )}
              {step.heading && (
                <div className="process-rail-container__heading">
                  {step.heading}
                </div>
              )}
              {step.body && (
                <div className="process-rail-container__body">
                  {step.body}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
