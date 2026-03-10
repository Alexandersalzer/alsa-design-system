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
  const [totalSteps, setTotalSteps] = useState(0);
  const [resolvedLabels, setResolvedLabels] = useState<string[]>(stepLabels);

  // Render-time counter: reset at top of each render, incremented by each FormStep during its render.
  // After all children have rendered, this holds the true count of FormStep children.
  // We snapshot it into committedCountRef via useLayoutEffect so we always read the value
  // from the *current* render cycle (not a stale reset from the next render).
  const renderCounterRef = useRef(0);
  const renderLabelsRef = useRef<string[]>([]);
  const committedCountRef = useRef(0);
  const committedLabelsRef = useRef<string[]>([]);

  renderCounterRef.current = 0;
  renderLabelsRef.current = [];

  const claimIndex = useCallback((): number => {
    renderCounterRef.current += 1;
    return renderCounterRef.current;
  }, []);

  const registerLabel = useCallback((index: number, label?: string) => {
    renderLabelsRef.current[index - 1] = label ?? `Step ${index}`;
  }, []);

  // useLayoutEffect runs synchronously after DOM mutations, before browser paint.
  // At this point children have fully rendered and incremented renderCounterRef,
  // so we snapshot the values into committedRefs before any new render can reset them.
  useLayoutEffect(() => {
    committedCountRef.current = renderCounterRef.current;
    committedLabelsRef.current = [...renderLabelsRef.current];

    const count = committedCountRef.current;
    const labels = committedLabelsRef.current;

    if (count > 0 && count !== totalSteps) {
      setTotalSteps(count);
    }
    const same = labels.length === resolvedLabels.length && labels.every((l, i) => l === resolvedLabels[i]);
    if (!same && labels.length > 0) {
      setResolvedLabels(labels);
    }
  });

  // Use committed count for display (avoids flash of wrong step count on first render)
  const displayTotal = committedCountRef.current > 0 ? committedCountRef.current : (totalSteps || stepLabels.length || 1);
  const isLastStep = currentStep === displayTotal;
  const goNext = () => setCurrentStep(s => Math.min(s + 1, displayTotal));
  const goBack = () => setCurrentStep(s => Math.max(s - 1, 1));

  const contextValue = {
    currentStep,
    totalSteps: displayTotal,
    stepLabels: resolvedLabels,
    goNext,
    goBack,
    nextLabel,
    backLabel,
    submitLabel,
    isLastStep,
    claimIndex,
    registerLabel,
    // compat
    reportTotal: (_c: number, _l: string[]) => {},
    registerStep: (_label?: string) => claimIndex(),
    unregisterStep: (_index: number) => {},
  };

  return (
    <FormStepperContext.Provider value={contextValue}>
      <div className={cn('form-stepper', `form-stepper--${variant}`, maxWidth !== 'full' && `form-stepper--max-${maxWidth}`, className)}>
        <StepIndicator currentStep={currentStep} totalSteps={displayTotal} labels={resolvedLabels} />
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
