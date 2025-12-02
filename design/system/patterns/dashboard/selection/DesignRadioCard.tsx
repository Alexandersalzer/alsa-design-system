// ===============================================
// ACTUALLY FIXED DesignRadioCard.tsx - Real issues identified and fixed
// KEY ISSUES FOUND:
// 1. Missing CSS classes that SelectionCard has
// 2. Card click handling is different 
// 3. Missing proper cursor and interaction styles
// 4. Radio input positioning wrong
// ===============================================

import React, { forwardRef, useId } from 'react';
import { Card, CardContent } from '../../../components/layout';
import { cn } from '../../../utils/cn';

export interface DesignRadioCardItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
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
  fontPreview?: string;
  
  // Radius-specific props
  radiusPreview?: string;
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
  const radioId = `${id}-radio`;

  // ✅ FIXED: Handle card click EXACTLY like SelectionCard
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    

    
    // Don't trigger if clicking on other interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button:not(.design-radio-card)') || target.closest('a')) {
      return;
    }
    
    // For radio, only allow selecting (not deselecting) - SAME AS SELECTIONCARD
    if (!checked) {

      onChange?.(true);
    }
    
    onClick?.(e);
  };

  // ✅ FIXED: Handle hidden radio input change - SAME AS SELECTIONCARD
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    onChange?.(e.target.checked);
  };

  // ✅ FIXED: Handle keyboard interaction - SAME AS SELECTIONCARD
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      if (!checked) {
        onChange?.(true);
      }
    }
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
            <span 
              className="design-radio-card__typography-label"
              style={{ fontFamily: fontFamily }} // Använd samma font för label
            >
              {label}
            </span>
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
    <div
      ref={ref}
      className={cn(
        // ✅ FIXED: Add all the same base classes as SelectionCard
        'design-radio-card',
        'design-radio-card--interactive', // ✅ CRITICAL: This enables click behavior
        `design-radio-card--${variant}`,
        `design-radio-card--${size}`,
        checked && 'design-radio-card--checked',
        disabled && 'design-radio-card--disabled',
        'cursor-pointer', // ✅ CRITICAL: This shows it's clickable
        className
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? undefined : 0}
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      aria-labelledby={label ? `${id}-label` : undefined}
      id={id}
      style={{
        // ✅ FIXED: Ensure proper styling for interaction
        position: 'relative',
        transition: 'all 0.15s ease',
        border: `2px solid ${checked ? 'var(--accent-500)' : 'var(--border-input)'}`,
        backgroundColor: checked ? 'var(--secondary-100)' : 'var(--surface-card, white)',
        ...props.style
      }}
      {...props}
    >
      {/* ✅ FIXED: Hidden radio input positioned properly */}
      <input
        type="radio"
        id={radioId}
        name={name}
        value={value}
        checked={checked}
        onChange={handleRadioChange}
        disabled={disabled}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        tabIndex={-1}
      />
      
      {/* ✅ FIXED: Content wrapper with proper padding */}
      <div 
        className="design-radio-card__inner"
        style={{
          padding: size === 'xs' ? '8px' : size === 'sm' ? '12px' : '16px',
          minHeight: size === 'xs' ? '40px' : size === 'sm' ? '50px' : '60px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
});

DesignRadioCardItem.displayName = 'DesignRadioCardItem';

// ✅ FIXED: Root component with proper radio group management
export interface DesignRadioCardRootProps {
  label?: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  
  // Grid options
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

  // ✅ FIXED: Handle individual item changes and convert to group change
  const handleItemChange = (itemValue: string) => (checked: boolean) => {
    if (checked) {
      onChange?.(itemValue);
    }
  };

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
            const childProps = child.props as DesignRadioCardItemProps;
            const isChecked = childProps.value === value;
            
        
            
            return React.cloneElement(child as React.ReactElement<DesignRadioCardItemProps>, {
              size: childProps.size || size,
              name: childProps.name || name,
              checked: isChecked,
              onChange: handleItemChange(childProps.value),
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