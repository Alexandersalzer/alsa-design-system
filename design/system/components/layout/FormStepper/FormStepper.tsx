// ===============================================
// FormStepper.tsx — Universal multi-step form layout component
// ===============================================

import React, { useState, useRef, useCallback } from 'react';
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
  const [totalSteps, setTotalSteps] = useState(stepLabels.length || 3);
  const [registeredLabels, setRegisteredLabels] = useState<string[]>(stepLabels);

  const isLastStep = currentStep === totalSteps;

  const goNext = () => setCurrentStep(s => Math.min(s + 1, totalSteps));
  const goBack = () => setCurrentStep(s => Math.max(s - 1, 1));

  // Synchronous render-time counter — reset each render so FormStep reads its
  // positional index during render (not in useEffect). This avoids all StrictMode issues.
  const renderCounterRef = useRef(0);
  renderCounterRef.current = 0;

  // claimIndex: called synchronously during FormStep render to get a stable 1-based index.
  // Because renderCounterRef resets each render, the index is always positional.
  const claimIndex = useCallback((): number => {
    renderCounterRef.current += 1;
    return renderCounterRef.current;
  }, []);

  // reportTotal: called by the last FormStep to tell FormStepper how many steps exist.
  // We use a stable callback that only updates state when the value changes.
  const reportTotal = useCallback((stepIndex: number, labels: string[]) => {
    setTotalSteps(prev => Math.max(prev, stepIndex));
    setRegisteredLabels(prev => {
      const next = [...prev];
      next[stepIndex - 1] = labels[stepIndex - 1] ?? `Step ${stepIndex}`;
      const same = next.length === prev.length && next.every((l, i) => l === prev[i]);
      return same ? prev : next;
    });
  }, []);

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
    claimIndex,
    reportTotal,
    // Keep registerStep for backward compat
    registerStep: (_label?: string) => claimIndex(),
    unregisterStep: (_index: number) => {},
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
