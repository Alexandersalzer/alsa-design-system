// ===============================================
// design/system/components/media/Logo/LogoText.tsx
// LOGO TEXT COMPONENT - Branded text for logos and headings
// ===============================================

import React from 'react';
import { cn } from '../../../lib/utils';
import './LogoText.css';

// ===== TYPE DEFINITIONS =====

export interface LogoTextProps {
  /** Text content */
  children: React.ReactNode;
  /** Link href (optional) */
  href?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Letter spacing */
  spacing?: 'normal' | 'tight' | 'wide' | 'wider' | 'widest';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'inverse' | 'inherit';
  /** Font family variant */
  font?: 'brand' | 'heading' | 'body' | 'mono';
  /** Enable gradient text effect */
  gradient?: boolean;
  /** Gradient direction (if gradient enabled) */
  gradientDirection?: 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l';
  /** Enable hover effect */
  hover?: boolean;
  /** Custom className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

// ===== LOGO TEXT COMPONENT =====

export const LogoText: React.FC<LogoTextProps> = ({
  children,
  href,
  size = 'md',
  weight = 'extrabold',
  transform = 'none',
  spacing = 'normal',
  color = 'primary',
  font = 'brand',
  gradient = false,
  gradientDirection = 'to-r',
  hover = true,
  className,
  onClick,
}) => {
  const classes = cn(
    'logo-text',
    `logo-text--size-${size}`,
    `logo-text--weight-${weight}`,
    `logo-text--transform-${transform}`,
    `logo-text--spacing-${spacing}`,
    `logo-text--color-${color}`,
    `logo-text--font-${font}`,
    gradient && 'logo-text--gradient',
    gradient && `logo-text--gradient-${gradientDirection}`,
    hover && 'logo-text--hover',
    className
  );

  // If href is provided, render as link
  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  // Otherwise render as span
  return (
    <span className={classes} onClick={onClick}>
      {children}
    </span>
  );
};

LogoText.displayName = 'LogoText';

// ===== SPECIALIZED VARIANTS =====

export interface BrandNameProps {
  /** Brand name text */
  children: React.ReactNode;
  /** Link href */
  href?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Letter spacing */
  spacing?: 'normal' | 'tight' | 'wide' | 'wider' | 'widest';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'inverse' | 'inherit';
  /** Enable gradient */
  gradient?: boolean;
  /** Custom className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * BrandName - Preset for main brand/company names
 * Used in navbars and headers
 */
export const BrandName: React.FC<BrandNameProps> = ({
  size = 'lg',
  weight = 'extrabold',
  transform = 'none',
  spacing = 'normal',
  color = 'primary',
  gradient = false,
  ...props
}) => {
  return (
    <LogoText
      {...props}
      size={size}
      weight={weight}
      transform={transform}
      spacing={spacing}
      color={color}
      gradient={gradient}
      font="brand"
    />
  );
};

BrandName.displayName = 'BrandName';

export interface ProductNameProps {
  /** Product name text */
  children: React.ReactNode;
  /** Link href */
  href?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Letter spacing */
  spacing?: 'normal' | 'tight' | 'wide' | 'wider' | 'widest';
  /** Custom className */
  className?: string;
}

/**
 * ProductName - Preset for product/app names
 * Used in dashboards and product headers
 */
export const ProductName: React.FC<ProductNameProps> = ({
  size = 'md',
  weight = 'bold',
  spacing = 'tight',
  ...props
}) => {
  return (
    <LogoText
      {...props}
      size={size}
      weight={weight}
      spacing={spacing}
      font="heading"
    />
  );
};

ProductName.displayName = 'ProductName';

export interface SectionTitleProps {
  /** Section title text */
  children: React.ReactNode;
  /** Link href */
  href?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Letter spacing */
  spacing?: 'normal' | 'tight' | 'wide' | 'wider' | 'widest';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'inverse' | 'inherit';
  /** Custom className */
  className?: string;
}

/**
 * SectionTitle - Preset for section titles
 * Used in footers and content sections
 */
export const SectionTitle: React.FC<SectionTitleProps> = ({
  size = 'md',
  weight = 'semibold',
  transform = 'uppercase',
  spacing = 'wide',
  ...props
}) => {
  return (
    <LogoText
      {...props}
      size={size}
      weight={weight}
      transform={transform}
      spacing={spacing}
      font="heading"
    />
  );
};

SectionTitle.displayName = 'SectionTitle';