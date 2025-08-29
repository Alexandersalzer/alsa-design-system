// ===============================================
// src/design-system/components/primitives/Stepper/Stepper.tsx
// ENHANCED RESPONSIVE STEPPER with disabled button support
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
  disabled?: boolean; // Individual step can be disabled
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

  // ✨ BUTTON DISABLED STATES
  nextDisabled?: boolean;
  previousDisabled?: boolean;

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

  // Button disabled props
  nextDisabled = false,
  previousDisabled = false,

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

  // Calculate actual disabled states
  const isPreviousDisabled = previousDisabled || isFirstStep;
  const isNextDisabled = nextDisabled || isLastStep;

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
    if (onStepClick && !steps[stepIndex]?.disabled) {
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
          disabled={isPreviousDisabled}
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
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                'step-number',
                index === currentStep && 'step-number--current',
                index < currentStep && 'step-number--completed',
                step.disabled && 'step-number--disabled',
                !!onStepClick && !step.disabled && 'step-number--clickable'
              )}
              onClick={() => !step.disabled && handleStepClick(index)}
              role={onStepClick && !step.disabled ? 'button' : undefined}
              tabIndex={onStepClick && !step.disabled ? 0 : undefined}
              onKeyDown={
                onStepClick && !step.disabled
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStepClick(index);
                      }
                    }
                  : undefined
              }
              aria-label={onStepClick && !step.disabled ? `Gå till ${step.label}` : undefined}
              aria-disabled={step.disabled}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Right: Next button */}
        <Button
          variant="primary"
          onClick={onNext}
          disabled={isNextDisabled}
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