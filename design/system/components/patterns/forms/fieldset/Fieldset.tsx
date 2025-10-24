// ===============================================
// src/design-system/components/patterns/forms/Fieldset.tsx
// FIELDSET COMPONENT - Accessible grouping with legend, errors, and helper text
// Uses VStack and Typography for layout and text styling
// ===============================================

import React, { forwardRef, ReactNode } from 'react';
import { VStack } from '../../../layout';
import { Typography } from '../../../primitives';
import { cn } from '../../../../lib/utils';

export interface FieldsetProps {
  legend?: ReactNode;
  children: ReactNode;
  error?: string | null;
  helper?: string | null;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(({
  legend,
  children,
  error,
  helper,
  disabled = false,
  className,
  variant = 'default',
  size = 'md',
  ...props
}, ref) => {
  const rootClass = cn(
    'fieldset-root',
    `fieldset-variant-${variant}`,
    `fieldset-size-${size}`,
    disabled && 'fieldset-disabled',
    className
  );

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
        {children}
      </VStack>

      {helper && !error && (
        <Typography variant="body-sm" color="secondary" className="fieldset-helper">
          {helper}
        </Typography>
      )}

      {error && (
        <Typography variant="body-sm" color="error" className="fieldset-error" role="alert" aria-live="polite">
          {error}
        </Typography>
      )}
    </fieldset>
  );
});

Fieldset.displayName = 'Fieldset';
