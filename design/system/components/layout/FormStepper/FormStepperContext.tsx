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
  /** Synchronous render-time index claim — safe to call during render */
  claimIndex: () => number;
  /** Synchronous render-time label registration — safe to call during render */
  registerLabel: (index: number, label?: string) => void;
  /** Report total step count + labels after render */
  reportTotal: (count: number, labels: string[]) => void;
  /** @deprecated use claimIndex */
  registerStep: (label?: string) => number;
  /** @deprecated no-op */
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
