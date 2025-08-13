// ===============================================
// src/design-system/components/patterns/selection/CheckboxCard.tsx
// PROPER FLEXBOX LAYOUT - No absolute positioning
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
  
  // Layout - keep it simple like Chakra
  orientation?: 'horizontal' | 'vertical';
  
  // Visual
  variant?: 'default' | 'elevated' | 'outlined' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  
  // States
  required?: boolean;
  error?: string;
  
  // Additional content (like pricing in Chakra examples)
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
  variant = 'outlined',
  size = 'md',
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
    
    // Don't trigger if clicking directly on the checkbox
    const target = e.target as HTMLElement;
    if (target.closest('input[type="checkbox"]')) return;
    
    onChange?.(!checked);
    onClick?.(e);
  };

  return (
    <Card
      ref={ref}
      variant={variant}
      className={cn(
        'checkbox-card',
        `checkbox-card--${size}`,
        `checkbox-card--${orientation}`,
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
      <CardContent className="checkbox-card__inner">
        
        {/* MAIN FLEX CONTAINER */}
        <div className="checkbox-card__main">
          
          {/* LEFT: Content area */}
          <div className="checkbox-card__content">
            
            {/* ICON + TEXT ROW (for horizontal) or ICON ABOVE (for vertical) */}
            {orientation === 'vertical' ? (
              // VERTICAL LAYOUT
              <>
                {/* Icon centered above */}
                {icon && (
                  <div className="checkbox-card__icon">
                    <Icon 
                      color={checked ? 'accent' : 'secondary'}
                      size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
                    >
                      {icon}
                    </Icon>
                  </div>
                )}
                
                {/* Text content below icon */}
                <div className="checkbox-card__text">
                  {label && (
                    <label 
                      htmlFor={checkboxId} 
                      className="checkbox-card__label"
                    >
                      {label}
                      {required && <span className="checkbox-card__required">*</span>}
                    </label>
                  )}
                  
                  {description && (
                    <div className="checkbox-card__description">
                      {description}
                    </div>
                  )}
                  
                  {children && (
                    <div className="checkbox-card__children">
                      {children}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // HORIZONTAL LAYOUT
              <div className="checkbox-card__horizontal-content">
                {/* Icon inline with text */}
                {icon && (
                  <div className="checkbox-card__icon">
                    <Icon 
                      color={checked ? 'accent' : 'secondary'}
                      size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
                    >
                      {icon}
                    </Icon>
                  </div>
                )}
                
                {/* Text content */}
                <div className="checkbox-card__text">
                  {label && (
                    <label 
                      htmlFor={checkboxId} 
                      className="checkbox-card__label"
                    >
                      {label}
                      {required && <span className="checkbox-card__required">*</span>}
                    </label>
                  )}
                  
                  {description && (
                    <div className="checkbox-card__description">
                      {description}
                    </div>
                  )}
                  
                  {children && (
                    <div className="checkbox-card__children">
                      {children}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* RIGHT: Checkbox */}
          <div className="checkbox-card__checkbox">
            <Checkbox
              id={checkboxId}
              checked={checked}
              onChange={(e) => onChange?.(e.target.checked)}
              disabled={disabled}
              required={required}
              size={size}
              name={name}
              value={value}
            />
          </div>
        </div>

        {/* ADDON AREA (like pricing in Chakra examples) */}
        {addon && (
          <div className="checkbox-card__addon">
            {addon}
          </div>
        )}
        
        {/* ERROR MESSAGE */}
        {error && (
          <div className="checkbox-card__error" role="alert">
            {error}
          </div>
        )}
        
      </CardContent>
    </Card>
  );
});

CheckboxCard.displayName = 'CheckboxCard';

// CheckboxCardGroup stays the same...
export interface CheckboxCardGroupProps {
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
  gap = 'md'
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
    <div className={cn('checkbox-card-group', className)}>
      {label && (
        <div className="checkbox-card-group__label font-semibold text-lg mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      
      {description && (
        <div className="checkbox-card-group__description text-gray-600 mb-4">
          {description}
        </div>
      )}
      
      <div className={cn(getGridClasses(), gapClasses)}>
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