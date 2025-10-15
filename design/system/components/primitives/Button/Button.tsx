// ===============================================
// design/system/components/primitives/Button/Button.tsx
// ENHANCED - Now with radius prop support!
// ===============================================

import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { Label, TypographyColor, TypographyWeight } from '../Typography';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  radius = 'md',
  children,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  // 🎯 ENHANCED: Map button variant + state to typography properties
  const getTypographyProps = (
    variant: string, 
    size: string, 
    isDisabled: boolean
  ): { size: 'sm' | 'md' | 'lg'; weight: TypographyWeight; color: TypographyColor } => {
    
    // Size mapping
    const sizeMap = {
      sm: 'sm' as const,
      md: 'md' as const, 
      lg: 'lg' as const,
      xl: 'lg' as const, // xl uses lg typography
    };

    // Weight mapping
    const weightMap = {
      sm: 'semibold' as const,
      md: 'bold' as const,
      lg: 'bold' as const,
      xl: 'bold' as const,
    };

    // 🎯 KEY: Color mapping based on variant and state
    const getColor = (): TypographyColor => {
      if (isDisabled) {
        return 'button-disabled'; // Uses --text-button-primary-disabled
      }

      switch (variant) {
        case 'primary':
          return 'button-primary';    // Uses --text-button-primary (white)
        case 'secondary':
          return 'button-secondary';  // Uses --text-button-secondary (black)
        case 'accent':
          return 'button-accent';     // Uses --text-button-accent (white)
        case 'ghost':
          return 'secondary';         // Uses --text-secondary (gray) for ghost buttons
        case 'destructive':
          return 'button-destructive';             // Uses --error-500 for destructive buttons
        default:
          return 'button-primary';
      }
    };

    return {
      size: sizeMap[size as keyof typeof sizeMap] || sizeMap.md,
      weight: weightMap[size as keyof typeof weightMap] || weightMap.md,
      color: getColor()
    };
  };

  const typographyProps = getTypographyProps(variant, size, isDisabled);


  // Build button classes (NO typography classes - handled by Label component)
  const buttonClasses = cn(
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    `btn-radius-${radius}`,
    className
  );

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Left Icon */}
      {!loading && leftIcon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      {/* 🎯 ENHANCED: Button text with correct colors for each variant! */}
      <Label
        size={typographyProps.size}
        weight={typographyProps.weight}
        color={typographyProps.color}  // ← This is the magic!
        as="span"
        className="btn-text"
      >
        {children}
      </Label>

      {/* Right Icon */}
      {!loading && rightIcon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

// ===============================================
// USAGE EXAMPLES WITH CORRECT COLORS
// ===============================================

/*

// ✅ PRIMARY BUTTON
<Button variant="primary">Save</Button>
// Typography color: 'button-primary' → --text-button-primary → white text

// ✅ SECONDARY BUTTON  
<Button variant="secondary">Cancel</Button>
// Typography color: 'button-secondary' → --text-button-secondary → black text

// ✅ ACCENT BUTTON
<Button variant="accent">Subscribe</Button>
// Typography color: 'button-accent' → --text-button-accent → white text

// ✅ GHOST BUTTON
<Button variant="ghost">Learn More</Button>
// Typography color: 'secondary' → --text-secondary → gray text

// ✅ destructive BUTTON
<Button variant="destructive">Delete</Button>
// Typography color: 'error' → --error-500 → red text

// ✅ DISABLED BUTTON (any variant)
<Button variant="primary" disabled>Disabled</Button>
// Typography color: 'button-disabled' → --text-button-primary-disabled → gray text

// ✅ LOADING BUTTON (any variant)
<Button variant="primary" loading>Saving...</Button>
// Typography color: 'button-disabled' → --text-button-primary-disabled → gray text

*/