// ===============================================
// src/design-system/components/patterns/forms/Fieldset.tsx
// FIELDSET COMPONENT - Accessible grouping with legend, errors, and helper text
// Updated to work with dynamic pattern rendering system
// ===============================================
import React, { forwardRef, ReactNode } from 'react';
import { VStack } from '../../../components/layout';
import { Typography } from '../../../components';
import { cn } from '../../../lib/utils';

export interface FieldsetProps {
  legend?: ReactNode;
  children?: ReactNode;
  error?: string | null;
  helper?: string | null;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  // Props from dynamic pattern system
  components?: Record<string, any>;
  settings?: Record<string, any>;
}

// Component registry for fieldset children
const fieldsetComponentRegistry: Record<string, React.ComponentType<any>> = {
  name: (props: any) => (
    <input 
      type="text" 
      name="name"
      placeholder={props.placeholder}
      aria-label={props.label}
      className="fieldset-input"
      {...props}
    />
  ),
  businessName: (props: any) => (
    <input 
      type="text" 
      name="businessName"
      placeholder={props.placeholder}
      aria-label={props.label}
      className="fieldset-input"
      {...props}
    />
  ),
  email: (props: any) => (
    <input 
      type="email" 
      name="email"
      placeholder={props.placeholder}
      aria-label={props.label}
      className="fieldset-input"
      {...props}
    />
  ),
  message: (props: any) => (
    <textarea 
      name="message"
      placeholder={props.placeholder}
      aria-label={props.label}
      className="fieldset-textarea"
      rows={4}
      {...props}
    />
  ),
  button: (props: any) => (
    <button 
      type="submit"
      className="fieldset-button"
      {...props}
    >
      {props.content?.content || 'Submit'}
    </button>
  ),
};

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(({
  legend,
  children,
  error,
  helper,
  disabled = false,
  className,
  variant = 'default',
  size = 'md',
  components,
  settings,
  ...props
}, ref) => {
  const rootClass = cn(
    'fieldset-root',
    `fieldset-variant-${variant}`,
    `fieldset-size-${size}`,
    disabled && 'fieldset-disabled',
    className
  );

  // Render dynamic components from JSON if provided
  const renderDynamicComponents = () => {
    if (!components) return null;

    return Object.entries(components).map(([key, componentData]) => {
      const ComponentType = fieldsetComponentRegistry[componentData.type];
      
      if (!ComponentType) {
        console.warn(`Unknown fieldset component type: ${componentData.type}`);
        return null;
      }

      return (
        <div key={key} className="fieldset-field">
          {componentData.label && (
            <Typography 
              as="label" 
              variant="body-sm" 
              weight="medium"
              className="fieldset-label"
            >
              {componentData.label}
            </Typography>
          )}
          <ComponentType {...componentData} />
        </div>
      );
    });
  };

  return (
    <fieldset
      ref={ref}
      disabled={disabled}
      aria-invalid={!!error}
      className={rootClass}
      {...props}
    >
      {legend && (
        <Typography
          as="legend"
          weight="medium"
          className="fieldset-legend"
          color="label"
        >
          {legend}
        </Typography>
      )}
      
      <VStack spacing={size === 'sm' ? 'sm' : (size === 'lg' ? 'lg' : 'md')} align="stretch">
        {/* Render dynamic components if provided, otherwise use children */}
        {components ? renderDynamicComponents() : children}
      </VStack>

      {helper && !error && (
        <Typography variant="body-sm" color="secondary" className="fieldset-helper">
          {helper}
        </Typography>
      )}

      {error && (
        <Typography 
          variant="body-sm" 
          color="error" 
          className="fieldset-error" 
          role="alert" 
          aria-live="polite"
        >
          {error}
        </Typography>
      )}
    </fieldset>
  );
});

Fieldset.displayName = 'Fieldset';