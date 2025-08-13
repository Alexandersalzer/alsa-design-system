// ===============================================
// src/design-system/components/patterns/selection/CheckboxCard.tsx
// CLEAN IMPLEMENTATION - Inspired by Chakra UI structure
// ===============================================

import React, { forwardRef, useId } from 'react';
import { Card, CardContent } from '../../../primitives/Card';
import { Checkbox } from '../../../primitives/Checkbox';
import { Icon } from '../../../primitives/Icon';
import { cn } from '../../../../lib/utils';

export interface CheckboxCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  
  // Content
  label?: string;
  description?: string;
  icon?: React.ReactElement;
  children?: React.ReactNode;
  
  // Layout
  orientation?: 'horizontal' | 'vertical';
  align?: 'start' | 'center' | 'end';
  
  // Checkbox position (following Chakra pattern)
  indicatorPlacement?: 'start' | 'end' | 'inside' | 'none';
  
  // Visual
  variant?: 'default' | 'elevated' | 'outlined' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  colorPalette?: 'gray' | 'blue' | 'green' | 'red' | 'purple';
  
  // States
  required?: boolean;
  error?: string;
  
  // Additional content areas
  addon?: React.ReactNode;
  
  // Form integration
  name?: string;
  value?: string;
}

export const CheckboxCard = forwardRef<HTMLDivElement, CheckboxCardProps>(({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  icon,
  children,
  orientation = 'horizontal',
  align = 'start',
  indicatorPlacement = 'end', // Default to right like Chakra
  variant = 'outlined',
  size = 'md',
  colorPalette = 'gray',
  required = false,
  error,
  addon,
  name,
  value,
  className,
  id: providedId,
  onClick,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const checkboxId = `${id}-checkbox`;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const target = e.target as HTMLElement;
    if (
      target.closest('button:not(.checkbox-card)') ||
      target.closest('a') ||
      target.closest('input')
    ) {
      return;
    }
    
    onChange?.(!checked);
    onClick?.(e);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  // Render checkbox indicator
  const renderIndicator = () => {
    if (indicatorPlacement === 'none') return null;
    
    return (
      <Checkbox
        id={checkboxId}
        checked={checked}
        onChange={handleCheckboxChange}
        disabled={disabled}
        required={required}
        size={size}
        name={name}
        value={value}
      />
    );
  };

  // Render icon (above content for vertical, inline for horizontal)
  const renderIcon = () => {
    if (!icon) return null;

    return (
      <div className={cn(
        'checkbox-card__icon',
        orientation === 'vertical' ? 'mb-2' : 'mr-3'
      )}>
        <Icon 
          color={checked ? 'accent' : 'secondary'}
          size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
        >
          {icon}
        </Icon>
      </div>
    );
  };

  // Render content
  const renderContent = () => {
    const hasContent = label || description || children;
    if (!hasContent && !icon) return null;

    if (orientation === 'vertical') {
      return (
        <div className="checkbox-card__content">
          {/* Icon at top */}
          {renderIcon()}
          
          <div className="checkbox-card__text">
            {label && (
              <label htmlFor={checkboxId} className="checkbox-card__label">
                {label}
                {required && <span className="checkbox-card__required">*</span>}
              </label>
            )}
            
            {description && (
              <div className="checkbox-card__description">{description}</div>
            )}
            
            {/* Inside indicator for vertical */}
            {indicatorPlacement === 'inside' && (
              <div className="checkbox-card__indicator-inside mt-2">
                {renderIndicator()}
              </div>
            )}
            
            {children && (
              <div className="checkbox-card__children">{children}</div>
            )}
          </div>
        </div>
      );
    }

    // Horizontal layout
    return (
      <div className="checkbox-card__content">
        <div className="flex items-start gap-3">
          {/* Icon inline with text */}
          {renderIcon()}
          
          <div className="checkbox-card__text flex-1">
            {label && (
              <label htmlFor={checkboxId} className="checkbox-card__label">
                {label}
                {required && <span className="checkbox-card__required">*</span>}
              </label>
            )}
            
            {description && (
              <div className="checkbox-card__description">{description}</div>
            )}
            
            {children && (
              <div className="checkbox-card__children">{children}</div>
            )}
          </div>
        </div>
        
        {/* Inside indicator for horizontal */}
        {indicatorPlacement === 'inside' && (
          <div className="checkbox-card__indicator-inside mt-3">
            {renderIndicator()}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card
      ref={ref}
      variant={variant}
      className={cn(
        'checkbox-card',
        `checkbox-card--${size}`,
        `checkbox-card--${variant}`,
        `checkbox-card--${orientation}`,
        `checkbox-card--align-${align}`,
        `checkbox-card--color-${colorPalette}`,
        checked && 'checkbox-card--checked',
        disabled && 'checkbox-card--disabled',
        error && 'checkbox-card--error',
        'cursor-pointer',
        className
      )}
      onClick={handleCardClick}
      tabIndex={disabled ? undefined : 0}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      aria-required={required}
      id={id}
      {...props}
    >
      <CardContent className={cn(
        'checkbox-card__inner',
        orientation === 'horizontal' ? 'flex items-center justify-between' : 'text-center'
      )}>
        {/* Start indicator */}
        {indicatorPlacement === 'start' && (
          <div className="checkbox-card__indicator-start">
            {renderIndicator()}
          </div>
        )}
        
        {/* Content */}
        {renderContent()}
        
        {/* End indicator (default - right side like Chakra) */}
        {indicatorPlacement === 'end' && (
          <div className="checkbox-card__indicator-end">
            {renderIndicator()}
          </div>
        )}
        
        {/* Addon area */}
        {addon && (
          <div className="checkbox-card__addon mt-4">
            {addon}
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="checkbox-card__error text-red-600 text-sm mt-2" role="alert">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

CheckboxCard.displayName = 'CheckboxCard';