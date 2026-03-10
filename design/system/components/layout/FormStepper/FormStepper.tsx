// ===============================================
// FormStepper.tsx — Universal multi-step form layout component
// ===============================================

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { cn } from '../../../utils/cn';
import { FormStepperContext } from './FormStepperContext';
import Button from '../../actions/Button/Button';
import './FormStepper.css';

// ===============================================
// TYPES
// ===============================================

export interface FormStepperProps {
  stepLabels?: string[];
  defaultStep?: number;
  nextLabel?: string;
  backLabel?: string;
  submitLabel?: string;
  variant?: 'default' | 'card';
  maxWidth?: 'sm' | 'md' | 'lg' | 'full';
  onSubmit?: () => void;
  className?: string;
  children?: React.ReactNode;
}

// ===============================================
// STEP INDICATOR (internal)
// ===============================================

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="form-stepper__indicator" aria-label="Form steps">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        return (
          <React.Fragment key={step}>
            <div className="form-stepper__step">
              <div
                className={cn(
                  'form-stepper__step-circle',
                  isCompleted && 'form-stepper__step-circle--completed',
                  isActive && 'form-stepper__step-circle--active'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span>{step}</span>
                )}
              </div>
              <span className={cn(
                'form-stepper__step-label',
                isActive && 'form-stepper__step-label--active'
              )}>
                {labels[i] ?? `Step ${step}`}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  'form-stepper__step-line',
                  isCompleted && 'form-stepper__step-line--completed'
                )}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export const FormStepper = ({
  stepLabels = [],
  defaultStep = 1,
  nextLabel = 'Nästa',
  backLabel = 'Tillbaka',
  submitLabel = 'Skicka',
  variant = 'default',
  maxWidth = 'lg',
  onSubmit,
  className,
  children,
}: FormStepperProps) => {
  const [currentStep, setCurrentStep] = useState(defaultStep);

  // Count FormStep children directly — no registration needed, no StrictMode issues.
  // A FormStep child is any React element with displayName 'FormStep'.
  const { totalSteps, resolvedLabels } = useMemo(() => {
    const steps: { label?: string }[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const type = child.type as any;
        if (type?.displayName === 'FormStep' || type?.name === 'FormStep') {
          steps.push({ label: (child.props as any).label });
        }
      }
    });
    const total = steps.length || stepLabels.length || 1;
    const labels = steps.length > 0
      ? steps.map((s, i) => s.label ?? stepLabels[i] ?? `Step ${i + 1}`)
      : stepLabels;
    return { totalSteps: total, resolvedLabels: labels };
  }, [children, stepLabels]);

  const isLastStep = currentStep === totalSteps;

  const goNext = () => {
    if (currentStep < totalSteps) setCurrentStep(s => s + 1);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  // stepIndexRef: used by FormStep to claim its index without registration callbacks.
  // Reset each render so each FormStep gets a stable positional index.
  const stepIndexRef = useRef(0);
  stepIndexRef.current = 0;

  const claimStepIndex = useCallback((): number => {
    stepIndexRef.current += 1;
    return stepIndexRef.current;
  }, []);

  const contextValue = {
    currentStep,
    totalSteps,
    stepLabels: resolvedLabels,
    goNext,
    goBack,
    nextLabel,
    backLabel,
    submitLabel,
    isLastStep,
    // Keep registerStep for backward compat but it now uses claimStepIndex
    registerStep: (_label?: string) => claimStepIndex(),
  };

  return (
    <FormStepperContext.Provider value={contextValue}>
      <div
        className={cn(
          'form-stepper',
          `form-stepper--${variant}`,
          maxWidth !== 'full' && `form-stepper--max-${maxWidth}`,
          className
        )}
      >
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          labels={resolvedLabels}
        />

        <div className="form-stepper__content">
          {children}
        </div>

        <div className={cn(
          'form-stepper__button-row',
          currentStep === 1 && 'form-stepper__button-row--end'
        )}>
          {currentStep > 1 && (
            <Button variant="ghost" size="md" type="button" onClick={goBack}>
              {backLabel}
            </Button>
          )}
          {isLastStep ? (
            <Button variant="primary" size="md" type="button" onClick={() => onSubmit?.()}>
              {submitLabel}
            </Button>
          ) : (
            <Button variant="primary" size="md" type="button" onClick={goNext}>
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    </FormStepperContext.Provider>
  );
};

FormStepper.displayName = 'FormStepper';
