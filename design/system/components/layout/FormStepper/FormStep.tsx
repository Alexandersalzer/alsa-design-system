// ===============================================
// FormStep.tsx — A single step panel inside FormStepper
// Index is claimed synchronously during render via context counter.
// Label is registered synchronously during render via context ref write.
// No useEffect registration — immune to StrictMode double-invoke.
// ===============================================

import React, { useRef, useEffect } from 'react';
import { useFormStepperContext } from './FormStepperContext';

export interface FormStepProps {
  stepKey: string;
  label?: string;
  children?: React.ReactNode;
}

export const FormStep = ({ children, label }: FormStepProps) => {
  const { currentStep, claimIndex, registerLabel } = useFormStepperContext();

  // Claim index synchronously during render — no async useEffect needed.
  // claimIndex() increments a render-time counter in FormStepper that resets each render.
  // This is safe to call in render because it only reads/writes a ref (no state).
  const myIndex = claimIndex();

  // Register label synchronously during render — writes to a ref in FormStepper.
  // Safe to call in render because it only writes a ref, not state.
  registerLabel(myIndex, label);

  const isActive = currentStep === myIndex;
  const contentRef = useRef<HTMLDivElement>(null);

  // Max-height animation
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isActive) {
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      const timeout = setTimeout(() => {
        if (el) el.style.maxHeight = 'none';
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      const currentHeight = el.scrollHeight;
      el.style.maxHeight = `${currentHeight}px`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (el) {
            el.style.maxHeight = '0';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-8px)';
          }
        });
      });
    }
  }, [isActive]);

  return (
    <div
      className="form-step"
      aria-hidden={!isActive}
      data-step-index={myIndex}
    >
      <div
        ref={contentRef}
        className="form-step__content"
        style={{
          maxHeight: isActive ? 'none' : '0',
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'translateY(0)' : 'translateY(-8px)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

FormStep.displayName = 'FormStep';
