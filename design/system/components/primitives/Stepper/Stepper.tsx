// ===============================================
// src/design-system/components/primitives/Stepper/Stepper.tsx
// ENKEL STEPPER - Använder designsystemet korrekt
// ===============================================
import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';
import { H3, Body } from '../Typography';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// ===== ENKEL STEP INTERFACE =====
export interface Step {
  label: string;
  description: string;
}

// ===== ENKEL STEPPER COMPONENT =====
export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number;
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(({
  steps,
  currentStep,
  onPrevious,
  onNext,
  previousLabel = "Tillbaka",
  nextLabel = "Nästa",
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
      {/* Navigation rad - ren och enkel */}
      <div className="stepper-navigation">
        {/* Vänster: Previous knapp */}
        <Button
          variant="secondary"
          onClick={onPrevious}
          disabled={isFirstStep}
          leftIcon={
            <Icon size="sm" color="button-secondary">
              <ChevronLeftIcon />
            </Icon>
          }
        >
          {previousLabel}
        </Button>

        {/* Mitten: Steg nummer */}
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

        {/* Höger: Next knapp */}
        <Button
          variant="primary"
          onClick={onNext}
          disabled={isLastStep}
          rightIcon={
            <Icon size="sm" color="button-primary">
              <ChevronRightIcon />
            </Icon>
          }
        >
          {nextLabel}
        </Button>
      </div>

      {/* Innehåll under - separat */}
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