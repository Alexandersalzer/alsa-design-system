// ===============================================
// src/design-system/components/primitives/Typography/Typography.tsx
// COMPLETE TYPOGRAPHY SYSTEM WITH SIMPLE H1-H6 COMPONENTS
// ===============================================

import React, { ReactNode, ElementType, forwardRef } from 'react';
import { cn } from '../../../lib/utils';

// ===== TYPE DEFINITIONS =====
export type TypographyVariant =
  | 'display-xl' | 'display-lg' | 'display-md' | 'display-sm'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs'
  | 'label-lg' | 'label-md' | 'label-sm' | 'label-xs'
  | 'code-lg' | 'code-md' | 'code-sm';

export type TypographyWeight =
  | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

// 🎯 ENHANCED: Complete color system integration
export type TypographyColor =
  // === GLOBAL/LAYOUT COLORS ===
  | 'primary'           // --text-primary (black, main text)
  | 'secondary'         // --text-secondary (gray-600, secondary text)
  | 'tertiary'          // --text-tertiary (gray-500, subtle text)
  | 'disabled'          // --text-disabled (gray-300, disabled state)
  | 'placeholder'       // --text-placeholder (gray-400, placeholder text)
  | 'inverse'           // --text-inverse (white, on dark backgrounds)
  
  // === SEMANTIC TYPE COLORS ===
  | 'heading'           // --text-heading-color (black, headings)
  | 'body'              // --text-body-color (gray-700, body text)
  | 'label'             // --text-label-color (black, labels)
  | 'code'              // --text-code-color (gray-800, code text)
  
  // === NAVIGATION COLORS ===
  | 'nav-default'       // --text-nav-item (gray-600, default nav)
  | 'nav-selected'      // --text-nav-item-selected (accent-500, selected nav)
  | 'nav-disabled'      // --text-nav-item-disabled (gray-300, disabled nav)
  | 'nav-hover'         // --text-nav-item-hover (gray-900, hover nav)
  
  // === BUTTON COLORS ===
  | 'button-primary'    // --text-button-primary (white, primary button)
  | 'button-secondary'  // --text-button-secondary (black, secondary button)
  | 'button-accent'     // --text-button-accent (white, accent button)
  | 'button-destructive'
  | 'button-disabled'   // --text-button-primary-disabled (gray-400, disabled button)
  
  // === COMPONENT-SPECIFIC COLORS ===
  | 'card-primary'      // --text-card-primary (black, card primary text)
  | 'card-secondary'    // --text-card-secondary (gray-600, card secondary text)
  | 'card-tertiary'     // --text-card-tertiary (gray-500, card subtle text)
  | 'input'             // --text-input (black, input text)
  | 'input-placeholder' // --text-input-placeholder (gray-400, input placeholder)
  | 'input-disabled'    // --text-input-disabled (gray-400, disabled input)
  | 'table-header'      // --text-table-header (black, table headers)
  | 'table-cell'        // --text-table-cell (gray-700, table cells)
  | 'table-cell-secondary' // --text-table-cell-secondary (gray-500, table secondary)
  
  // === STATE COLORS ===
  | 'accent'            // --accent-500 (brand accent)
  | 'success'           // --success-500 (success green)
  | 'warning'           // --warning-500 (warning yellow)
  | 'error'             // --error-500 (error red)
  | 'info'              // --info-500 (info blue)
  
  // === TAG/BADGE COLORS ===
  | 'tag-default'       // --text-tag-default (gray-700)
  | 'tag-accent'        // --text-tag-accent (accent-700)
  | 'tag-success'       // --text-tag-success (success-700)
  | 'tag-warning'       // --text-tag-warning (warning-700)
  | 'tag-error';        // --text-tag-error (error-700)

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

// ===== POLYMORPHIC TYPES =====
export interface TypographyOwnProps {
  children: ReactNode;
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  color?: TypographyColor;
  align?: TypographyAlign;
  className?: string;
  truncate?: boolean;
  noWrap?: boolean;
  uppercase?: boolean;
  italic?: boolean;
  as?: ElementType;
}

export type TypographyProps = TypographyOwnProps & 
  Omit<React.HTMLAttributes<HTMLElement>, keyof TypographyOwnProps>;

