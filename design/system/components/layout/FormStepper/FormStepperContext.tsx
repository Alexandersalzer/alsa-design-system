import { createContext, useContext } from 'react';

export interface FormStepperContextValue {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  goNext: () => void;
  goBack: () => void;
  nextLabel: string;
  backLabel: string;
  submitLabel: string;
  isLastStep: boolean;
}

export const FormStepperContext = createContext<FormStepperContextValue | null>(null);

export const useFormStepperContext = (): FormStepperContextValue => {
  const ctx = useContext(FormStepperContext);
  if (!ctx) throw new Error('useFormStepperContext must be used within a FormStepper');
  return ctx;
};
