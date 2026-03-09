// ===============================================
// FormStep.tsx — A single step panel inside FormStepper
// Mirrors AccordionItem: reads context to show/hide itself.
// ===============================================

import React, { useRef, useEffect } from 'react';
import { useFormStepperContext } from './FormStepperContext';

// ===============================================
// TYPES
// ===============================================

export interface FormStepProps {
  stepKey: string;
  label?: string;
  children?: React.ReactNode;
  // Injected by FormStepper via cloneElement:
  _stepIndex?: number;
}

// ===============================================
// COMPONENT
// ===============================================

export const FormStep = ({ _stepIndex = 1, children }: FormStepProps) => {
  const { currentStep } = useFormStepperContext();
  const isActive = currentStep === _stepIndex;
  const contentRef = useRef<HTMLDivElement>(null);

  // Max-height animation — same approach as AccordionItem
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isActive) {
      // Measure natural height then animate in
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      // After transition, remove fixed max-height so content can grow
      const timeout = setTimeout(() => {
        if (el) el.style.maxHeight = 'none';
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      // First set a fixed max-height so the transition works, then collapse
      el.style.maxHeight = `${el.scrollHeight}px`;
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
      data-step-index={_stepIndex}
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
