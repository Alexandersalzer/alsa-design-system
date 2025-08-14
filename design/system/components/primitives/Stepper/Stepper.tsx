// ===============================================
// src/design-system/components/primitives/Stepper/Stepper.tsx
// ENHANCED RESPONSIVE STEPPER - Regular + Sticky modes
// (Option A: boolean class segments, no object syntax for `cn`)
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';
import { H3, Body } from '../Typography';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// ===== STEP INTERFACE =====
export interface Step {
  label: string;
  description: string;
}

// ===== STEPPER COMPONENT =====
export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number;
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  showLabelsOnMobile?: boolean;

  // ✨ NEW STICKY MODE PROPS
  sticky?: boolean;                    // Enable sticky navigation
  stickyOffset?: string;               // CSS top value (default: '0')
  hideContent?: boolean;               // Hide step content (title/description)
  navigationOnly?: boolean;            // Show only navigation bar
  onStepClick?: (stepIndex: number) => void; // Click handler for step numbers

  // ✨ LAYOUT CONTROL
  variant?: 'default' | 'compact';     // Compact for sticky mode
  backdrop?: boolean;                  // Add backdrop blur (sticky mode)
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(({
  steps,
  currentStep,
  onPrevious,
  onNext,
  previousLabel = 'Tillbaka',
  nextLabel = 'Nästa',
  showLabelsOnMobile = false,

  // Sticky mode props
  sticky = false,
  stickyOffset = '0',
  hideContent = false,
  navigationOnly = false,
  onStepClick,

  // Layout props
  variant = 'default',
  backdrop = false,

  className,
  style,
  ...props
}, ref) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  // Determine if we should show content
  const showContent = !hideContent && !navigationOnly && !!currentStepData;

  // Build dynamic classes (boolean segments only for `cn`)
  const stepperClasses = cn(
    'stepper',
    sticky && 'stepper--sticky',
    variant === 'compact' && 'stepper--compact',
    navigationOnly && 'stepper--navigation-only',
    backdrop && 'stepper--backdrop',
    className
  );

  // Build dynamic styles
  const stepperStyles: React.CSSProperties = {
    ...style,
    ...(sticky && {
      position: 'sticky',
      top: stickyOffset,
      zIndex: 20
    })
  };

  const handleStepClick = (stepIndex: number) => {
    if (onStepClick) {
      onStepClick(stepIndex);
    }
  };

  return (
    <div
      ref={ref}
      className={stepperClasses}
      style={stepperStyles}
      {...props}
    >
      {/* Navigation row - always horizontal */}
      <div className="stepper-navigation">
        {/* Left: Previous button */}
        <Button
          variant="secondary"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="stepper-button"
          leftIcon={
            <Icon size="sm" color="button-secondary" className="button-icon">
              <ChevronLeftIcon />
            </Icon>
          }
        >
          <span className={cn('button-text', !showLabelsOnMobile && 'md:inline hidden')}>
            {previousLabel}
          </span>
        </Button>

        {/* Center: Step indicators */}
        <div className="stepper-numbers">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'step-number',
                index === currentStep && 'step-number--current',
                index < currentStep && 'step-number--completed',
                !!onStepClick && 'step-number--clickable'
              )}
              onClick={() => handleStepClick(index)}
              role={onStepClick ? 'button' : undefined}
              tabIndex={onStepClick ? 0 : undefined}
              onKeyDown={
                onStepClick
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStepClick(index);
                      }
                    }
                  : undefined
              }
              aria-label={onStepClick ? `Gå till ${steps[index]?.label}` : undefined}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Right: Next button */}
        <Button
          variant="primary"
          onClick={onNext}
          disabled={isLastStep}
          className="stepper-button"
          rightIcon={
            <Icon size="sm" color="button-primary" className="button-icon">
              <ChevronRightIcon />
            </Icon>
          }
        >
          <span className={cn('button-text', !showLabelsOnMobile && 'md:inline hidden')}>
            {nextLabel}
          </span>
        </Button>
      </div>

      {/* Content below navigation - conditionally rendered */}
      {showContent && (
        <div className="step-content">
          <H3 className="step-title">{currentStepData.label}</H3>
          <Body size="md" color="secondary" className="step-description">
            {currentStepData.description}
          </Body>
        </div>
      )}
    </div>
  );
});

Stepper.displayName = 'Stepper';
