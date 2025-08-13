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

// ===============================================
// CheckboxCardGroup component
// ===============================================
export interface CheckboxCardGroupProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  
  // Layout options
  columns?: 1 | 2 | 3 | 4 | 'auto';
  gap?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}

export const CheckboxCardGroup: React.FC<CheckboxCardGroupProps> = ({
  label,
  description,
  error,
  required = false,
  size = 'md',
  children,
  className,
  columns = 'auto',
  gap = 'md',
  orientation = 'vertical'
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
      className={cn('checkbox-card-group', className)}
      role="group"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-describedby={description ? `${groupId}-description` : undefined}
    >
      {label && (
        <div id={`${groupId}-label`} className="checkbox-card-group__label font-medium mb-2">
          {label}
          {required && <span className="checkbox-card-group__required text-red-500 ml-1">*</span>}
        </div>
      )}
      
      {description && (
        <div id={`${groupId}-description`} className="checkbox-card-group__description text-gray-600 text-sm mb-4">
          {description}
        </div>
      )}
      
      <div className={cn(getLayoutClasses(), gapClasses, 'checkbox-card-group__container')}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.type as any) === CheckboxCard) {
            return React.cloneElement(child as React.ReactElement<CheckboxCardProps>, {
              size: (child.props as CheckboxCardProps).size || size,
            });
          }
          return child;
        })}
      </div>
      
      {error && (
        <div className="checkbox-card-group__error text-red-600 text-sm mt-2" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};