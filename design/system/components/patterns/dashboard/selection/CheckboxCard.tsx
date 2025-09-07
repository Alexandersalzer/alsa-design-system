// ===============================================
// IMPROVED CHECKBOX CARD COMPONENT
// Fixes state confusion and improves UX
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
  
  // NEW: Clear state differentiation
  isPreselected?: boolean; // Distinguishes pre-selected from user-selected
  
  // Content
  label?: string;
  description?: string;
  icon?: React.ReactElement;
  children?: React.ReactNode;
  
  // Layout - Simplified
  layout?: 'standard' | 'compact';
  
  // Visual
  variant?: 'default' | 'elevated' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  
  // States
  required?: boolean;
  error?: string;
  
  // Additional content
  addon?: React.ReactNode;
  
  // Custom labels for different states
  preselectedLabel?: string; // "Recommended", "Popular", etc.
  
  // Form integration
  name?: string;
  value?: string;
}

export const CheckboxCard = forwardRef<HTMLDivElement, CheckboxCardProps>(({
  checked = false,
  onChange,
  disabled = false,
  isPreselected = false,
  label,
  description,
  icon,
  children,
  layout = 'standard',
  variant = 'outlined',
  size = 'md',
  required = false,
  error,
  addon,
  preselectedLabel = 'Recommended',
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

  const handleChange = (newChecked: boolean) => {
    if (disabled) return;
    onChange?.(newChecked);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    // Prevent double-firing when clicking directly on checkbox
    const target = e.target as HTMLElement;
    if (target.closest('input[type="checkbox"]')) return;
    
    handleChange(!checked);
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleChange(!checked);
    }
  };

  // Determine the current state for CSS classes
  const getStateClass = () => {
    if (disabled) return 'checkbox-card--disabled';
    if (checked && isPreselected) return 'checkbox-card--checked checkbox-card--was-preselected';
    if (checked) return 'checkbox-card--checked';
    if (isPreselected) return 'checkbox-card--preselected';
    return '';
  };

  return (
    <Card
      ref={ref}
      variant={variant}
      className={cn(
        'checkbox-card',
        `checkbox-card--${size}`,
        `checkbox-card--${layout}`,
        getStateClass(),
        error && 'checkbox-card--error',
        className
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      aria-required={required}
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={description ? `${id}-description` : undefined}
      id={id}
      {...props}
    >
      <CardContent className="checkbox-card__inner">
        
        {/* PRESELECTED BADGE */}
        {isPreselected && !checked && (
          <div className="checkbox-card__badge" aria-label={`${preselectedLabel} option`}>
            {preselectedLabel}
          </div>
        )}
        
        {/* MAIN FLEX CONTAINER - Checkbox on LEFT */}
        <div className="checkbox-card__main">
          
          {/* LEFT: Checkbox - Better scan pattern */}
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
              aria-hidden="true" // Screen readers use the card's aria-checked
            />
          </div>
          
          {/* RIGHT: Content area */}
          <div className="checkbox-card__content">
            <div className="checkbox-card__content-inner">
              {/* Icon and text in a row */}
              <div className="checkbox-card__text-row">
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
                
                <div className="checkbox-card__text">
                  {label && (
                    <div 
                      id={`${id}-label`}
                      className="checkbox-card__label"
                    >
                      {label}
                      {required && <span className="checkbox-card__required" aria-label="required">*</span>}
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
                </div>
              </div>
              
              {children && (
                <div className="checkbox-card__children">
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ADDON AREA */}
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

// USAGE EXAMPLE WITH CLEAR STATE MANAGEMENT
export const CheckboxCardExample: React.FC = () => {
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>(['feature-2']); // Pre-select feature-2
  
  const features = [
    { id: 'feature-1', label: 'Basic Feature', description: 'Essential functionality' },
    { id: 'feature-2', label: 'Premium Feature', description: 'Advanced capabilities', isPreselected: true },
    { id: 'feature-3', label: 'Enterprise Feature', description: 'Full-scale solution' },
  ];

  const handleFeatureChange = (featureId: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures(prev => [...prev, featureId]);
    } else {
      setSelectedFeatures(prev => prev.filter(id => id !== featureId));
    }
  };

  return (
    <div className="space-y-4">
      <h3>Select Features</h3>
      {features.map(feature => (
        <CheckboxCard
          key={feature.id}
          label={feature.label}
          description={feature.description}
          checked={selectedFeatures.includes(feature.id)}
          isPreselected={feature.isPreselected}
          preselectedLabel="Popular"
          onChange={(checked) => handleFeatureChange(feature.id, checked)}
        />
      ))}
    </div>
  );
};

// IMPROVED GROUP COMPONENT
export interface CheckboxCardGroupProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  
  // Layout options
  layout?: 'stack' | 'grid-2' | 'grid-3' | 'grid-auto';
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
  layout = 'stack',
  gap = 'md'
}) => {
  const groupId = useId();

  const getLayoutClasses = () => {
    const layouts = {
      'stack': 'flex flex-col',
      'grid-2': 'grid grid-cols-1 md:grid-cols-2',
      'grid-3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      'grid-auto': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    };
    
    const gaps = {
      sm: 'gap-2',
      md: 'gap-4', 
      lg: 'gap-6'
    };

    return `${layouts[layout]} ${gaps[gap]}`;
  };

  return (
    <div className={cn('checkbox-card-group', className)} role="group" aria-labelledby={label ? `${groupId}-label` : undefined}>
      {label && (
        <div id={`${groupId}-label`} className="checkbox-card-group__label text-lg font-semibold mb-2">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </div>
      )}
      
      {description && (
        <div className="checkbox-card-group__description text-gray-600 mb-4">
          {description}
        </div>
      )}
      
      <div className={getLayoutClasses()}>
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