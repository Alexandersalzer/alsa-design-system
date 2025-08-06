// ===============================================
// src/design-system/components/primitives/Card/Card.tsx
// UPDATED WITH RADIUS SIZE VARIANTS
// ===============================================

import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';  // ✅ NEW: Radius size variant
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', radius = 'md', children, ...props }, ref) => {
    const cardClasses = cn(
      'card',
      // Variant classes
      variant === 'elevated' && 'card--elevated',
      variant === 'outlined' && 'card--outlined',
      // Padding classes
      padding === 'sm' && 'card--padding-sm',
      padding === 'lg' && 'card--padding-lg',
      // ✅ NEW: Radius classes
      radius === 'sm' && 'card--radius-sm',
      radius === 'lg' && 'card--radius-lg',
      className
    );

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components remain the same
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('card-header', className)} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('card-content', className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('card-footer', className)} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

/* ===== USAGE EXAMPLES =====

// ✅ Default card (medium radius - 12px)
<Card>
  <CardContent>Default card with medium radius</CardContent>
</Card>

// ✅ Small radius card (8px)
<Card radius="sm">
  <CardContent>Subtle rounding</CardContent>
</Card>

// ✅ Large radius card (16px)
<Card radius="lg">
  <CardContent>More rounded</CardContent>
</Card>

// ✅ Combining variants
<Card variant="elevated" padding="lg" radius="lg">
  <CardHeader>Large Elevated Card</CardHeader>
  <CardContent>
    This card has large padding, elevated shadow, and large radius.
    Any buttons or inputs inside will automatically get smaller radius
    for perfect Apple-style concentricity.
  </CardContent>
</Card>

*/