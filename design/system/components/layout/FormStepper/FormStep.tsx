// ===============================================
// FormStep.tsx — A single step panel inside FormStepper
// Registers itself with the parent via context on mount to get its index.
// Shows/hides based on currentStep === myIndex.
// ===============================================

import React, { useRef, useEffect, useState } from 'react';
import { useFormStepperContext } from './FormStepperContext';

// ===============================================
// TYPES
// ===============================================

export interface FormStepProps {
  stepKey: string;
  label?: string;
  children?: React.ReactNode;
}

// ===============================================
// COMPONENT
// ===============================================

export const FormStep = ({ children, label }: FormStepProps) => {
  const { currentStep, registerStep } = useFormStepperContext();
  const [myIndex, setMyIndex] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;
    const index = registerStep(label);
    setMyIndex(index);
    return () => {
      // Reset on unmount so StrictMode double-invocation works correctly
      registered.current = false;
    };
  }, [registerStep, label]);

  const isActive = myIndex !== null && currentStep === myIndex;

  // Max-height animation — same approach as AccordionItem
  useEffect(() => {
    const el = contentRef.current;
    if (!el || myIndex === null) return;

    if (isActive) {
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      const timeout = setTimeout(() => {
        if (el) el.style.maxHeight = 'none';
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      // Capture current height first, then collapse in next frame
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
  }, [isActive, myIndex]);

  // Don't render at all until we have our index
  if (myIndex === null) return null;

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
