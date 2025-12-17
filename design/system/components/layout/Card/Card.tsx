// ===============================================
// src/design-system/components/primitives/Card/Card.tsx
// ENHANCED WITH INTERACTIVE STATES AND HOVER EFFECTS
// ===============================================

import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'solid';
  padding?: 'none'| 'xs' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
  // ✅ NEW: Width constraint options
  width?: 'auto' | 'constrained' | 'compact' | 'spacious';
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
    interactive = false,
    disabled = false,
    selected = false,
    onCardClick,
    children, 
    onClick,
    ...props 
  }, ref) => {
    
    // Determine if card should be clickable
    const isClickable = interactive && (onCardClick || onClick) && !disabled;
    
    const cardClasses = cn(
      'card',
      // Variant classes
      variant === 'elevated' && 'card--elevated',
      variant === 'outlined' && 'card--outlined',
      variant === 'solid' && 'card--solid',
      
      // Padding classes
      padding === 'none' && 'card--padding-none',
      padding === 'xs' && 'card--padding-xs',
      padding === 'sm' && 'card--padding-sm',
      padding === 'lg' && 'card--padding-lg',
      
      // Radius classes
      radius === 'sm' && 'card--radius-sm',
      radius === 'lg' && 'card--radius-lg',
      
      // ✅ NEW: Width constraint classes
      width === 'constrained' && 'card--constrained',
      width === 'compact' && 'card--compact',
      width === 'spacious' && 'card--spacious',
      
      // Interactive state classes
      interactive && 'card--interactive',
      isClickable && 'card--clickable',
      disabled && 'card--disabled',
      selected && 'card--selected',
      
      className
    );

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      
      // Call onCardClick if provided, otherwise fall back to onClick
      if (onCardClick) {
        onCardClick();
      } else if (onClick) {
        onClick(event);
      }
    };

    return (
      <div 
        ref={ref} 
        className={cardClasses} 
        onClick={isClickable ? handleClick : onClick}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-disabled={disabled}
        onKeyDown={isClickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as any);
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