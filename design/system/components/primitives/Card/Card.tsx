// ===============================================
// src/design-system/components/primitives/Card/Card.tsx
// UPDATED WITH RADIUS SIZE VARIANTS + SOLID VARIANT
// ===============================================
import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'solid'; // ✅ ADDED: solid variant
  padding?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', radius = 'md', children, ...props }, ref) => {
    const cardClasses = cn(
      'card',
      // Variant classes
      variant === 'elevated' && 'card--elevated',
      variant === 'outlined' && 'card--outlined',
      variant === 'solid' && 'card--solid', // ✅ NEW: Solid variant class
      // Padding classes
      padding === 'sm' && 'card--padding-sm',
      padding === 'lg' && 'card--padding-lg',
      // Radius classes
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
// ✅ Default card (white background)
<Card>
  <CardContent>Default card</CardContent>
</Card>

// ✅ Elevated card (shadow)
<Card variant="elevated">
  <CardContent>Card with shadow</CardContent>
</Card>

// ✅ Outlined card (border)
<Card variant="outlined">
  <CardContent>Card with border</CardContent>
</Card>

// ✅ NEW: Solid card (colored background)
<Card variant="solid">
  <CardContent>Card with solid background color</CardContent>
</Card>
*/