// ===============================================
// FIXED: src/design-system/components/primitives/Stepper/Stepper.tsx
// Fixed: Next button now properly becomes active on last step when conditions are met
// ===============================================

import React, { forwardRef, useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { H3, Body } from '../../../components/Typography';
import { Button } from '../../../components/actions/Button';
import { Icon } from '../../../components/media';
import { HStack } from '../../../components/layout/hStack/HStack';
import { VStack } from '../../../components/layout/vStack/VStack';
import { Box } from '../../../components/layout/box/Box';
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

  // ✨ DYNAMIC PRICING SUPPORT
  totalPrice?: number;                 // Total price to display in button
  showPriceInButton?: boolean;         // Whether to show price in next button
  extraCost?: number;                  // Extra costs only (to determine if we should show price)
  formatPrice?: (price: number) => string; // Custom price formatter
  basePackageName?: string;            // Name to search for in products (e.g. "Standard hemsida")
  basePackagePrice?: number;           // Current base package price (0 for single-page, multipage price for multi-page)
  showBasePriceAlways?: boolean;       // Always show base price, even if 0

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

  // Pricing props
  totalPrice,
  showPriceInButton = false,
  extraCost = 0,
  formatPrice = (price: number) => `${price.toLocaleString('sv-SE')} kr`,
  basePackageName = 'Standard hemsida',
  basePackagePrice,
  showBasePriceAlways = false,

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
  const [basePrice, setBasePrice] = useState<number>(6999); // Fallback price
  const [priceLoading, setPriceLoading] = useState<boolean>(true);

  // Use provided basePackagePrice or fallback to hardcoded value
  useEffect(() => {
    if (showPriceInButton || showBasePriceAlways) {
      // Use provided price prop or fallback to 0 (since we now handle base prices explicitly)
      const priceToUse = basePackagePrice ?? 0;
      setBasePrice(priceToUse);
      console.log('🔍 Using base package price:', priceToUse, basePackagePrice !== undefined ? '(from prop)' : '(fallback to 0)');
    }
    setPriceLoading(false);
  }, [showPriceInButton, showBasePriceAlways, basePackagePrice]);

  const isFirstStep = currentStep <= 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = currentStep >= 0 ? steps[currentStep] : null;

  // Determine if we should show content
  const showContent = !hideContent && !navigationOnly && !!currentStepData;

  // ✅ FIXED: Calculate actual disabled states
  const isPreviousDisabled = previousDisabled || isFirstStep;
  // On last step, respect nextDisabled prop only. Don't auto-disable.
  // This allows parent (StepWizard) to control the button state based on form validation
  const isNextDisabled = nextDisabled;

  // Generate dynamic next button label with price
  const getNextButtonLabel = () => {
    if (priceLoading) {
      return nextLabel;
    }

    // Always show price if showBasePriceAlways is true, regardless of extra costs
    if (showBasePriceAlways && typeof totalPrice === 'number') {
      return formatPrice(totalPrice);
    }

    // Show price if showPriceInButton is true and we have extra costs
    if (showPriceInButton && typeof totalPrice === 'number') {
      const hasExtraCosts = extraCost > 0 || totalPrice > basePrice;
      if (hasExtraCosts) {
        return formatPrice(totalPrice);
      }
    }
    
    return nextLabel;
  };

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
    <VStack
      ref={ref}
      className={stepperClasses}
      style={stepperStyles}
      spacing="lg"
      {...props}
    >
      {/* Navigation row - always horizontal */}
      <HStack
        className="stepper-navigation"
        justify="between"
        align="center"
        spacing="md"
      >
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
        <HStack className="stepper-numbers" justify="center" align="center" spacing="sm">
          {steps.map((step, index) => {
            // Determine the state - only ONE state at a time
            const isCurrent = index === currentStep;
            const isCompleted = index < currentStep;
            const isDisabled = step.disabled;
            const isClickable = !!onStepClick && !step.disabled;

            return (
              <Box
                key={index}
                className={cn(
                  'step-number',
                  // Apply state classes in order of priority (only one should be true)
                  isCurrent && 'step-number--current',
                  !isCurrent && isCompleted && 'step-number--completed',
                  !isCurrent && !isCompleted && isDisabled && 'step-number--disabled',
                  isClickable && 'step-number--clickable'
                )}
                onClick={() => !step.disabled && handleStepClick(index)}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={
                  isClickable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleStepClick(index);
                        }
                      }
                    : undefined
                }
                aria-label={isClickable ? `Gå till ${step.label}` : undefined}
                aria-disabled={step.disabled}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {index + 1}
              </Box>
            );
          })}
        </HStack>

        {/* Right: Next button with dynamic pricing */}
        <Button
          variant="accent"
          onClick={onNext}
          disabled={isNextDisabled}
          className={cn(
            'stepper-button',
            showPriceInButton && totalPrice && (extraCost || 0) > 0 ? 'stepper-button--with-price' : false
          )}
          rightIcon={
            <Icon size="sm" color="button-accent" className="button-icon">
              <ChevronRightIcon />
            </Icon>
          }
        >
          <span className={cn('button-text', !showLabelsOnMobile && 'md:inline hidden')}>
            {getNextButtonLabel()}
          </span>
        </Button>
      </HStack>

      {/* Content below navigation - conditionally rendered */}
      {showContent && (
        <VStack className="step-content" align="center" spacing="sm">
          <H3 className="step-title">{currentStepData.label}</H3>
          <Body size="md" color="secondary" className="step-description">
            {currentStepData.description}
          </Body>
        </VStack>
      )}
    </VStack>
  );
});

Stepper.displayName = 'Stepper';