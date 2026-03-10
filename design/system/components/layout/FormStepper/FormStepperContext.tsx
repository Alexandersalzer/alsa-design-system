import { createContext, useContext, useRef } from 'react';

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
  /** Called by each FormStep on mount to claim its 1-based index and register its label */
  registerStep: (label?: string) => number;
  /** Called by each FormStep on unmount to remove itself from the count */
  unregisterStep: (index: number) => void;
}

export const FormStepperContext = createContext<FormStepperContextValue | null>(null);

export const useFormStepperContext = (): FormStepperContextValue => {
  const ctx = useContext(FormStepperContext);
  if (!ctx) throw new Error('useFormStepperContext must be used within a FormStepper');
  return ctx;
};

/** Returns a stable counter ref for assigning step indices */
export function useStepCounter() {
  return useRef(0);
}