// ===== COLOR MAPPING FUNCTION =====
const getColorValue = (color: TypographyColor): string => {
  const colorMap: Record<TypographyColor, string> = {
    // Global/Layout colors
    'primary': 'var(--text-primary)',
    'secondary': 'var(--text-secondary)',
    'tertiary': 'var(--text-tertiary)',
    'disabled': 'var(--text-disabled)',
    'placeholder': 'var(--text-placeholder)',
    'inverse': 'var(--text-inverse)',
    
    // Semantic type colors
    'heading': 'var(--text-heading-color)',
    'body': 'var(--text-body-color)',
    'label': 'var(--text-label-color)',
    'code': 'var(--text-code-color)',
    
    // Navigation colors
    'nav-default': 'var(--text-nav-item)',
    'nav-selected': 'var(--text-nav-item-selected)',
    'nav-disabled': 'var(--text-nav-item-disabled)',
    'nav-hover': 'var(--text-nav-item-hover)',
    
    // Button colors
    'button-primary': 'var(--text-button-primary)',
    'button-secondary': 'var(--text-button-secondary)',
    'button-accent': 'var(--text-button-accent)',
    'button-destructive': 'var(--text-button-destructive)',
    'button-disabled': 'var(--text-button-primary-disabled)',

    
    // Component-specific colors
    'card-primary': 'var(--text-card-primary)',
    'card-secondary': 'var(--text-card-secondary)',
    'card-tertiary': 'var(--text-card-tertiary)',
    'input': 'var(--text-input)',
    'input-placeholder': 'var(--text-input-placeholder)',
    'input-disabled': 'var(--text-input-disabled)',
    'table-header': 'var(--text-table-header)',
    'table-cell': 'var(--text-table-cell)',
    'table-cell-secondary': 'var(--text-table-cell-secondary)',
    
    // State colors
    'accent': 'var(--accent-color)',
    'success': 'var(--success-500)',
    'warning': 'var(--warning-500)',
    'error': 'var(--error-500)',
    'info': 'var(--info-500)',
    
    // Tag/Badge colors
    'tag-default': 'var(--text-tag-default)',
    'tag-accent': 'var(--text-tag-accent)',
    'tag-success': 'var(--text-tag-success)',
    'tag-warning': 'var(--text-tag-warning)',
    'tag-error': 'var(--text-tag-error)',
  };
  
  return colorMap[color] || colorMap.primary;
};

// ===== UTILITY FUNCTIONS =====
const getDefaultElement = (variant: TypographyVariant): ElementType => {
  const variantElementMap: Record<TypographyVariant, ElementType> = {
    'display-xl': 'h1', 'display-lg': 'h1', 'display-md': 'h2', 'display-sm': 'h3',
    'h1': 'h1', 'h2': 'h2', 'h3': 'h3', 'h4': 'h4', 'h5': 'h5', 'h6': 'h6',
    'body-xl': 'p', 'body-lg': 'p', 'body-md': 'p', 'body-sm': 'p', 'body-xs': 'p',
    'label-lg': 'span', 'label-md': 'span', 'label-sm': 'span', 'label-xs': 'span',
    'code-lg': 'code', 'code-md': 'code', 'code-sm': 'code',
  };
  return variantElementMap[variant] || 'p';
};

export const buildTypographyClasses = ({
  variant = 'body-md',
  weight,
  color,
  align,
  truncate,
  noWrap,
  uppercase,
  italic,
  className
}: TypographyOwnProps) => {
  return cn(
    // Base variant class
    `text-${variant}`,
    
    // Weight override
    weight && `font-weight-${weight}`,
    
    // Alignment
    align && `text-${align}`,
    
    // Text utilities
    truncate && 'truncate',
    noWrap && 'whitespace-nowrap',
    uppercase && 'uppercase',
    italic && 'italic',
    
    // Custom className
    className
  );
};

// ===== MAIN TYPOGRAPHY COMPONENT =====
export const Typography = forwardRef<HTMLElement, TypographyProps>(({
  as,
  variant = 'body-md',
  weight,
  color,
  align,
  truncate,
  noWrap,
  uppercase,
  italic,
  className,
  children,
  style = {},
  ...rest
}, ref) => {
  const Component = as || getDefaultElement(variant);
  
  const classes = buildTypographyClasses({
    variant,
    weight,
    color,
    align,
    truncate,
    noWrap,
    uppercase,
    italic,
    className,
    children
  });

  // 🎯 ENHANCED: Apply color through inline style for maximum compatibility
  const combinedStyle = {
    ...(color && { color: getColorValue(color) }),
    ...style
  };

  return (
    <Component
      ref={ref}
      className={classes}
      style={combinedStyle}
      {...rest}
    >
      {children}
    </Component>
  );
});

Typography.displayName = 'Typography';

// ===== CONVENIENCE COMPONENTS =====

