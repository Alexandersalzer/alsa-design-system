// ===============================================
// src/design-system/components/patterns/selection/CheckboxCard.tsx
// COMPLETE FILE - Both CheckboxCard and CheckboxCardGroup
// ===============================================

import React, { forwardRef, useId } from 'react';
import { Card, CardContent } from '../../../components/layout';
import { Checkbox } from '../../../components';
import { Icon } from '../../../components/media';
import { cn } from '../../../utils/cn';

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
  
  // Visual
  variant?: 'default' | 'elevated' | 'outlined' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  
  // States
  required?: boolean;
  error?: string;
  
  // Additional content
  addon?: React.ReactNode;
  
  // Form integration
  name?: string;
  value?: string;
  
  // NEW: Hide checkbox options
  hideCheckbox?: boolean | 'when-disabled' | 'when-checked';
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
  hideCheckbox = false,
  className,
  id: providedId,
  onClick,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const checkboxId = `${id}-checkbox`;

  // Determine if checkbox should be hidden
  const shouldHideCheckbox = () => {
    if (hideCheckbox === true) return true;
    if (hideCheckbox === 'when-disabled' && disabled) return true;
    if (hideCheckbox === 'when-checked' && checked) return true;
    return false;
  };

  const isCheckboxHidden = shouldHideCheckbox();

  const handleChange = (newChecked: boolean) => {
    if (disabled) return;
    onChange?.(newChecked);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isCheckboxHidden) return;
    
    // Prevent double-firing when clicking directly on checkbox
    const target = e.target as HTMLElement;
    if (target.closest('input[type="checkbox"]')) return;
    
    handleChange(!checked);
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || isCheckboxHidden) return;
    
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleChange(!checked);
    }
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
        isCheckboxHidden && 'checkbox-card--no-checkbox',
        !isCheckboxHidden && 'cursor-pointer',
        className
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled || isCheckboxHidden ? -1 : 0}
      role={isCheckboxHidden ? undefined : "checkbox"}
      aria-checked={isCheckboxHidden ? undefined : checked}
      aria-disabled={disabled}
      aria-required={required}
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={description ? `${id}-description` : undefined}
      id={id}
      {...props}
    >
      <CardContent className="checkbox-card__inner">
        
        {/* MAIN FLEX CONTAINER */}
        <div className={cn(
          "checkbox-card__main",
          isCheckboxHidden && "checkbox-card__main--no-checkbox"
        )}>
          
          {/* LEFT: Content area */}
          <div className="checkbox-card__content">
            
            {orientation === 'vertical' ? (
              // VERTICAL LAYOUT - Icon above, text left-aligned
              <>
                {/* Icon above (can be centered) */}
                {icon && (
                  <div className="checkbox-card__icon checkbox-card__icon--vertical">
                    <Icon 
                      color={checked ? 'accent' : 'secondary'}
                      size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
                    >
                      {icon}
                    </Icon>
                  </div>
                )}
                
                {/* Text content below icon - left aligned */}
                <div className="checkbox-card__text checkbox-card__text--vertical">
                  {label && (
                    <div 
                      id={`${id}-label`}
                      className="checkbox-card__label"
                    >
                      {label}
                      {required && <span className="checkbox-card__required">*</span>}
                    </div>
                  )}
                  
                  {description && (
                    <div 
                      id={`${id}-description`}
                      className="checkbox-card__description"
                    >
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
                    <div 
                      id={`${id}-label`}
                      className="checkbox-card__label"
                    >
                      {label}
                      {required && <span className="checkbox-card__required">*</span>}
                    </div>
                  )}
                  
                  {description && (
                    <div 
                      id={`${id}-description`}
                      className="checkbox-card__description"
                    >
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
          
          {/* RIGHT: Checkbox - Only show if not hidden */}
          {!isCheckboxHidden && (
            <div className="checkbox-card__checkbox">
              <Checkbox
                id={checkboxId}
                checked={checked}
                onChange={(e) => handleChange(e.target.checked)}
                disabled={disabled}
                required={required}
                size={size}
                name={name}
                value={value}
                tabIndex={-1} // Remove from tab order since card is focusable
              />
            </div>
          )}
          

        </div>

        {/* ADDON AREA - Only show if addon exists */}
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

// ===============================================
// CheckboxCardGroup Component
// ===============================================

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
    <div className={cn('checkbox-card-group', className)} role="group" aria-labelledby={label ? `${groupId}-label` : undefined}>
      {label && (
        <div id={`${groupId}-label`} className="checkbox-card-group__label font-semibold text-lg mb-2">
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