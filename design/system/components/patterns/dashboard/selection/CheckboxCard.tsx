// ===============================================
// src/design-system/components/patterns/selection/CheckboxCard.tsx
// Checkbox Card Component for Builder Selection (Row-first redesign)
// ===============================================

import React, { forwardRef, useId } from 'react';
import { Card, CardContent } from '../../../primitives/Card';
import { Checkbox } from '../../../primitives/Checkbox';
import { cn } from '../../../../lib/utils';

export interface CheckboxCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  badge?: React.ReactNode;
  tag?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md';
  };
  icon?: React.ReactNode;
  /** inline checkbox position */
  checkboxPosition?: 'left' | 'right' | 'hidden' | 'top-left' | 'top-right'; // top-* kept for back-compat
  required?: boolean;
  error?: string;
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
  checkboxPosition = 'right',
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

  // Map deprecated values
  const resolvedCheckboxPos: 'left' | 'right' | 'hidden' =
    checkboxPosition === 'top-left' ? 'left' :
    checkboxPosition === 'top-right' ? 'right' :
    (checkboxPosition as 'left' | 'right' | 'hidden');

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || (e.target as HTMLElement).closest('.checkbox-card__checkbox')) return;
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
        <div className="checkbox-card__main">
          {/* Left cluster */}
          <div className="checkbox-card__left">
            {resolvedCheckboxPos === 'left' && (
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
            {icon && <div className="checkbox-card__icon">{icon}</div>}
          </div>

          {/* Text stack */}
          <div className="checkbox-card__text">
            {label && (
              <label
                id={`${id}-label`}
                htmlFor={resolvedCheckboxPos !== 'hidden' ? checkboxId : undefined}
                className="checkbox-card__label"
              >
                {label}
                {required && <span className="checkbox-card__required" aria-label="required">*</span>}
              </label>
            )}

            {description && (
              <div id={`${id}-description`} className="checkbox-card__description">
                {description}
              </div>
            )}

            <div className="checkbox-card__children">{children}</div>
          </div>

          {/* Right-side badges / checkbox */}
          <div className="checkbox-card__aside">
            {(tag || badge) && (
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
                {badge && <div className="checkbox-card__badge">{badge}</div>}
              </div>
            )}

            {resolvedCheckboxPos === 'right' && (
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

        {/* Hidden checkbox for a11y when position is hidden */}
        {resolvedCheckboxPos === 'hidden' && (
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

        {error && (
          <div className="checkbox-card__error" role="alert">{error}</div>
        )}
      </CardContent>
    </Card>
  );
});

CheckboxCard.displayName = 'CheckboxCard';

// ===============================================
// CheckboxCardGroup unchanged (kept for context) – only classNames remain the same
// ===============================================
export interface CheckboxCardGroupProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
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
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  const gridGap = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }[gap];

  return (
    <div
      className={cn('checkbox-card-group', className)}
      role="group"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-describedby={cn(descriptionId, errorId)}
    >
      {label && (
        <label id={`${groupId}-label`} className="checkbox-card-group__label">
          {label}
          {required && <span className="checkbox-card-group__required" aria-label="required">*</span>}
        </label>
      )}

      {description && (
        <div id={descriptionId} className="checkbox-card-group__description">{description}</div>
      )}

      <div className={cn('grid', gridColumns, gridGap, 'checkbox-card-group__grid')}>
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
        <div id={errorId} className="checkbox-card-group__error" role="alert">{error}</div>
      )}
    </div>
  );
};
