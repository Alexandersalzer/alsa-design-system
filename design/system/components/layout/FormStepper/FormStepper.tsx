// ===============================================
// FormStepper.tsx
// ===============================================

import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { FormStepperContext } from './FormStepperContext';
import Button from '../../actions/Button/Button';
import './FormStepper.css';

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

function StepIndicator({ currentStep, totalSteps, labels }: { currentStep: number; totalSteps: number; labels: string[] }) {
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
                ) : <span>{step}</span>}
              </div>
              <span className={cn('form-stepper__step-label', isActive && 'form-stepper__step-label--active')}>
                {labels[i] ?? `Step ${step}`}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div className={cn('form-stepper__step-line', isCompleted && 'form-stepper__step-line--completed')} aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

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

  const totalSteps = stepLabels.length || 1;
  const isLastStep = currentStep === totalSteps;
  const goNext = () => setCurrentStep(s => Math.min(s + 1, totalSteps));
  const goBack = () => setCurrentStep(s => Math.max(s - 1, 1));

  const contextValue = {
    currentStep,
    totalSteps,
    stepLabels,
    goNext,
    goBack,
    nextLabel,
    backLabel,
    submitLabel,
    isLastStep,
    claimIndex: () => 0,
    registerLabel: (_index: number, _label?: string) => {},
    reportTotal: (_c: number, _l: string[]) => {},
    registerStep: (_label?: string) => 0,
    unregisterStep: (_index: number) => {},
  };

  return (
    <FormStepperContext.Provider value={contextValue}>
      <div className={cn('form-stepper', `form-stepper--${variant}`, maxWidth !== 'full' && `form-stepper--max-${maxWidth}`, className)}>
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} labels={stepLabels} />
        <div className="form-stepper__content">{children}</div>
        <div className={cn('form-stepper__button-row', currentStep === 1 && 'form-stepper__button-row--end')}>
          {currentStep > 1 && (
            <Button variant="ghost" size="md" type="button" onClick={goBack}>{backLabel}</Button>
          )}
          {isLastStep ? (
            <Button variant="primary" size="md" type="button" onClick={() => onSubmit?.()}>{submitLabel}</Button>
          ) : (
            <Button variant="primary" size="md" type="button" onClick={goNext}>{nextLabel}</Button>
          )}
        </div>
      </div>
    </FormStepperContext.Provider>
  );
};

FormStepper.displayName = 'FormStepper';
