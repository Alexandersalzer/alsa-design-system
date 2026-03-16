// ===============================================
// FormStep.tsx
// Index is passed explicitly as a prop from JSON — fully SSR-safe.
// ===============================================

import React, { useRef, useEffect } from 'react';
import { useFormStepperContext } from './FormStepperContext';

export interface FormStepProps {
  stepKey: string;
  label?: string;
  index: number;
  /** When true, automatically advances to next step when a radio input inside is selected */
  autoAdvance?: boolean;
  children?: React.ReactNode;
}

export const FormStep = ({ children, index, autoAdvance = false }: FormStepProps) => {
  const { currentStep, goNext, isLastStep } = useFormStepperContext();

  const isActive = currentStep === index;
  const contentRef = useRef<HTMLDivElement>(null);
  const advancingRef = useRef(false); // Prevent double-advance

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isActive) {
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      const timeout = setTimeout(() => { if (el) el.style.maxHeight = 'none'; }, 300);
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

  // Auto-advance: listen for radio changes inside this step
  useEffect(() => {
    if (!autoAdvance || !isActive || isLastStep) return;
    const el = contentRef.current;
    if (!el) return;

    // Reset advancing flag when step becomes active
    advancingRef.current = false;

    const handleChange = (e: Event) => {
      if (advancingRef.current) return;
      const target = e.target as HTMLElement;
      // Only react to actual radio input change events (not clicks on wrappers)
      // This ensures SelectionCard's onClick fires first to update state
      if (target.matches('input[type="radio"]')) {
        advancingRef.current = true;
        // Small delay so the selection visually registers before advancing
        setTimeout(() => goNext(), 300);
      }
    };

    // Listen ONLY for native radio change events (not clicks)
    // This allows SelectionCard's React onClick to fire first and update state
    el.addEventListener('change', handleChange);
    return () => {
      el.removeEventListener('change', handleChange);
    };
  }, [autoAdvance, isActive, isLastStep, goNext]);

  return (
    <div className="form-step" aria-hidden={!isActive} data-step-index={index}>
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
