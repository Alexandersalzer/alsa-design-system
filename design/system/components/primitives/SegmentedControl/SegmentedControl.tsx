// ===============================================
// src/design-system/components/primitives/SegmentedControl/SegmentedControl.tsx
// STYLE SEGMENTED CONTROL WITH YOUR DESIGN SYSTEM
// ===============================================

import React, { useState } from 'react';
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
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  disabled = false,
  className
}) => {
  const selectedIndex = options.findIndex(option => option.value === value);

  return (
    <div
      className={cn(
        'segmented-control',
        `segmented-control--${size}`,
        `segmented-control--${variant}`,
        fullWidth && 'segmented-control--full-width',
        disabled && 'segmented-control--disabled',
        className
      )}
      role="radiogroup"
    >
      {/* Background indicator that slides */}
      <div
        className="segmented-control__indicator"
        style={{
          transform: `translateX(${selectedIndex * 100}%)`,
          width: `${100 / options.length}%`
        }}
      />
      
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isDisabled = disabled || option.disabled;
        
        return (
          <button
            key={option.value}
            className={cn(
              'segmented-control__option',
              isSelected && 'segmented-control__option--selected',
              isDisabled && 'segmented-control__option--disabled'
            )}
            onClick={() => !isDisabled && onChange(option.value)}
            disabled={isDisabled}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
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

// Export the component and types
export default SegmentedControl;