// ===============================================
// src/design-system/components/primitives/SegmentedControl/SegmentedControl.tsx
// ENHANCED SEGMENTED CONTROL WITH SLIDING TRACK AND DIVIDERS
// ===============================================

import React, { useRef, useEffect, useState } from 'react';
import { Label } from '../Typography';
import { cn } from '../../../lib/utils';
import './SegmentedControl.css';

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pill' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  disabled = false,
  className,
  'aria-label': ariaLabel
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    transform: string;
    width: string;
  }>({
    transform: 'translateX(0%)',
    width: `${100 / options.length}%`
  });

  useEffect(() => {
    const updateIndicator = () => {
      const selectedIndex = options.findIndex(option => option.value === value);
      if (selectedIndex === -1) return;

      const container = containerRef.current;
      if (!container) return;

      const buttons = container.querySelectorAll('.segmented-control__option');
      const selectedButton = buttons[selectedIndex] as HTMLElement;
      if (!selectedButton) return;

      const containerRect = container.getBoundingClientRect();
      const buttonRect = selectedButton.getBoundingClientRect();
      const containerStyle = getComputedStyle(container);
      const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;

      const relativeLeft = buttonRect.left - containerRect.left - paddingLeft;
      const buttonWidth = buttonRect.width;

      setIndicatorStyle({
        transform: `translateX(${relativeLeft}px)`,
        width: `${buttonWidth}px`,
      });
    };

    // ✅ Run after paint to ensure correct layout
    const raf = requestAnimationFrame(updateIndicator);
    // ✅ Also handle delayed fonts/layout shifts
    const timeout = setTimeout(updateIndicator, 50);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [value, options]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, optionValue: string) => {
    const currentIndex = options.findIndex(option => option.value === value);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = options.length - 1;
        break;
      default:
        return;
    }

    // Find next non-disabled option
    while (options[newIndex]?.disabled && newIndex !== currentIndex) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'Home') {
        newIndex = newIndex > 0 ? newIndex - 1 : options.length - 1;
      } else {
        newIndex = newIndex < options.length - 1 ? newIndex + 1 : 0;
      }
    }

    if (!options[newIndex]?.disabled) {
      onChange(options[newIndex].value);
    }
  };

  const selectedIndex = options.findIndex(option => option.value === value);

  return (
    <div
      ref={containerRef}
      className={cn(
        'segmented-control',
        `segmented-control--${size}`,
        variant !== 'default' && `segmented-control--${variant}`,
        fullWidth && 'segmented-control--full-width',
        disabled && 'segmented-control--disabled',
        className
      )}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        const target = e.target as HTMLElement;
        const optionValue = target.getAttribute('data-value');
        if (optionValue) {
          handleKeyDown(e, optionValue);
        }
      }}
    >
      {/* Sliding background indicator */}
      <div
        ref={indicatorRef}
        className="segmented-control__indicator"
        style={indicatorStyle}
        aria-hidden="true"
      />

      {/* Option buttons */}
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isDisabled = disabled || option.disabled;
        const isBeforeSelected = index === selectedIndex - 1;
        const isAfterSelected = index === selectedIndex + 1;

        return (
          <button
            key={option.value}
            className={cn(
              'segmented-control__option',
              isDisabled && 'segmented-control__option--disabled'
            )}
            onClick={() => !isDisabled && onChange(option.value)}
            disabled={isDisabled}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            data-value={option.value}
            data-selected={isSelected}
            data-before-selected={isBeforeSelected}
            data-after-selected={isAfterSelected}
            type="button"
          >
            {option.icon && (
              <span className="segmented-control__icon">
                {option.icon}
              </span>
            )}
            <Label
              size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'}
              weight={isSelected ? 'semibold' : 'medium'}
              color={isSelected ? 'primary' : 'secondary'}
            >
              {option.label}
            </Label>
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;