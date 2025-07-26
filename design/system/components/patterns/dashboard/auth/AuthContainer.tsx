// ===============================================
// src/design-system/components/patterns/auth/AuthContainer.tsx
// AUTH CONTAINER - Just layout, NO card styling
// ===============================================

import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../../lib/utils';
import { Typography } from '../../../../components/primitives/Typography';

// ===== TYPE DEFINITIONS =====
export interface AuthContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Main content */
  children: ReactNode;
  /** Container title */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Logo or icon */
  logo?: ReactNode;
  /** Maximum width variant */
  maxWidth?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

// ===== MAIN COMPONENT =====
export const AuthContainer = forwardRef<HTMLDivElement, AuthContainerProps>(({
  children,
  title,
  subtitle,
  logo,
  maxWidth = 'sm',
  className,
  ...props
}, ref) => {
  const containerClasses = cn(
    'auth-container-layout',
    `auth-container-${maxWidth}`,
    className
  );

  return (
    <div ref={ref} className={containerClasses} {...props}>
      {/* Logo Section */}
      {logo && (
        <div className="auth-container-logo">
          {logo}
        </div>
      )}

      {/* Header Section */}
      {(title || subtitle) && (
        <div className="auth-container-header">
          {title && (
            <Typography 
              variant="display-md" 
              color="heading"  // Uses --text-heading-color from your typography system
              weight="extrabold"
              className="auth-container-title"
              as="h1"
              style={{ 
                marginBottom: '0.75rem',
                textAlign: 'center' 
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography 
              variant="body-lg" 
              color="body"  // Uses --text-body-color from your typography system
              className="auth-container-subtitle"
              style={{ 
                margin: 0,
                textAlign: 'center' 
              }}
            >
              {subtitle}
            </Typography>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="auth-container-content">
        {children}
      </div>
    </div>
  );
});

AuthContainer.displayName = 'AuthContainer';