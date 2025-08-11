// ===============================================
// src/design-system/components/patterns/selection/CheckboxCard.tsx
// Checkbox Card Component for Builder Selection
// ===============================================

import React, { forwardRef, useId } from 'react';
import { Card, CardContent } from '../../../primitives/Card';
import { Checkbox } from '../../../primitives/Checkbox';
import { cn } from '../../../../lib/utils';

export interface CheckboxCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Card content */
  children: React.ReactNode;
  /** Whether the card is selected/checked */
  checked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Card padding */
  padding?: 'sm' | 'md' | 'lg';
  /** Card radius */
  radius?: 'sm' | 'md' | 'lg';
  /** Size affects spacing and typography */
  size?: 'sm' | 'md' | 'lg';
  /** Optional label for the checkbox */
  label?: string;
  /** Optional description */
  description?: string;
  /** Badge/tag content (appears in top-right) */
  badge?: React.ReactNode;
  /** Tag configuration for styled tags */
  tag?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md';
  };
  /** Icon content (appears in top-left) */
  icon?: React.ReactNode;
  /** Checkbox position */
  checkboxPosition?: 'top-left' | 'top-right' | 'hidden';
  /** Required field */
  required?: boolean;
  /** Error state */
  error?: string;
  /** Custom checkbox className */
  checkboxClassName?: string;
}

export const CheckboxCard = forwardRef<HTMLDivElement, CheckboxCardProps>(({
  children,
  checked = false,
  onChange,
  disabled = false,
  variant = 'outlined',
  padding = 'md',
  radius = 'md',
  size = 'md',
  label,
  description,
  badge,
  tag,
  icon,
  checkboxPosition = 'top-right',
  required = false,
  error,
  className,
  checkboxClassName,
  id: providedId,
  onClick,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const checkboxId = `${id}-checkbox`;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't toggle if clicking directly on checkbox or if disabled
    if (disabled || (e.target as HTMLElement).closest('.checkbox-card__checkbox')) {
      return;
    }
    
    onChange?.(!checked);
    onClick?.(e);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  return (
    <Card
      ref={ref}
      variant={variant}
      padding={padding}
      radius={radius}
      className={cn(
        'checkbox-card',
        `checkbox-card--${size}`,
        checked && 'checkbox-card--checked',
        disabled && 'checkbox-card--disabled',
        error && 'checkbox-card--error',
        !disabled && 'checkbox-card--interactive',
        className
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? undefined : 0}
      role="checkbox"
      aria-checked={checked}
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={description ? `${id}-description` : undefined}
      aria-disabled={disabled}
      aria-required={required}
      id={id}
      {...props}
    >
      <CardContent className="checkbox-card__content">
        {/* Header with checkbox, icon, and badge */}
        <div className="checkbox-card__header">
          {/* Top-left area */}
          <div className="checkbox-card__header-left">
            {checkboxPosition === 'top-left' && (
              <div className="checkbox-card__checkbox">
                <Checkbox
                  id={checkboxId}
                  checked={checked}
                  onChange={handleCheckboxChange}
                  disabled={disabled}
                  required={required}
                  size={size}
                  className={checkboxClassName}
                />
              </div>
            )}
            {icon && (
              <div className="checkbox-card__icon">
                {icon}
              </div>
            )}
          </div>

          {/* Top-right area */}
          <div className="checkbox-card__header-right">
            {(badge || tag) && (
              <div className="checkbox-card__badges">
                {tag && (
                  <div className={cn(
                    'checkbox-card__tag',
                    `checkbox-card__tag--${tag.variant || 'primary'}`,
                    `checkbox-card__tag--${tag.size || 'sm'}`
                  )}>
                    {tag.text}
                  </div>
                )}
                {badge && (
                  <div className="checkbox-card__badge">
                    {badge}
                  </div>
                )}
              </div>
            )}
            {checkboxPosition === 'top-right' && (
              <div className="checkbox-card__checkbox">
                <Checkbox
                  id={checkboxId}
                  checked={checked}
                  onChange={handleCheckboxChange}
                  disabled={disabled}
                  required={required}
                  size={size}
                  className={checkboxClassName}
                />
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="checkbox-card__body">
          {label && (
            <label
              id={`${id}-label`}
              htmlFor={checkboxPosition !== 'hidden' ? checkboxId : undefined}
              className="checkbox-card__label"
            >
              {label}
              {required && (
                <span className="checkbox-card__required" aria-label="required">
                  *
                </span>
              )}
            </label>
          )}

          {description && (
            <div
              id={`${id}-description`}
              className="checkbox-card__description"
            >
              {description}
            </div>
          )}

          <div className="checkbox-card__children">
            {children}
          </div>
        </div>

        {/* Hidden checkbox for accessibility when position is hidden */}
        {checkboxPosition === 'hidden' && (
          <Checkbox
            id={checkboxId}
            checked={checked}
            onChange={handleCheckboxChange}
            disabled={disabled}
            required={required}
            size={size}
            className={cn('sr-only', checkboxClassName)}
          />
        )}

        {/* Error message */}
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
// CHECKBOX CARD GROUP COMPONENT
// ===============================================

export interface CheckboxCardGroupProps {
  /** Group label */
  label?: string;
  /** Group description */
  description?: string;
  /** Error message for the group */
  error?: string;
  /** Required field indicator */
  required?: boolean;
  /** Size for all cards in group */
  size?: 'sm' | 'md' | 'lg';
  /** Children CheckboxCard components */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Grid layout columns */
  columns?: 1 | 2 | 3 | 4;
  /** Gap between cards */
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
  columns = 3,
  gap = 'md'
}) => {
  const groupId = useId();
  const descriptionId = description ? `${groupId}-description` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns];

  const gridGap = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }[gap];

  return (
    <div 
      className={cn('checkbox-card-group', className)} 
      role="group" 
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-describedby={cn(descriptionId, errorId)}
    >
      {label && (
        <label
          id={`${groupId}-label`}
          className="checkbox-card-group__label"
        >
          {label}
          {required && (
            <span className="checkbox-card-group__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <div
          id={descriptionId}
          className="checkbox-card-group__description"
        >
          {description}
        </div>
      )}

      <div className={cn('grid', gridColumns, gridGap, 'checkbox-card-group__grid')}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === CheckboxCard) {
            return React.cloneElement(child as React.ReactElement<CheckboxCardProps>, {
              size: (child.props as CheckboxCardProps).size || size,
            });
          }
          return child;
        })}
      </div>

      {error && (
        <div
          id={errorId}
          className="checkbox-card-group__error"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};