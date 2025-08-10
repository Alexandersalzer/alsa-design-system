// ===============================================
// src/design-system/components/primitives/Stepper/Stepper.tsx
// RESPONSIVE STEPPER - Always horizontal, scales nicely
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';
import { H3, Body } from '../Typography';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// ===== STEP INTERFACE =====
export interface Step {
  label: string;
  description: string;
}

// ===== STEPPER COMPONENT =====
export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number;
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  showLabelsOnMobile?: boolean; // New prop to control mobile button text
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(({
  steps,
  currentStep,
  onPrevious,
  onNext,
  previousLabel = "Tillbaka",
  nextLabel = "Nästa",
  showLabelsOnMobile = false,
  className,
  ...props
}, ref) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  return (
    <div
      ref={ref}
      className={cn('stepper', className)}
      {...props}
    >
      {/* Navigation row - always horizontal */}
      <div className="stepper-navigation">
        {/* Left: Previous button */}
        <Button
          variant="secondary"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="stepper-button"
          leftIcon={
            <Icon size="sm" color="button-secondary" className="button-icon">
              <ChevronLeftIcon />
            </Icon>
          }
        >
          <span className={cn('button-text', !showLabelsOnMobile && 'md:inline hidden')}>
            {previousLabel}
          </span>
        </Button>

        {/* Center: Step indicators */}
        <div className="stepper-numbers">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'step-number',
                index === currentStep && 'step-number--current'
              )}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Right: Next button */}
        <Button
          variant="primary"
          onClick={onNext}
          disabled={isLastStep}
          className="stepper-button"
          rightIcon={
            <Icon size="sm" color="button-primary" className="button-icon">
              <ChevronRightIcon />
            </Icon>
          }
        >
          <span className={cn('button-text', !showLabelsOnMobile && 'md:inline hidden')}>
            {nextLabel}
          </span>
        </Button>
      </div>

      {/* Content below navigation */}
      {currentStepData && (
        <div className="step-content">
          <H3 className="step-title">{currentStepData.label}</H3>
          <Body size="md" color="secondary" className="step-description">
            {currentStepData.description}
          </Body>
        </div>
      )}
    </div>
  );
});

Stepper.displayName = 'Stepper';