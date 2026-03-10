// ===============================================
// FormStepper.tsx
// ===============================================

import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';
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

// -----------------------------------------------
// IndexProvider wraps children and injects index
// as a prop onto FormStep elements via React.Children.
// This is the only safe way to assign stable step
// indices without a render-time counter that can
// double-fire in StrictMode or on context re-renders.
// -----------------------------------------------
function injectStepIndices(children: React.ReactNode): { nodes: React.ReactNode; count: number; labels: string[] } {
  let index = 0;
  const labels: string[] = [];

  const nodes = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    // Check if this is a FormStep by displayName
    const type = child.type as any;
    if (type?.displayName === 'FormStep') {
      index += 1;
      const stepIndex = index;
      const label = (child.props as any).label ?? `Step ${stepIndex}`;
      labels.push(label);
      return React.cloneElement(child as React.ReactElement<any>, { _stepIndex: stepIndex });
    }
    return child;
  });

  return { nodes, count: index, labels };
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

  // Inject step indices synchronously — no counter, no effects, no side effects.
  // React.Children.map runs during render and is StrictMode-safe.
  const { nodes: indexedChildren, count, labels: derivedLabels } = injectStepIndices(children);

  const totalSteps = count || stepLabels.length || 1;
  const resolvedLabels = derivedLabels.length > 0 ? derivedLabels : stepLabels;

  const isLastStep = currentStep === totalSteps;
  const goNext = () => setCurrentStep(s => Math.min(s + 1, totalSteps));
  const goBack = () => setCurrentStep(s => Math.max(s - 1, 1));

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
    // No-ops — index assignment now done via cloneElement above
    claimIndex: () => 0,
    registerLabel: (_index: number, _label?: string) => {},
    reportTotal: (_c: number, _l: string[]) => {},
    registerStep: (_label?: string) => 0,
    unregisterStep: (_index: number) => {},
  };

  return (
    <FormStepperContext.Provider value={contextValue}>
      <div className={cn('form-stepper', `form-stepper--${variant}`, maxWidth !== 'full' && `form-stepper--max-${maxWidth}`, className)}>
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} labels={resolvedLabels} />
        <div className="form-stepper__content">{indexedChildren}</div>
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
