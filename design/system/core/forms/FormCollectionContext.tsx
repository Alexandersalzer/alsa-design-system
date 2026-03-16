/**
 * FormCollectionContext - Unified form data collection for flat and stepped forms.
 * Used by both single-step (plain) forms and FormStepper multi-step forms.
 * Components (Input, Textarea, SelectionCard, etc.) call setField(stepId, name, value)
 * to contribute to the payload; on submit getPayload() returns the canonical structure.
 */

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { FormSubmissionPayload, FormStepPayload } from '../actions/types';

export interface FormCollectionContextValue {
  /** Form id (e.g. 'contact_form', 'booking_form') */
  formId: string;
  /** Ref to current step id – FormCollectionStepScope sets .current so setField(undefined, name, value) uses it */
  currentStepIdRef: React.MutableRefObject<string>;
  /** Set a field value for a step. If stepId is omitted, uses currentStepIdRef.current. */
  setField: (stepId: string | undefined, name: string, value: any) => void;
  /** Build the submission payload (formId, submittedAt, steps, meta) */
  getPayload: (meta?: Record<string, any>) => FormSubmissionPayload;
  /** Reset all collected data (e.g. after successful submit) */
  reset: () => void;
  /** Register that a step exists (for stable step order in payload) */
  registerStepId: (stepId: string) => void;
}

const FormCollectionContext = createContext<FormCollectionContextValue | null>(null);

export const useFormCollectionContext = (): FormCollectionContextValue | null => {
  return useContext(FormCollectionContext);
};

/** Hook that throws if used outside provider */
export const useFormCollectionContextRequired = (): FormCollectionContextValue => {
  const ctx = useContext(FormCollectionContext);
  if (!ctx) throw new Error('useFormCollectionContextRequired must be used within a FormCollectionProvider');
  return ctx;
};

const DEFAULT_STEP_ID = 'contact';

export interface FormCollectionProviderProps {
  formId: string;
  /** For flat forms, single step id (e.g. 'contact'). For FormStepper, each step sets currentStepIdRef. */
  defaultStepId?: string;
  children: React.ReactNode;
}

export function FormCollectionProvider({
  formId,
  defaultStepId = DEFAULT_STEP_ID,
  children,
}: FormCollectionProviderProps) {
  const [stepsData, setStepsData] = useState<Record<string, Record<string, any>>>(() => ({}));
  const stepIdOrderRef = useRef<string[]>([]);
  const currentStepIdRef = useRef(defaultStepId);

  const registerStepId = useCallback((stepId: string) => {
    if (!stepIdOrderRef.current.includes(stepId)) {
      stepIdOrderRef.current = [...stepIdOrderRef.current, stepId];
    }
  }, []);

  const setField = useCallback((stepId: string | undefined, name: string, value: any) => {
    const sid = stepId ?? currentStepIdRef.current;
    if (!stepIdOrderRef.current.includes(sid)) {
      stepIdOrderRef.current = [...stepIdOrderRef.current, sid];
    }
    setStepsData((prev) => ({
      ...prev,
      [sid]: {
        ...(prev[sid] || {}),
        [name]: value,
      },
    }));
  }, []);

  const getPayload = useCallback(
    (meta?: Record<string, any>): FormSubmissionPayload => {
      const order = stepIdOrderRef.current.length > 0 ? stepIdOrderRef.current : Object.keys(stepsData);
      const steps: FormStepPayload[] = order
        .filter((id) => stepsData[id] && Object.keys(stepsData[id]).length > 0)
        .map((id) => ({
          id,
          fields: { ...stepsData[id] },
        }));
      return {
        formId,
        submittedAt: Date.now(),
        steps,
        meta: meta ?? {},
      };
    },
    [formId, stepsData]
  );

  const reset = useCallback(() => {
    setStepsData({});
    stepIdOrderRef.current = [];
  }, []);

  const value = useMemo<FormCollectionContextValue>(
    () => ({
      formId,
      currentStepIdRef,
      setField,
      getPayload,
      reset,
      registerStepId,
    }),
    [formId, setField, getPayload, reset, registerStepId]
  );

  return (
    <FormCollectionContext.Provider value={value}>
      {children}
    </FormCollectionContext.Provider>
  );
}

/** Wraps a single step in FormStepper so that setField(undefined, name, value) uses this stepId */
export interface FormCollectionStepScopeProps {
  stepId: string;
  children: React.ReactNode;
}

export function FormCollectionStepScope({ stepId, children }: FormCollectionStepScopeProps) {
  const ctx = useContext(FormCollectionContext);
  if (!ctx) return <>{children}</>;

  ctx.currentStepIdRef.current = stepId;
  ctx.registerStepId(stepId);

  return <>{children}</>;
}
