// ===============================================
// FormStepper.tsx
// ===============================================

import React, { useState, useRef } from 'react';
import { cn } from '../../../utils/cn';
import { FormStepperContext } from './FormStepperContext';
import Button from '../../actions/Button/Button';
import { Label, Body } from '../../Typography/Typography';
import { executeAction } from '../../../core/actions/api';
import type { ActionType } from '../../../core/actions/types';
import './FormStepper.css';

export interface FormStepperAction {
  type: ActionType;
  settings?: Record<string, any>;
}

export interface FormStepperProps {
  stepLabels?: string[];
  defaultStep?: number;
  nextLabel?: string;
  backLabel?: string;
  submitLabel?: string;
  variant?: 'default' | 'card';
  maxWidth?: 'sm' | 'md' | 'lg' | 'full';
  /** Action to execute on submit — sends collected form data via API */
  action?: FormStepperAction;
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
              <Label
                size="sm"
                weight={isActive ? 'semibold' : 'medium'}
                color={isActive ? 'primary' : 'secondary'}
                className={cn('form-stepper__step-label', isActive && 'form-stepper__step-label--active')}
              >
                {labels[i] ?? `Step ${step}`}
              </Label>
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
  action,
  onSubmit,
  className,
  children,
}: FormStepperProps) => {
  const [currentStep, setCurrentStep] = useState(defaultStep);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const totalSteps = stepLabels.length || 1;
  const isLastStep = currentStep === totalSteps;
  const goNext = () => setCurrentStep(s => Math.min(s + 1, totalSteps));
  const goBack = () => setCurrentStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (action) {
      setSubmitLoading(true);
      setSubmitError(null);

      // Collect all form data from the <form> element
      const formEl = formRef.current;
      const formData = formEl ? new FormData(formEl) : new FormData();

      // Flat data (backwards compatible)
      const flatData: Record<string, any> = {};
      formData.forEach((val, key) => {
        flatData[key] = val;
      });

      // Structured per-step data (if steps are present)
      const stepsData: Record<string, Record<string, any>> = {};
      if (formEl) {
        const stepElements = Array.from(formEl.querySelectorAll<HTMLElement>('.form-step'));
        stepElements.forEach((stepEl) => {
          const stepKey = stepEl.dataset.stepKey || `step_${stepEl.dataset.stepIndex || ''}`;
          if (!stepKey) return;

          const controls = stepEl.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
            'input[name], textarea[name], select[name]'
          );

          controls.forEach((control) => {
            const name = control.name;
            if (!name) return;
            const value = formData.get(name);
            if (value === null) return;

            if (!stepsData[stepKey]) {
              stepsData[stepKey] = {};
            }
            stepsData[stepKey][name] = value;
          });
        });
      }

      const payload: Record<string, any> = {
        ...flatData,
      };

      if (Object.keys(stepsData).length > 0) {
        payload.steps = stepsData;
      }

      const result = await executeAction(action.type, payload);
      setSubmitLoading(false);

      if (result.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(result.message);
      }
    } else {
      onSubmit?.();
    }
  };

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

  if (submitSuccess) {
    return (
      <div className={cn('form-stepper', `form-stepper--${variant}`, maxWidth !== 'full' && `form-stepper--max-${maxWidth}`, className)}>
        <div className="form-stepper__success">
          <Body size="md" color="success">Tack! Vi återkommer snart.</Body>
        </div>
      </div>
    );
  }

  return (
    <FormStepperContext.Provider value={contextValue}>
      <form
        ref={formRef}
        className={cn('form-stepper', `form-stepper--${variant}`, maxWidth !== 'full' && `form-stepper--max-${maxWidth}`, className)}
        onSubmit={handleSubmit}
      >
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} labels={stepLabels} />
        <div className="form-stepper__content">{children}</div>
        {submitError && (
          <Body size="sm" color="error">{submitError}</Body>
        )}
        <div className={cn('form-stepper__button-row', currentStep === 1 && 'form-stepper__button-row--end')}>
          {currentStep > 1 && (
            <Button variant="ghost" size="md" type="button" onClick={goBack}>{backLabel}</Button>
          )}
          {isLastStep ? (
            <Button variant="primary" size="md" type="submit" loading={submitLoading}>{submitLabel}</Button>
          ) : (
            <Button variant="primary" size="md" type="button" onClick={goNext}>{nextLabel}</Button>
          )}
        </div>
      </form>
    </FormStepperContext.Provider>
  );
};

FormStepper.displayName = 'FormStepper';
