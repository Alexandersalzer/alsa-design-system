// ===============================================
// src/design-system/components/patterns/selection/SelectionCard.tsx
// CLEAN VERSION - Only checkbox and radio, no confusing button variant
// ===============================================

import React, { forwardRef, useId } from 'react';
import { Card, CardContent } from '../../../primitives/Card';
import { Checkbox } from '../../../primitives/Checkbox';
import { Radio } from '../../../primitives/Radio';
import { Tag, type TagVariant, type TagSize } from '../../../primitives/Tag';
import { Icon, type IconColor } from '../../../primitives/Icon';
import { cn } from '../../../../lib/utils';
import { Cluster } from '../../../layout';

export interface SelectionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children?: React.ReactNode;
  
  // Selection type - only checkbox or radio
  type: 'checkbox' | 'radio';
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  
  // Form integration (required for radio groups)
  name?: string;
  value?: string;
  
  // Visual and interaction
  disabled?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  
  // Content
  label?: string;
  description?: string;
  
  // Tags
  tag?: {
    text: string;
    variant?: TagVariant;
    size?: TagSize;
    icon?: React.ReactNode;
    removable?: boolean;
    onRemove?: () => void;
  };
  tags?: Array<{
    text: string;
    variant?: TagVariant;
    size?: TagSize;
    icon?: React.ReactNode;
    removable?: boolean;
    onRemove?: () => void;
  }>;
  
  // Icon
  icon?: React.ReactElement;
  iconColor?: IconColor;
  
  // Control positioning
  controlPosition?: 'left' | 'right';
  
  // States
  required?: boolean;
  error?: string;
  
  // Classes
  controlClassName?: string;
}

