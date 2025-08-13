// ===============================================
// src/design-system/components/patterns/selection/RadioCard.tsx
// CLEAN IMPLEMENTATION - Inspired by Chakra UI structure
// ===============================================

import React, { forwardRef, useId } from 'react';
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
  
  // Layout
  orientation?: 'horizontal' | 'vertical';
  align?: 'start' | 'center' | 'end';
  
  // Radio position (following Chakra pattern)
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
  
  // Form integration (required for radio)
  name: string;
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
  align = 'start',
  indicatorPlacement = 'end', // Default to right like Chakra
  variant = 'outlined',
  size = 'md',
  colorPalette = 'gray',
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
    
    const target = e.target as HTMLElement;
    if (
      target.closest('button:not(.radio-card)') ||
      target.closest('a') ||
      target.closest('input')
    ) {
      return;
    }
    
    if (!checked) {
      onChange?.(value);
    }
    onClick?.(e);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange?.(value);
    }
  };

  // Render radio indicator
  const renderIndicator = () => {
    if (indicatorPlacement === 'none') return null;
    
    return (
      <Radio
        id={radioId}
        name={name}
        value={value}
        checked={checked}
        onChange={handleRadioChange}
        disabled={disabled}
        required={required}
        size={size}
      />
    );
  };

  // Render icon (above content for vertical, inline for horizontal)
  const renderIcon = () => {
    if (!icon) return null;

    return (
      <div className={cn(
        'radio-card__icon',
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
        <div className="radio-card__content">
          {/* Icon at top */}
          {renderIcon()}
          
          <div className="radio-card__text">
            {label && (
              <label htmlFor={radioId} className="radio-card__label">
                {label}
                {required && <span className="radio-card__required">*</span>}
              </label>
            )}
            
            {description && (
              <div className="radio-card__description">{description}</div>
            )}
            
            {/* Inside indicator for vertical */}
            {indicatorPlacement === 'inside' && (
              <div className="radio-card__indicator-inside mt-2">
                {renderIndicator()}
              </div>
            )}
            
            {children && (
              <div className="radio-card__children">{children}</div>
            )}
          </div>
        </div>
      );
    }

    // Horizontal layout
    return (
      <div className="radio-card__content">
        <div className="flex items-start gap-3">
          {/* Icon inline with text */}
          {renderIcon()}
          
          <div className="radio-card__text flex-1">
            {label && (
              <label htmlFor={radioId} className="radio-card__label">
                {label}
                {required && <span className="radio-card__required">*</span>}
              </label>
            )}
            
            {description && (
              <div className="radio-card__description">{description}</div>
            )}
            
            {children && (
              <div className="radio-card__children">{children}</div>
            )}
          </div>
        </div>
        
        {/* Inside indicator for horizontal */}
        {indicatorPlacement === 'inside' && (
          <div className="radio-card__indicator-inside mt-3">
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
        'radio-card',
        `radio-card--${size}`,
        `radio-card--${variant}`,
        `radio-card--${orientation}`,
        `radio-card--align-${align}`,
        `radio-card--color-${colorPalette}`,
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
      <CardContent className={cn(
        'radio-card__inner',
        orientation === 'horizontal' ? 'flex items-center justify-between' : 'text-center'
      )}>
        {/* Start indicator */}
        {indicatorPlacement === 'start' && (
          <div className="radio-card__indicator-start">
            {renderIndicator()}
          </div>
        )}
        
        {/* Content */}
        {renderContent()}
        
        {/* End indicator (default - right side like Chakra) */}
        {indicatorPlacement === 'end' && (
          <div className="radio-card__indicator-end">
            {renderIndicator()}
          </div>
        )}
        
        {/* Addon area */}
        {addon && (
          <div className="radio-card__addon mt-4">
            {addon}
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="radio-card__error text-red-600 text-sm mt-2" role="alert">
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
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
  className?: string;
  
  // Layout options
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
  orientation = 'vertical',
  children,
  className,
  columns = 'auto',
  gap = 'md',
  value,
  onChange,
  name
}) => {
  const groupId = useId();

  const getLayoutClasses = () => {
    if (orientation === 'horizontal') {
      return 'flex flex-wrap';
    }
    
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
        <div id={`${groupId}-label`} className="radio-card-group__label font-medium mb-2">
          {label}
          {required && <span className="radio-card-group__required text-red-500 ml-1">*</span>}
        </div>
      )}
      
      {description && (
        <div id={`${groupId}-description`} className="radio-card-group__description text-gray-600 text-sm mb-4">
          {description}
        </div>
      )}
      
      <div className={cn(getLayoutClasses(), gapClasses, 'radio-card-group__container')}>
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