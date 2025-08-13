// ===============================================
// src/design-system/components/patterns/selection/DesignRadioCard.tsx
// SPECIALIZED for design panels - compact, no radio indicator, visual-first
// ===============================================

import React, { forwardRef, useId } from 'react';
import { Card, CardContent } from '../../../primitives/Card';
import { cn } from '../../../../lib/utils';

export interface DesignRadioCardItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  
  // Content
  label?: string;
  children?: React.ReactNode;
  
  // Visual variants for different design types
  variant?: 'color' | 'typography' | 'radius' | 'default';
  
  // Size - optimized for compact design panels
  size?: 'xs' | 'sm' | 'md';
  
  // Form integration
  name?: string;
  
  // Color-specific props
  colorValue?: string;
  
  // Typography-specific props
  fontFamily?: string;
  fontPreview?: string; // e.g., "Ag" or "Aa Bb Cc"
  
  // Radius-specific props
  radiusPreview?: string; // e.g., "4px"
}

export const DesignRadioCardItem = forwardRef<HTMLDivElement, DesignRadioCardItemProps>(({
  value,
  checked = false,
  onChange,
  disabled = false,
  label,
  children,
  variant = 'default',
  size = 'sm',
  name,
  colorValue,
  fontFamily,
  fontPreview = 'Ag',
  radiusPreview,
  className,
  id: providedId,
  onClick,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    if (!checked) {
      onChange?.(value);
    }
    onClick?.(e);
  };

  // Size classes for different variants
  const sizeClasses = {
    xs: 'design-radio-card--xs',
    sm: 'design-radio-card--sm', 
    md: 'design-radio-card--md'
  };

  // Render content based on variant
  const renderContent = () => {
    switch (variant) {
      case 'color':
        return (
          <div className="design-radio-card__color-content">
            <div 
              className="design-radio-card__color-swatch"
              style={{ backgroundColor: colorValue }}
            />
            <span className="design-radio-card__color-label">{label}</span>
          </div>
        );
        
      case 'typography':
        return (
          <div className="design-radio-card__typography-content">
            <div 
              className="design-radio-card__typography-preview"
              style={{ fontFamily: fontFamily }}
            >
              {fontPreview}
            </div>
            <span className="design-radio-card__typography-label">{label}</span>
          </div>
        );
        
      case 'radius':
        return (
          <div className="design-radio-card__radius-content">
            <div className="design-radio-card__radius-preview">
              <div 
                className="design-radio-card__radius-shape"
                style={{ borderRadius: radiusPreview }}
              />
            </div>
            <span className="design-radio-card__radius-label">{label}</span>
          </div>
        );
        
      default:
        return (
          <div className="design-radio-card__default-content">
            {children}
            {label && <span className="design-radio-card__default-label">{label}</span>}
          </div>
        );
    }
  };

  return (
    <Card
      ref={ref}
      variant="outlined"
      className={cn(
        'design-radio-card',
        `design-radio-card--${variant}`,
        sizeClasses[size],
        checked && 'design-radio-card--checked',
        disabled && 'design-radio-card--disabled',
        'cursor-pointer',
        className
      )}
      onClick={handleCardClick}
      tabIndex={disabled ? undefined : 0}
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      id={id}
      {...props}
    >
      <CardContent className="design-radio-card__inner">
        {renderContent()}
      </CardContent>
    </Card>
  );
});

DesignRadioCardItem.displayName = 'DesignRadioCardItem';

// Root component for grouping
export interface DesignRadioCardRootProps {
  label?: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  
  // Grid options - optimized for design panels
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  
  // Radio group props
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  
  // Size applied to all children
  size?: 'xs' | 'sm' | 'md';
}

export const DesignRadioCardRoot: React.FC<DesignRadioCardRootProps> = ({
  label,
  description,
  error,
  children,
  className,
  columns = 3,
  gap = 'sm',
  value,
  onChange,
  name,
  size = 'sm'
}) => {
  const groupId = useId();

  const getGridClasses = () => {
    const gridColumns = {
      1: 'grid grid-cols-1',
      2: 'grid grid-cols-2',
      3: 'grid grid-cols-3',
      4: 'grid grid-cols-4',
      5: 'grid grid-cols-5',
      6: 'grid grid-cols-6',
    }[columns];

    return gridColumns;
  };

  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  }[gap];

  return (
    <div
      className={cn('design-radio-card-group', className)}
      role="radiogroup"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-describedby={description ? `${groupId}-description` : undefined}
    >
      {label && (
        <div 
          id={`${groupId}-label`}
          className="design-radio-card-group__label"
        >
          {label}
        </div>
      )}
      
      {description && (
        <div 
          id={`${groupId}-description`}
          className="design-radio-card-group__description"
        >
          {description}
        </div>
      )}
      
      <div className={cn(getGridClasses(), gapClasses)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.type as any) === DesignRadioCardItem) {
            return React.cloneElement(child as React.ReactElement<DesignRadioCardItemProps>, {
              size: (child.props as DesignRadioCardItemProps).size || size,
              name: (child.props as DesignRadioCardItemProps).name || name,
              checked: (child.props as DesignRadioCardItemProps).value === value,
              onChange: onChange || (child.props as DesignRadioCardItemProps).onChange,
            });
          }
          return child;
        })}
      </div>
      
      {error && (
        <div className="design-radio-card-group__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

// Export convenience component
export const DesignRadioCard = {
  Root: DesignRadioCardRoot,
  Item: DesignRadioCardItem,
  
  // Convenience components for specific variants
  Color: (props: Omit<DesignRadioCardItemProps, 'variant'>) => (
    <DesignRadioCardItem {...props} variant="color" />
  ),
  
  Typography: (props: Omit<DesignRadioCardItemProps, 'variant'>) => (
    <DesignRadioCardItem {...props} variant="typography" />
  ),
  
  Radius: (props: Omit<DesignRadioCardItemProps, 'variant'>) => (
    <DesignRadioCardItem {...props} variant="radius" />
  ),
};