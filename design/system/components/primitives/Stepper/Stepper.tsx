// ===============================================
// src/design-system/components/primitives/Stepper/Stepper.tsx
// ENHANCED RESPONSIVE STEPPER with dynamic pricing from database
// ===============================================

import React, { forwardRef, useEffect, useState } from 'react';
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

  // ✨ DYNAMIC PRICING SUPPORT
  totalPrice?: number;                 // Total price to display in button
  showPriceInButton?: boolean;         // Whether to show price in next button
  extraCost?: number;                  // Extra costs only (to determine if we should show price)
  formatPrice?: (price: number) => string; // Custom price formatter
  basePackageName?: string;            // Name to search for in products (e.g. "Standard hemsida")

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

  // Fetch base package price from database
  useEffect(() => {
    const fetchBasePrice = async () => {
      try {
        setPriceLoading(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${apiBaseUrl}/api/payments/db-products`);
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.products)) {
            // Find the standard package (one-time payment, not subscription)
            const standardPackage = data.products.find((p: any) => {
              const name = (p.name || '').toLowerCase();
              const searchName = basePackageName.toLowerCase();
              return p.billing_interval !== 'month' && 
                     name.includes('standard') && 
                     (name.includes('hemsida') || name.includes('paket')) &&
                     Number(p.price) > 0;
            });
            
            if (standardPackage) {
              setBasePrice(Number(standardPackage.price));
              console.log('🔍 Found base package:', standardPackage.name, 'Price:', standardPackage.price);
            } else {
              console.warn('⚠️ Standard package not found, using fallback price');
            }
          }
        } else {
          console.warn('⚠️ Failed to fetch products, using fallback price');
        }
      } catch (error) {
        console.error('❌ Error fetching base price:', error);
      } finally {
        setPriceLoading(false);
      }
    };

    if (showPriceInButton) {
      fetchBasePrice();
    } else {
      setPriceLoading(false);
    }
  }, [showPriceInButton, basePackageName]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  // Determine if we should show content
  const showContent = !hideContent && !navigationOnly && !!currentStepData;

  // Calculate actual disabled states
  const isPreviousDisabled = previousDisabled || isFirstStep;
  const isNextDisabled = nextDisabled || isLastStep;

  // Generate dynamic next button label with price
  const getNextButtonLabel = () => {
    if (!showPriceInButton || typeof totalPrice !== 'number' || priceLoading) {
      return nextLabel;
    }

    // Show price if we have extra costs or a total different from base
    const hasExtraCosts = extraCost > 0 || totalPrice > basePrice;
    if (hasExtraCosts) {
      return `${nextLabel} (${formatPrice(totalPrice)})`;
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
            <Icon size="sm" color="button-primary" className="button-icon">
              <ChevronRightIcon />
            </Icon>
          }
        >
          <span className={cn('button-text', !showLabelsOnMobile && 'md:inline hidden')}>
            {getNextButtonLabel()}
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