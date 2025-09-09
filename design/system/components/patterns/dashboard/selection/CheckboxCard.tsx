// ===============================================
// Modified CheckboxCard.tsx - Add hideCheckbox prop
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
          
          {/* OPTIONAL: Show a visual indicator when checkbox is hidden but checked */}
          {isCheckboxHidden && checked && (
            <div className="checkbox-card__indicator">
              <Icon color="success" size="sm">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                </svg>
              </Icon>
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