export const SelectionCard = forwardRef<HTMLDivElement, SelectionCardProps>(({
  children,
  type,
  checked = false,
  onChange,
  name,
  value,
  disabled = false,
  variant = 'outlined',
  padding = 'md',
  radius = 'md',
  size = 'md',
  label,
  description,
  tag,
  tags,
  icon,
  iconColor,
  controlPosition = 'left',
  required = false,
  error,
  className,
  controlClassName,
  id: providedId,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const controlId = `${id}-control`;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    // Don't trigger if clicking on tags or other interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('.selection-card__tag') ||
      target.closest('button:not(.selection-card)') ||
      target.closest('a')
    ) {
      return;
    }
    
    // Toggle the control
    if (type === 'checkbox') {
      onChange?.(!checked);
    } else if (type === 'radio') {
      if (!checked) { // Only allow selecting radio, not deselecting
        onChange?.(true);
      }
    }
  };

  const handleControlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      
      if (type === 'checkbox') {
        onChange?.(!checked);
      } else if (type === 'radio') {
        if (!checked) {
          onChange?.(true);
        }
      }
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

    const defaultColor: IconColor = checked ? 'accent' : 'secondary';
    const finalColor = iconColor || defaultColor;

    return (
      <div className="selection-card__icon">
        <Icon 
          color={finalColor}
          size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
        >
          {icon}
        </Icon>
      </div>
    );
  };

  // Helper to render form control
  const renderControl = () => {
    const controlProps = {
      id: controlId,
      checked: checked,
      onChange: handleControlChange,
      disabled: disabled,
      required: required,
      size: size,
      className: controlClassName,
      name: name,
      value: value
    };

    return (
      <div className="selection-card__control">
        {type === 'checkbox' ? (
          <Checkbox {...controlProps} />
        ) : (
          <Radio {...controlProps} />
        )}
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
        'selection-card',
        `selection-card--${type}`,
        `selection-card--${size}`,
        checked && 'selection-card--selected',
        disabled && 'selection-card--disabled',
        error && 'selection-card--error',
        'selection-card--interactive',
        className
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? undefined : 0}
      role={type === 'checkbox' ? 'checkbox' : 'radio'}
      aria-checked={checked}
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={description ? `${id}-description` : undefined}
      aria-disabled={disabled}
      aria-required={required}
      id={id}
      {...props}
    >
      <CardContent className="selection-card__content">
        <div className="selection-card__main">
          {/* Left: control */}
          {controlPosition === 'left' && (
            <div className="selection-card__left">
              {renderControl()}
            </div>
          )}

          {/* Middle: text content */}
          <div className="selection-card__text">
            {/* Icon + Label row */}
            <Cluster spacing='sm' align='center'>
              {renderIcon()}
              {label && (
                <label
                  id={`${id}-label`}
                  className="selection-card__label"
                  htmlFor={controlId}
                >
                  {label}
                  {required && (
                    <span className="selection-card__required" aria-label="required">
                      *
                    </span>
                  )}
                </label>
              )}
            </Cluster>

            {description && (
              <div id={`${id}-description`} className="selection-card__description">
                {description}
              </div>
            )}

            {children && (
              <div className="selection-card__children">{children}</div>
            )}
          </div>

          {/* Right: tags and right-positioned control */}
          <div className="selection-card__aside">
            {/* Tags */}
            {allTags.length > 0 && (
              <div className="selection-card__tags">
                {allTags.map((tagProps, index) => (
                  <Tag
                    key={index}
                    variant={tagProps.variant || 'info'}
                    size={tagProps.size || (size === 'lg' ? 'large' : size === 'sm' ? 'small' : 'medium')}
                    icon={tagProps.icon}
                    removable={tagProps.removable}
                    onRemove={tagProps.onRemove}
                    disabled={disabled}
                    className="selection-card__tag"
                  >
                    {tagProps.text}
                  </Tag>
                ))}
              </div>
            )}

            {/* Right-positioned control */}
            {controlPosition === 'right' && renderControl()}
          </div>
        </div>

        {error && (
          <div className="selection-card__error" role="alert">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

SelectionCard.displayName = 'SelectionCard';

// ===============================================
// SelectionCardGroup for managing groups of cards
// ===============================================
export interface SelectionCardGroupProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 'auto';
  gap?: 'sm' | 'md' | 'lg';
  layout?: 'grid' | 'list';
  
  // For radio groups - name is required for proper radio behavior
  name?: string;
  type: 'checkbox' | 'radio';
}

export const SelectionCardGroup: React.FC<SelectionCardGroupProps> = ({
  label,
  description,
  error,
  required = false,
  size = 'md',
  children,
  className,
  columns = 'auto',
  gap = 'md',
  layout = 'grid',
  name,
  type
}) => {
  const groupId = useId();
  const descriptionId = description ? `${groupId}-description` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;

  // Ensure radio groups have a name
  if (type === 'radio' && !name) {
    console.warn('SelectionCardGroup: Radio groups should have a name prop for proper form behavior');
  }

  const getGridClasses = () => {
    if (layout === 'list') return 'flex flex-col';
    
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
        'selection-card-group',
        `selection-card-group--${layout}`,
        `selection-card-group--${type}`,
        className
      )}
      role={type === 'radio' ? 'radiogroup' : 'group'}
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-describedby={cn(descriptionId, errorId)}
    >
      {label && (
        <label id={`${groupId}-label`} className="selection-card-group__label">
          {label}
          {required && (
            <span className="selection-card-group__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <div id={descriptionId} className="selection-card-group__description">
          {description}
        </div>
      )}

      <div className={cn(getGridClasses(), gapClasses, 'selection-card-group__container')}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.type as any) === SelectionCard) {
            return React.cloneElement(child as React.ReactElement<SelectionCardProps>, {
              size: (child.props as SelectionCardProps).size || size,
              type: (child.props as SelectionCardProps).type || type,
              name: type === 'radio' ? ((child.props as SelectionCardProps).name || name) : undefined,
            });
          }
          return child;
        })}
      </div>

      {error && (
        <div id={errorId} className="selection-card-group__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};