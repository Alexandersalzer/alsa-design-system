// ===============================================
// src/design-system/components/patterns/selection/RadioCard.tsx
// PROPER FLEXBOX LAYOUT - No absolute positioning
// ===============================================

import React, { forwardRef, useId } from 'react';
import { Card, CardContent } from '../../../components/layout';
import { Radio } from '../../../components';
import { Icon } from '../../../components/media';
import { cn } from '../../../utils/cn';

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
  
  // Layout - keep it simple like Chakra
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

  return (
    <Card
      ref={ref}
      variant={variant}
      className={cn(
        'radio-card',
        `radio-card--${size}`,
        `radio-card--${orientation}`,
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
        
        {/* MAIN FLEX CONTAINER */}
        <div className="radio-card__main">
          
          {/* LEFT: Content area */}
          <div className="radio-card__content">
            
            {/* ICON + TEXT ROW (for horizontal) or ICON ABOVE (for vertical) */}
            {orientation === 'vertical' ? (
              // VERTICAL LAYOUT
              <>
                {/* Icon centered above */}
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
                
                {/* Text content below icon */}
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
                {/* Icon inline with text */}
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
                
                {/* Text content */}
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
          
          {/* RIGHT: Radio */}
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

        {/* ADDON AREA (like pricing in Chakra examples) */}
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

// RadioCard Root component for grouping
export interface RadioCardRootProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  
  // Grid options
  columns?: 1 | 2 | 3 | 4 | 'auto';
  gap?: 'sm' | 'md' | 'lg';
  
  // Radio group props
  value?: string;
  onChange?: (value: string) => void;
  name: string;
}

export const RadioCardRoot: React.FC<RadioCardRootProps> = ({
  label,
  description,
  error,
  required = false,
  size = 'md',
  children,
  className,
  columns = 'auto',
  gap = 'md',
  value,
  onChange,
  name
}) => {
  const groupId = useId();

  const getGridClasses = () => {
    if (columns === 'auto') {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
    
    const gridColumns = {
      1: 'grid grid-cols-1',
      2: 'grid grid-cols-1 md:grid-cols-2',
      3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }[columns];

    return gridColumns;
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }[gap];

  return (
    <div
      className={cn('radio-card-group', className)}
      role="radiogroup"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-describedby={description ? `${groupId}-description` : undefined}
    >
      {label && (
        <div className="radio-card-group__label font-semibold text-lg mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      
      {description && (
        <div className="radio-card-group__description text-gray-600 mb-4">
          {description}
        </div>
      )}
      
      <div className={cn(getGridClasses(), gapClasses, 'items-start')}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.type as any) === RadioCardItem) {
            return React.cloneElement(child as React.ReactElement<RadioCardItemProps>, {
              size: (child.props as RadioCardItemProps).size || size,
              name: (child.props as RadioCardItemProps).name || name,
              checked: (child.props as RadioCardItemProps).value === value,
              onChange: onChange || (child.props as RadioCardItemProps).onChange,
            });
          }
          return child;
        })}
      </div>
      
      {error && (
        <div className="radio-card-group__error text-red-600 text-sm mt-2" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

// Export convenience components
export const RadioCard = {
  Root: RadioCardRoot,
  Item: RadioCardItem
};