export interface DisplayProps extends Omit<TypographyOwnProps, 'variant'> {
  size?: 'xl' | 'lg' | 'md' | 'sm';
}

export const Display = forwardRef<HTMLHeadingElement, DisplayProps>(
  ({ size = 'lg', color = 'heading', ...props }, ref) => (
    <Typography
      ref={ref}
      variant={`display-${size}` as TypographyVariant}
      color={color}
      {...props}
    />
  )
);

Display.displayName = 'Display';

export interface BodyProps extends Omit<TypographyProps, 'variant'> {
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
}

export const Body = forwardRef<HTMLParagraphElement, BodyProps>(
  ({ size = 'md', color = 'body', ...props }, ref) => (
    <Typography
      ref={ref}
      variant={`body-${size}` as TypographyVariant}
      color={color}
      {...props}
    />
  )
);

Body.displayName = 'Body';

export interface LabelProps extends Omit<TypographyProps, 'variant'> {
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

export const Label = forwardRef<HTMLSpanElement, LabelProps>(
  ({ size = 'md', color = 'label', ...props }, ref) => (
    <Typography
      ref={ref}
      variant={`label-${size}` as TypographyVariant}
      color={color}
      {...props}
    />
  )
);

Label.displayName = 'Label';

export interface CodeProps extends Omit<TypographyOwnProps, 'variant'> {
  size?: 'lg' | 'md' | 'sm';
}

export const Code = forwardRef<HTMLElement, CodeProps>(
  ({ size = 'md', color = 'code', ...props }, ref) => (
    <Typography
      ref={ref}
      variant={`code-${size}` as TypographyVariant}
      color={color}
      {...props}
    />
  )
);

Code.displayName = 'Code';

// ===== SIMPLE H1-H6 HEADING COMPONENTS =====

interface BaseHeadingProps extends Omit<TypographyProps, 'variant' | 'as'> {
  color?: TypographyColor;
  weight?: TypographyWeight;
}

// ===== H1 COMPONENT =====
export const H1 = forwardRef<HTMLHeadingElement, BaseHeadingProps>(({
  color = 'heading',
  weight = 'bold',
  ...props
}, ref) => (
  <Typography
    ref={ref}
    as="h1"
    variant="h1"
    color={color}
    weight={weight}
    {...props}
  />
));

H1.displayName = 'H1';

// ===== H2 COMPONENT =====
export const H2 = forwardRef<HTMLHeadingElement, BaseHeadingProps>(({
  color = 'heading',
  weight = 'semibold',
  ...props
}, ref) => (
  <Typography
    ref={ref}
    as="h2"
    variant="h2"
    color={color}
    weight={weight}
    {...props}
  />
));

H2.displayName = 'H2';

// ===== H3 COMPONENT =====
export const H3 = forwardRef<HTMLHeadingElement, BaseHeadingProps>(({
  color = 'heading',
  weight = 'semibold',
  ...props
}, ref) => (
  <Typography
    ref={ref}
    as="h3"
    variant="h3"
    color={color}
    weight={weight}
    {...props}
  />
));

H3.displayName = 'H3';

// ===== H4 COMPONENT =====
export const H4 = forwardRef<HTMLHeadingElement, BaseHeadingProps>(({
  color = 'heading',
  weight = 'medium',
  ...props
}, ref) => (
  <Typography
    ref={ref}
    as="h4"
    variant="h4"
    color={color}
    weight={weight}
    {...props}
  />
));

H4.displayName = 'H4';

// ===== H5 COMPONENT =====
export const H5 = forwardRef<HTMLHeadingElement, BaseHeadingProps>(({
  color = 'heading',
  weight = 'medium',
  ...props
}, ref) => (
  <Typography
    ref={ref}
    as="h5"
    variant="h5"
    color={color}
    weight={weight}
    {...props}
  />
));

H5.displayName = 'H5';

// ===== H6 COMPONENT =====
export const H6 = forwardRef<HTMLHeadingElement, BaseHeadingProps>(({
  color = 'heading',
  weight = 'medium',
  ...props
}, ref) => (
  <Typography
    ref={ref}
    as="h6"
    variant="h6"
    color={color}
    weight={weight}
    {...props}
  />
));

H6.displayName = 'H6';

// ===== UTILITY FUNCTIONS FOR OTHER COMPONENTS =====

export const createNavigationTypographyProps = (
  isActive: boolean,
  isDisabled: boolean,
  size: 'sm' | 'md' | 'lg' = 'md'
) => ({
  size,
  weight: (isActive ? 'semibold' : 'medium') as TypographyWeight,
  color: (isDisabled ? 'nav-disabled' : isActive ? 'nav-selected' : 'nav-default') as TypographyColor
});

export const createTypographyClasses = {
  button: (size: 'sm' | 'md' | 'lg') => 
    buildTypographyClasses({
      variant: `label-${size}` as TypographyVariant,
      weight: 'extrabold',
      children: null
    }),
    
  cardTitle: () =>
    buildTypographyClasses({
      variant: 'h5',
      weight: 'semibold',
      color: 'heading',
      children: null
    }),
    
  formLabel: (size: 'sm' | 'md' | 'lg') =>
    buildTypographyClasses({
      variant: size === 'sm' ? 'label-xs' : 'label-sm',
      weight: 'medium',
      color: 'label',
      children: null
    }),
    
  navigationItem: (active: boolean) =>
    buildTypographyClasses({
      variant: 'label-md',
      weight: active ? 'semibold' : 'medium',
      color: active ? 'nav-selected' : 'nav-default',
      children: null
    })
};

// ===== UTILITY FOR TAB COMPONENT =====
export const createTabTypographyProps = (
  variant: 'navigation' | 'page' | 'segment',
  size: 'sm' | 'md' | 'lg',
  isActive: boolean,
  isDisabled: boolean
) => {
  // Size mapping
  const sizeMap = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  };

