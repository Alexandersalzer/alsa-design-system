// ===============================================
// FormStepper.tsx — Universal multi-step form layout component
// ===============================================

import React, { useState, useRef, useCallback, useEffect } from 'react';
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

  // activeIndices tracks which step indices are currently mounted.
  // Using a Set so StrictMode unmount/remount doesn't double-count:
  // add on mount, delete on unmount → size is always the real count.
  const activeIndicesRef = useRef<Set<number>>(new Set());
  const [totalSteps, setTotalSteps] = useState(stepLabels.length || 3);
  const [registeredLabels, setRegisteredLabels] = useState<string[]>([]);

  // Per-render counter — reset each render so each FormStep gets a stable positional index
  const stepCounterRef = useRef(0);
  stepCounterRef.current = 0;

  const isLastStep = currentStep === totalSteps;

  const goNext = () => {
    if (currentStep < totalSteps) setCurrentStep(s => s + 1);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  const registerStep = useCallback((label?: string): number => {
    stepCounterRef.current += 1;
    const index = stepCounterRef.current;

    // Add to active set and update totalSteps to the current live count
    activeIndicesRef.current.add(index);
    setTotalSteps(activeIndicesRef.current.size);

    if (label) {
      setRegisteredLabels(prev => {
        const next = [...prev];
        next[index - 1] = label;
        return next;
      });
    }

    return index;
  }, []);

  const unregisterStep = useCallback((index: number) => {
    activeIndicesRef.current.delete(index);
    setTotalSteps(activeIndicesRef.current.size);
  }, []);

  // Use registered labels from FormStep props if available, fall back to stepLabels prop
  const resolvedLabels = registeredLabels.length > 0 ? registeredLabels : stepLabels;

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
    registerStep,
    unregisterStep,
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
