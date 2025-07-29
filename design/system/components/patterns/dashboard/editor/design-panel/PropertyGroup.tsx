// ===============================================
// src/design-system/components/patterns/editor/design-panel/PropertyGroup.tsx
// PROPERTY GROUP - Related property controls
// ===============================================

import React, { ReactNode } from 'react';
import { cn } from '@/design/system/lib/utils';

// Import primitives
import { Typography } from '@/design/system/components/primitives/Typography';

// ===== TYPE DEFINITIONS =====
export interface PropertyGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group content */
  children: ReactNode;
  /** Group label */
  label?: string;
  /** Group description */
  description?: string;
  /** Group layout */
  layout?: 'vertical' | 'horizontal' | 'grid' | 'inline';
  /** Grid columns (when layout is 'grid') */
  columns?: 2 | 3 | 4 | 6;
  /** Group spacing */
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  /** Group alignment */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Disabled state */
  disabled?: boolean;
  /** Required indicator */
  required?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Additional CSS classes */
  className?: string;
}

// ===== MAIN COMPONENT =====
export const PropertyGroup = React.forwardRef<HTMLDivElement, PropertyGroupProps>(({
  children,
  label,
  description,
  layout = 'vertical',
  columns = 2,
  spacing = 'md',
  align = 'stretch',
  disabled = false,
  required = false,
  error = false,
  errorMessage,
  className,
  ...props
}, ref) => {
  
  const groupClasses = cn(
    'property-group',
    `property-group--${layout}`,
    `property-group--spacing-${spacing}`,
    `property-group--align-${align}`,
    layout === 'grid' && `property-group--cols-${columns}`,
    disabled && 'property-group--disabled',
    error && 'property-group--error',
    className
  );

  return (
    <div 
      ref={ref}
      className={groupClasses}
      {...props}
    >
      {/* Group Header */}
      {(label || description) && (
        <div className="property-group__header">
          {label && (
            <Typography 
              variant="label-xs" 
              weight="medium" 
              color={disabled ? 'disabled' : error ? 'error' : 'secondary'}
              className="property-group__label"
            >
              {label}
              {required && (
                <span className="property-group__required" aria-label="Required">
                  *
                </span>
              )}
            </Typography>
          )}
          {description && (
            <Typography 
              variant="body-xs" 
              color={disabled ? 'disabled' : 'tertiary'}
              className="property-group__description"
            >
              {description}
            </Typography>
          )}
        </div>
      )}

      {/* Group Content */}
      <div className="property-group__content">
        {children}
      </div>

      {/* Error Message */}
      {error && errorMessage && (
        <div className="property-group__error">
          <Typography 
            variant="body-xs" 
            color="error"
            className="property-group__error-message"
          >
            {errorMessage}
          </Typography>
        </div>
      )}
    </div>
  );
});

PropertyGroup.displayName = 'PropertyGroup';

// ===== CONVENIENCE COMPONENTS =====

// Inline Group (for labels and inputs on same line)
export interface InlinePropertyGroupProps extends Omit<PropertyGroupProps, 'layout'> {}

export const InlinePropertyGroup: React.FC<InlinePropertyGroupProps> = (props) => (
  <PropertyGroup layout="inline" {...props} />
);

// Grid Group (for multiple controls in a grid)
export interface GridPropertyGroupProps extends Omit<PropertyGroupProps, 'layout'> {
  columns?: 2 | 3 | 4 | 6;
}

export const GridPropertyGroup: React.FC<GridPropertyGroupProps> = ({ 
  columns = 2, 
  ...props 
}) => (
  <PropertyGroup layout="grid" columns={columns} {...props} />
);

// Horizontal Group (for controls side by side)
export interface HorizontalPropertyGroupProps extends Omit<PropertyGroupProps, 'layout'> {}

export const HorizontalPropertyGroup: React.FC<HorizontalPropertyGroupProps> = (props) => (
  <PropertyGroup layout="horizontal" {...props} />
);

// Vertical Group (default, for stacked controls)
export interface VerticalPropertyGroupProps extends Omit<PropertyGroupProps, 'layout'> {}

export const VerticalPropertyGroup: React.FC<VerticalPropertyGroupProps> = (props) => (
  <PropertyGroup layout="vertical" {...props} />
);

// ===== SPECIALIZED PROPERTY GROUPS =====

// Color Picker Group
export interface ColorPickerGroupProps extends Omit<PropertyGroupProps, 'layout'> {
  /** Color values array */
  colors?: string[];
  /** Selected color */
  selectedColor?: string;
  /** Color change handler */
  onColorChange?: (color: string) => void;
}

export const ColorPickerGroup: React.FC<ColorPickerGroupProps> = ({
  colors = [],
  selectedColor,
  onColorChange,
  children,
  ...props
}) => (
  <PropertyGroup layout="grid" columns={6} spacing="sm" {...props}>
    {colors.map((color, index) => (
      <button
        key={index}
        type="button"
        className={cn(
          'property-group__color-swatch',
          selectedColor === color && 'property-group__color-swatch--selected'
        )}
        style={{ backgroundColor: color }}
        onClick={() => onColorChange?.(color)}
        aria-label={`Select color ${color}`}
      />
    ))}
    {children}
  </PropertyGroup>
);

// Input Pair Group (e.g., width/height, x/y)
export interface InputPairGroupProps extends Omit<PropertyGroupProps, 'layout' | 'children'> {
  /** First input */
  firstInput: ReactNode;
  /** Second input */
  secondInput: ReactNode;
  /** Show link/unlink button */
  linkable?: boolean;
  /** Linked state */
  linked?: boolean;
  /** Link toggle handler */
  onLinkToggle?: (linked: boolean) => void;
}

export const InputPairGroup: React.FC<InputPairGroupProps> = ({
  firstInput,
  secondInput,
  linkable = false,
  linked = false,
  onLinkToggle,
  ...props
}) => (
  <PropertyGroup layout="horizontal" spacing="sm" {...props}>
    <div className="property-group__input-pair">
      <div className="property-group__input-pair-input">
        {firstInput}
      </div>
      {linkable && (
        <button
          type="button"
          className={cn(
            'property-group__link-button',
            linked && 'property-group__link-button--linked'
          )}
          onClick={() => onLinkToggle?.(!linked)}
          aria-label={linked ? 'Unlink values' : 'Link values'}
        >
          🔗
        </button>
      )}
      <div className="property-group__input-pair-input">
        {secondInput}
      </div>
    </div>
  </PropertyGroup>
);

// Toggle List Group (for multiple checkboxes/switches)
export interface ToggleListGroupProps extends Omit<PropertyGroupProps, 'layout'> {
  /** Toggle options */
  options: Array<{
    id: string;
    label: string;
    checked: boolean;
    disabled?: boolean;
  }>;
  /** Toggle change handler */
  onToggleChange?: (id: string, checked: boolean) => void;
}

export const ToggleListGroup: React.FC<ToggleListGroupProps> = ({
  options,
  onToggleChange,
  ...props
}) => (
  <PropertyGroup layout="vertical" spacing="sm" {...props}>
    {options.map((option) => (
      <label
        key={option.id}
        className={cn(
          'property-group__toggle-item',
          option.disabled && 'property-group__toggle-item--disabled'
        )}
      >
        <input
          type="checkbox"
          checked={option.checked}
          disabled={option.disabled}
          onChange={(e) => onToggleChange?.(option.id, e.target.checked)}
          className="property-group__toggle-input"
        />
        <Typography variant="body-sm" color={option.disabled ? 'disabled' : 'primary'}>
          {option.label}
        </Typography>
      </label>
    ))}
  </PropertyGroup>
);