  // Weight mapping based on variant and state
  const getWeight = (): TypographyWeight => {
    if (variant === 'navigation') {
      return isActive ? 'semibold' : 'medium';
    }
    // For page and segment tabs, use bold when active
    return isActive ? 'bold' : 'medium';
  };

  // 🎯 FIXED: Color mapping - ALL tab variants should use accent when selected
  const getColor = (): TypographyColor => {
    if (isDisabled) {
      return variant === 'navigation' ? 'nav-disabled' : 'disabled';
    }

    if (isActive) {
      // 🎯 KEY FIX: ALL active tabs use accent color (nav-selected maps to accent-500)
      return variant === 'navigation' ? 'nav-selected' : 'accent';
    }

    // Default state
    return variant === 'navigation' ? 'nav-default' : 'secondary';
  };

  return {
    size: sizeMap[size] || sizeMap.md,
    weight: getWeight(),
    color: getColor()
  };
};

// ===== COMPOUND COMPONENTS FOR COMPLEX LAYOUTS =====

export interface TypographyGroupProps {
  children: ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const TypographyGroup: React.FC<TypographyGroupProps> = ({
  children,
  spacing = 'md',
  className
}) => (
  <div className={cn(`typography-group typography-spacing-${spacing}`, className)}>
    {children}
  </div>
);

// ===== HIGHER-ORDER COMPONENT FOR TYPOGRAPHY ENHANCEMENT =====

export interface WithTypographyProps {
  typography?: {
    variant?: TypographyVariant;
    weight?: TypographyWeight;
    color?: TypographyColor;
    className?: string;
  };
}

export function withTypography<P extends Record<string, any>>(
  Component: React.ComponentType<P>
) {
  const WrappedComponent = forwardRef<any, P & WithTypographyProps>(
    ({ typography, ...props }, ref) => {
      if (!typography) {
        return <Component ref={ref} {...(props as unknown as P)} />;
      }

      const typographyClasses = buildTypographyClasses({
        variant: typography.variant,
        weight: typography.weight,
        color: typography.color,
        className: typography.className,
        children: null
      });

      const combinedClassName = cn(
        typographyClasses, 
        (props as any).className
      );

      return (
        <Component
          ref={ref}
          {...(props as unknown as P)}
          className={combinedClassName}
        />
      );
    }
  );

  WrappedComponent.displayName = `withTypography(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
}

// ===== BACKWARDS COMPATIBILITY =====
// Keep old Heading component for migration purposes
/** @deprecated Use H1, H2, H3, H4, H5, H6 components instead */
export const Heading = forwardRef<HTMLHeadingElement, {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: TypographyColor;
  weight?: TypographyWeight;
  children: ReactNode;
  className?: string;
}>(({ level = 1, color = 'heading', weight, children, className, ...props }, ref) => {
  // Map old levels to new components
  const HeadingComponent = [H1, H2, H3, H4, H5, H6][level - 1] || H1;
  
  return (
    <HeadingComponent
      ref={ref}
      color={color}
      weight={weight}
      className={className}
      {...props}
    >
      {children}
    </HeadingComponent>
  );
});

Heading.displayName = 'Heading';

// ===== EXPORT ALL =====
export { getDefaultElement, getColorValue };