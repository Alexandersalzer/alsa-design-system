// ===============================================
// src/design-system/components/patterns/auth/AuthCard.tsx
// AUTH CARD PATTERN - Specialized card for auth flows
// ===============================================

import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../../lib/utils';
import { Card, CardContent } from '../../../../components/primitives/Card';
import { Typography } from '../../../../components/primitives/Typography';

// ===== TYPE DEFINITIONS =====
export interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Main content of the auth card */
  children: ReactNode;
  /** Card title (e.g., "Sign In", "Create Account") */
  title?: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Logo or icon to display at the top */
  logo?: ReactNode;
  /** Maximum width variant */
  maxWidth?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

// ===== MAIN COMPONENT =====
export const AuthCard = forwardRef<HTMLDivElement, AuthCardProps>(({
  children,
  title,
  subtitle,
  logo,
  maxWidth = 'sm',
  className,
  ...props
}, ref) => {
  const authCardClasses = cn(
    'auth-card',
    `auth-card-${maxWidth}`,
    className
  );

  return (
    <div ref={ref} className={authCardClasses} {...props}>
      <Card className="auth-card-inner">
        <CardContent className="auth-card-content">
          {/* Logo Section */}
          {logo && (
            <div className="auth-card-logo">
              {logo}
            </div>
          )}

          {/* Header Section */}
          {(title || subtitle) && (
            <div className="auth-card-header">
              {title && (
                <Typography 
                  variant="h3" 
                  color="heading"
                  className="auth-card-title"
                  as="h1"
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography 
                  variant="body-md" 
                  color="secondary"
                  className="auth-card-subtitle"
                >
                  {subtitle}
                </Typography>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="auth-card-body">
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

AuthCard.displayName = 'AuthCard';

// ===== SUB-COMPONENTS FOR FLEXIBLE LAYOUTS =====

export interface AuthCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const AuthCardHeader = forwardRef<HTMLDivElement, AuthCardHeaderProps>(({
  children,
  className,
  ...props
}, ref) => (
  <div ref={ref} className={cn('auth-card-header', className)} {...props}>
    {children}
  </div>
));

AuthCardHeader.displayName = 'AuthCardHeader';

export interface AuthCardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const AuthCardBody = forwardRef<HTMLDivElement, AuthCardBodyProps>(({
  children,
  className,
  ...props
}, ref) => (
  <div ref={ref} className={cn('auth-card-body', className)} {...props}>
    {children}
  </div>
));

AuthCardBody.displayName = 'AuthCardBody';

export interface AuthCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const AuthCardFooter = forwardRef<HTMLDivElement, AuthCardFooterProps>(({
  children,
  className,
  ...props
}, ref) => (
  <div ref={ref} className={cn('auth-card-footer', className)} {...props}>
    {children}
  </div>
));

AuthCardFooter.displayName = 'AuthCardFooter';