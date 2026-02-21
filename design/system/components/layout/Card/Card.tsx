// ===============================================
// src/design-system/components/primitives/Card/Card.tsx
// ENHANCED WITH INTERACTIVE STATES AND HOVER EFFECTS
// ===============================================

'use client';

import React, { forwardRef, ReactNode, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'raised' | 'elevated' | 'outlined' | 'solid' | 'ghost' | 'bordered' | 'accent-subtle' | 'accent-muted';
  padding?: 'none'| 'xs' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
  // ✅ NEW: Width constraint options
  width?: 'auto' | 'constrained' | 'compact' | 'spacious';
  // ✅ NEW: Height options
  height?: 'auto' | 'full';
  // ✅ Interactive properties
  interactive?: boolean;
  disabled?: boolean;
  selected?: boolean;
  // ✅ Click handler for interactive cards
  onCardClick?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md', 
    radius = 'md',
    width = 'auto', // Default: no width constraints
    height = 'auto', // Default: no height constraints
    interactive = false,
    disabled = false,
    selected = false,
    onCardClick,
    children,
    onClick,
    onMouseDown: onMouseDownProp,
    onMouseUp: onMouseUpProp,
    onMouseLeave: onMouseLeaveProp,
    ...props
  }, ref) => {
    const [isPressing, setIsPressing] = useState(false);

    // Determine if card should be clickable
    const isClickable = interactive && (onCardClick || onClick) && !disabled;

    const cardClasses = cn(
      'card',
      // Variant classes
      variant === 'raised' && 'card--raised',
      variant === 'elevated' && 'card--elevated',
      variant === 'outlined' && 'card--outlined',
      variant === 'solid' && 'card--solid',
      variant === 'ghost' && 'card--ghost',
      variant === 'bordered' && 'card--bordered',
      variant === 'accent-subtle' && 'card--accent-subtle',
      variant === 'accent-muted' && 'card--accent-muted',

      // Padding classes
      padding === 'none' && 'card--padding-none',
      padding === 'xs' && 'card--padding-xs',
      padding === 'sm' && 'card--padding-sm',
      padding === 'lg' && 'card--padding-lg',

      // Radius classes
      radius === 'sm' && 'card--radius-sm',
      radius === 'lg' && 'card--radius-lg',

      // Width constraint classes
      width === 'constrained' && 'card--constrained',
      width === 'compact' && 'card--compact',
      width === 'spacious' && 'card--spacious',

      // Height classes
      height === 'full' && 'card--height-full',

      // Interactive state classes
      interactive && 'card--interactive',
      isClickable && 'card--clickable',
      disabled && 'card--disabled',
      selected && 'card--selected',
      isPressing && 'card--pressing',

      className
    );

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isClickable) return;

      setIsPressing(true);

      // Fire the action immediately on mousedown (same as ListboxItem)
      if (onCardClick) {
        onCardClick();
      } else if (onClick) {
        onClick(event);
      }

      // Keep pressing visual for 150ms after action
      setTimeout(() => setIsPressing(false), 150);
      onMouseDownProp?.(event);
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
      setIsPressing(false);
      onMouseUpProp?.(event);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
      setIsPressing(false);
      onMouseLeaveProp?.(event);
    };

    return (
      <div
        ref={ref}
        className={cardClasses}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-disabled={disabled}
        onKeyDown={isClickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (onCardClick) {
              onCardClick();
            } else if (onClick) {
              onClick(e as any);
            }
          }
        } : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ✅ Interactive Card wrapper for easier usage
export interface InteractiveCardProps extends Omit<CardProps, 'interactive'> {
  onCardClick: () => void;
}

export const InteractiveCard = forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ onCardClick, ...props }, ref) => (
    <Card 
      ref={ref} 
      interactive={true} 
      onCardClick={onCardClick}
      {...props} 
    />
  )
);

InteractiveCard.displayName = 'InteractiveCard';

// Card sub-components remain the same
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** För bild/topp – ingen border/padding, innehåll kant-i-kant */
  variant?: 'default' | 'media';
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant = 'default', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'card-header',
        variant === 'media' && 'card-header--media',
        className
      )}
      {...props}
    >
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
  /** Footer bakgrund – styrs via tokens */
  variant?: 'default' | 'subtle' | 'muted';
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, variant = 'default', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'card-footer',
        variant !== 'default' && `card-footer--${variant}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

/* ===== USAGE EXAMPLES =====

// ✅ Default card (no interaction, no width constraints - fills parent)
<Card>
  <CardContent>Flexible card</CardContent>
</Card>

// ✅ Constrained standalone card (fixed width like before)
<Card width="constrained">
  <CardContent>Fixed width card (18-24rem)</CardContent>
</Card>

// ✅ Interactive card in a grid (no width constraints)
<Grid>
  <Card interactive onCardClick={() => console.log('clicked')}>
    <CardContent>Grid card</CardContent>
  </Card>
</Grid>

// ✅ Dashboard cards with fixed width
<Card width="constrained" variant="outlined">
  <CardContent>Dashboard stat card</CardContent>
</Card>

// ✅ Interactive card wrapper (cleaner syntax)
<InteractiveCard onCardClick={() => navigate('/details')}>
  <CardContent>Navigate to details</CardContent>
</InteractiveCard>

// ✅ Selected interactive card
<Card 
  interactive 
  selected={isSelected} 
  onCardClick={() => setSelected(!isSelected)}
>
  <CardContent>Selectable card</CardContent>
</Card>

// ✅ Disabled interactive card
<Card 
  interactive 
  disabled={true} 
  onCardClick={() => console.log('won\'t fire')}
>
  <CardContent>Disabled card</CardContent>
</Card>

*/