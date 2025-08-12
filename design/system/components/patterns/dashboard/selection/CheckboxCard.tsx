// ===============================================
// src/design-system/components/patterns/selection/CheckboxCard.tsx
// CORRECTED VERSION - Proper Icon component integration
// ===============================================

import React, { forwardRef, useId } from 'react';
import { Card, CardContent } from '../../../primitives/Card';
import { Checkbox } from '../../../primitives/Checkbox';
import { Tag, type TagVariant, type TagSize } from '../../../primitives/Tag';
import { Icon, type IconColor } from '../../../primitives/Icon';
import { cn } from '../../../../lib/utils';
import { Cluster } from '../page/Cluster';

export interface CheckboxCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children?: React.ReactNode; // Make children optional
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
  
  // IMPROVED: Better tag integration using your Tag component
  tag?: {
    text: string;
    variant?: TagVariant;
    size?: TagSize;
    icon?: React.ReactNode;
    removable?: boolean;
    onRemove?: () => void;
  };
  
  // CORRECTED: Proper icon handling for your Icon component
  icon?: React.ReactElement; // Must be a ReactElement for Icon component
  iconColor?: IconColor; // Use proper IconColor type
  
  // IMPROVED: Multiple tags support
  tags?: Array<{
    text: string;
    variant?: TagVariant;
    size?: TagSize;
    icon?: React.ReactNode;
    removable?: boolean;
    onRemove?: () => void;
  }>;
  
  checkboxPosition?: 'left' | 'right' | 'hidden';
  required?: boolean;
  error?: string;
  checkboxClassName?: string;
  
  // IMPROVED: Visual enhancements
  highlight?: boolean;
  interactive?: boolean;
  showSelectedIndicator?: boolean;
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
  tags,
  icon,
  iconColor,
  checkboxPosition = 'left',
  required = false,
  error,
  className,
  checkboxClassName,
  highlight = false,
  interactive = true,
  showSelectedIndicator = true,
  id: providedId,
  onClick,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const checkboxId = `${id}-checkbox`;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !interactive) return;
    
    // Don't trigger if clicking on tags or interactive elements (but allow label clicks)
    const target = e.target as HTMLElement;
    if (
      target.closest('.checkbox-card__tag') ||
      target.closest('button:not(.checkbox-card)') ||
      target.closest('a')
    ) {
      return;
    }
    
    // Always allow clicking anywhere in the card (including labels) to toggle
    onChange?.(!checked);
    onClick?.(e);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && interactive) {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  // Combine single tag with tags array
  const allTags = React.useMemo(() => {
    const tagArray = tags || [];
    if (tag) {
      tagArray.unshift(tag);
    }
    return tagArray;
  }, [tag, tags]);

  // Helper to render icon properly
  const renderIcon = () => {
    if (!icon) return null;

    // Determine icon color based on state
    const defaultColor: IconColor = checked ? 'accent' : 'secondary';
    const finalColor = iconColor || defaultColor;

    return (
      <div className="checkbox-card__icon">
        <Icon 
          color={finalColor}
          size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
        >
          {icon}
        </Icon>
      </div>
    );
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
        interactive && !disabled && 'checkbox-card--interactive',
        highlight && 'checkbox-card--highlight',
        className
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled || !interactive ? undefined : 0}
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
          {/* Left cluster: checkbox + optional icon */}
          <div className="checkbox-card__left">
            {checkboxPosition === 'left' && (
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

          {/* Middle: text content */}
          <div className="checkbox-card__text">
            <Cluster align='center'>
                {renderIcon()}
                {label && (
                <label
                    id={`${id}-label`}
                    className="checkbox-card__label"
                    onClick={(e) => {
                    // Don't prevent the card click, just ensure it bubbles up
                    e.stopPropagation();
                    onChange?.(!checked);
                    }}
                >
                    {label}
                    {required && (
                    <span className="checkbox-card__required" aria-label="required">
                        *
                    </span>
                    )}
                </label>
                )}
            </Cluster>
            {description && (
              <div id={`${id}-description`} className="checkbox-card__description">
                {description}
              </div>
            )}

            {children && (
              <div className="checkbox-card__children">{children}</div>
            )}
          </div>

          {/* Right: tags, badges, and right-positioned checkbox */}
          <div className="checkbox-card__aside">
            {/* Tags using your Tag component */}
            {allTags.length > 0 && (
              <div className="checkbox-card__tags">
                {allTags.map((tagProps, index) => (
                  <Tag
                    key={index}
                    variant={tagProps.variant || 'info'}
                    size={tagProps.size || (size === 'lg' ? 'large' : size === 'sm' ? 'small' : 'medium')}
                    icon={tagProps.icon}
                    removable={tagProps.removable}
                    onRemove={tagProps.onRemove}
                    disabled={disabled}
                    className="checkbox-card__tag"
                  >
                    {tagProps.text}
                  </Tag>
                ))}
              </div>
            )}

            {/* Legacy badge support */}
            {badge && (
              <div className="checkbox-card__badge">{badge}</div>
            )}

            {checkboxPosition === 'right' && (
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

            {/* Selected indicator */}
            {showSelectedIndicator && checked && checkboxPosition === 'hidden' && (
              <div className="checkbox-card__selected-indicator">
                <Icon color="accent" size="sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </Icon>
              </div>
            )}
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
// Enhanced CheckboxCardGroup with better grid handling
// ===============================================
export interface CheckboxCardGroupProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 'auto';
  gap?: 'sm' | 'md' | 'lg';
  layout?: 'grid' | 'masonry' | 'list';
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
  layout = 'grid'
}) => {
  const groupId = useId();
  const descriptionId = description ? `${groupId}-description` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;

  const getGridClasses = () => {
    if (layout === 'list') return '';
    
    if (columns === 'auto') {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
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
      className={cn(
        'checkbox-card-group',
        `checkbox-card-group--${layout}`,
        className
      )}
      role="group"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-describedby={cn(descriptionId, errorId)}
    >
      {label && (
        <label id={`${groupId}-label`} className="checkbox-card-group__label">
          {label}
          {required && (
            <span className="checkbox-card-group__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <div id={descriptionId} className="checkbox-card-group__description">
          {description}
        </div>
      )}

      <div className={cn(getGridClasses(), gapClasses, 'checkbox-card-group__container')}>
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
        <div id={errorId} className="checkbox-card-group__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};