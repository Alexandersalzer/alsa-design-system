// ===============================================
// RadioCard.tsx - FIXED VERSION with proper centering
// ===============================================

import React, { forwardRef, useId, useState } from 'react';
import { Card, CardContent } from '../../../primitives/Card';
import { Radio } from '../../../primitives/Radio';
import { Icon } from '../../../primitives/Icon';
import { cn } from '../../../../lib/utils';

export interface RadioCardItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  
  // Content
  label?: string;
  description?: string;
  icon?: React.ReactElement;
  children?: React.ReactNode;
  
  // Layout - FIXED alignment options
  textAlign?: 'left' | 'center' | 'right';
  orientation?: 'horizontal' | 'vertical';
  
  // Visual
  variant?: 'default' | 'elevated' | 'outlined' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  
  // States
  required?: boolean;
  error?: string;
  
  // Additional content areas
  addon?: React.ReactNode;
  
  // Form integration (required for radio)
  name?: string;
}

export const RadioCardItem = forwardRef<HTMLDivElement, RadioCardItemProps>(({
  value,
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  icon,
  children,
  textAlign = 'left',
  orientation = 'horizontal',
  variant = 'outlined',
  size = 'md',
  required = false,
  error,
  addon,
  name,
  className,
  id: providedId,
  onClick,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const radioId = `${id}-radio`;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    // Don't trigger if clicking directly on the radio
    const target = e.target as HTMLElement;
    if (target.closest('input[type="radio"]')) return;
    
    if (!checked) {
      onChange?.(value);
    }
    onClick?.(e);
  };

  // SOLUTION: Different layouts based on text alignment
  const renderContent = () => {
    if (textAlign === 'center') {
      // CENTERED LAYOUT: Stack everything vertically and center
      return (
        <div className="radio-card__centered-layout">
          {/* Icon at top center */}
          {icon && (
            <div className="radio-card__centered-icon">
              <Icon 
                color={checked ? 'accent' : 'secondary'}
                size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
              >
                {icon}
              </Icon>
            </div>
          )}
          
          {/* Text content centered */}
          <div className="radio-card__centered-text">
            {label && (
              <label 
                htmlFor={radioId} 
                className="radio-card__label"
              >
                {label}
                {required && <span className="radio-card__required">*</span>}
              </label>
            )}
            
            {description && (
              <div className="radio-card__description">
                {description}
              </div>
            )}
            
            {children && (
              <div className="radio-card__children">
                {children}
              </div>
            )}
          </div>
          
          {/* Radio indicator - positioned absolutely in corner */}
          <div className="radio-card__indicator-overlay">
            <Radio
              id={radioId}
              name={name}
              value={value}
              checked={checked}
              onChange={(e) => e.target.checked && onChange?.(value)}
              disabled={disabled}
              required={required}
              size={size}
            />
          </div>
        </div>
      );
    }

    // LEFT/RIGHT ALIGNED LAYOUT: Original flex layout
    return (
      <>
        <div className="radio-card__main">
          {/* LEFT: Content area */}
          <div className={`radio-card__content radio-card__content--${textAlign}`}>
            {orientation === 'vertical' ? (
              // VERTICAL LAYOUT
              <>
                {icon && (
                  <div className="radio-card__icon">
                    <Icon 
                      color={checked ? 'accent' : 'secondary'}
                      size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
                    >
                      {icon}
                    </Icon>
                  </div>
                )}
                
                <div className="radio-card__text">
                  {label && (
                    <label 
                      htmlFor={radioId} 
                      className="radio-card__label"
                    >
                      {label}
                      {required && <span className="radio-card__required">*</span>}
                    </label>
                  )}
                  
                  {description && (
                    <div className="radio-card__description">
                      {description}
                    </div>
                  )}
                  
                  {children && (
                    <div className="radio-card__children">
                      {children}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // HORIZONTAL LAYOUT
              <div className="radio-card__horizontal-content">
                {icon && (
                  <div className="radio-card__icon">
                    <Icon 
                      color={checked ? 'accent' : 'secondary'}
                      size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
                    >
                      {icon}
                    </Icon>
                  </div>
                )}
                
                <div className="radio-card__text">
                  {label && (
                    <label 
                      htmlFor={radioId} 
                      className="radio-card__label"
                    >
                      {label}
                      {required && <span className="radio-card__required">*</span>}
                    </label>
                  )}
                  
                  {description && (
                    <div className="radio-card__description">
                      {description}
                    </div>
                  )}
                  
                  {children && (
                    <div className="radio-card__children">
                      {children}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* RIGHT: Radio (only for non-centered layouts) */}
          <div className="radio-card__radio">
            <Radio
              id={radioId}
              name={name}
              value={value}
              checked={checked}
              onChange={(e) => e.target.checked && onChange?.(value)}
              disabled={disabled}
              required={required}
              size={size}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <Card
      ref={ref}
      variant={variant}
      className={cn(
        'radio-card',
        `radio-card--${size}`,
        `radio-card--${orientation}`,
        `radio-card--${textAlign}`,
        checked && 'radio-card--checked',
        disabled && 'radio-card--disabled',
        error && 'radio-card--error',
        'cursor-pointer',
        className
      )}
      onClick={handleCardClick}
      tabIndex={disabled ? undefined : 0}
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      aria-required={required}
      id={id}
      {...props}
    >
      <CardContent className="radio-card__inner">
        {renderContent()}

        {/* ADDON AREA */}
        {addon && (
          <div className="radio-card__addon">
            {addon}
          </div>
        )}
        
        {/* ERROR MESSAGE */}
        {error && (
          <div className="radio-card__error" role="alert">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

RadioCardItem.displayName = 'RadioCardItem';

// Usage example:
export const ExampleUsage = () => {
  const [selected, setSelected] = useState('');

  return (
    <div className="space-y-4">
      {/* Left aligned (default) */}
      <RadioCardItem
        value="left"
        checked={selected === 'left'}
        onChange={setSelected}
        textAlign="left"
        icon={<span>🎯</span>}
        label="Left Aligned"
        description="Icon and text are left aligned"
        name="alignment"
      />

      {/* Center aligned (fixed!) */}
      <RadioCardItem
        value="center"
        checked={selected === 'center'}
        onChange={setSelected}
        textAlign="center"
        icon={<span>🎯</span>}
        label="Center Aligned"
        description="Everything is truly centered, indicator in corner"
        name="alignment"
      />

      {/* Right aligned */}
      <RadioCardItem
        value="right"
        checked={selected === 'right'}
        onChange={setSelected}
        textAlign="right"
        icon={<span>🎯</span>}
        label="Right Aligned" 
        description="Icon and text are right aligned"
        name="alignment"
      />
    </div>
  );
};