// ===============================================
// src/design-system/components/patterns/forms/Fieldset.tsx
// FIELDSET COMPONENT - Accessible grouping with legend, errors, and helper text
// Updated to work with dynamic pattern rendering system + design system components
// ===============================================

import React, { forwardRef, ReactNode } from 'react';
import { VStack } from '../../../components/layout';
import { Typography } from '../../../components';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components';
import { Input } from '../../../components';
import { Icon, IconColor } from '../../../components';
import { 
  EnvelopeIcon, 
  ArrowRightIcon,
  UserIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';

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

// Icon mapping for inputs
const iconMap: Record<string, any> = {
  email: EnvelopeIcon,
  user: UserIcon,
  building: BuildingOfficeIcon,
  rightArrow: ArrowRightIcon,
};

// Button variant to icon color mapping
const buttonVariantToIconColor: Record<string, IconColor> = {
  primary: 'button-primary',
  secondary: 'button-secondary',
  accent: 'button-accent',
  ghost: 'button-ghost',
  destructive: 'button-destructive',
};

// Component registry for fieldset children
const fieldsetComponentRegistry: Record<string, React.ComponentType<any>> = {
  name: (props: any) => {
    const { label, placeholder, leftIcon, ...rest } = props;
    
    const leftIconComponent = leftIcon && iconMap[leftIcon] ? (
      <Icon size="sm" color="secondary">
        {React.createElement(iconMap[leftIcon])}
      </Icon>
    ) : undefined;

    return (
      <Input
        type="text"
        name="name"
        label={label}
        placeholder={placeholder}
        leftIcon={leftIconComponent}
        fullWidth
        size="md"
        radius="md"
        {...rest}
      />
    );
  },
  
  businessName: (props: any) => {
    const { label, placeholder, leftIcon, ...rest } = props;
    
    const leftIconComponent = leftIcon && iconMap[leftIcon] ? (
      <Icon size="sm" color="secondary">
        {React.createElement(iconMap[leftIcon])}
      </Icon>
    ) : undefined;

    return (
      <Input
        type="text"
        name="businessName"
        label={label}
        placeholder={placeholder}
        leftIcon={leftIconComponent}
        fullWidth
        size="md"
        radius="md"
        {...rest}
      />
    );
  },
  
  email: (props: any) => {
    const { label, placeholder, leftIcon, ...rest } = props;
    
    const leftIconComponent = leftIcon && iconMap[leftIcon] ? (
      <Icon size="sm" color="secondary">
        {React.createElement(iconMap[leftIcon])}
      </Icon>
    ) : undefined;

    return (
      <Input
        type="email"
        name="email"
        label={label}
        placeholder={placeholder}
        leftIcon={leftIconComponent}
        fullWidth
        size="md"
        radius="md"
        {...rest}
      />
    );
  },
  
  message: (props: any) => {
    const { label, placeholder, ...rest } = props;
    
    return (
      <div className="input-group input-group--full-width">
        {label && (
          <label className="input-label">
            {label}
          </label>
        )}
        <textarea
          name="message"
          placeholder={placeholder}
          className="input input--md input--full-width"
          rows={4}
          style={{
            minHeight: '120px',
            resize: 'vertical',
          }}
          {...rest}
        />
      </div>
    );
  },
  
  button: (props: any) => {
    const { content, ...rest } = props;
    
    // Extract button properties from content object
    const buttonType = content?.type || 'primary';
    const buttonText = content?.content || 'Submit';
    const rightIconName = content?.rightIcon;
    
    // Get the proper icon color based on button variant
    const iconColor = buttonVariantToIconColor[buttonType] || 'button-primary';
    
    const rightIconComponent = rightIconName && iconMap[rightIconName] ? (
      <Icon size="sm" color={iconColor}>
        {React.createElement(iconMap[rightIconName])}
      </Icon>
    ) : undefined;

    return (
      <Button
        type="submit"
        variant={buttonType as 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive'}
        size="lg"
        radius="md"
        rightIcon={rightIconComponent}
        {...rest}
      >
        {buttonText}
      </Button>
    );
  },
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