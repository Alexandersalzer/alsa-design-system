// ===============================================
// src/design-system/components/patterns/dashboard/display/CompanyLogo.tsx
// COMPANY LOGO COMPONENT - Shows customer logo or fallback
// ===============================================

import React from 'react';
import { cn } from '../../../../lib/utils';
import { extractColorsFromImage, applyColorsWithThemeManager, ExtractedColors } from '../../../../utils/colorExtraction';

// ===== TYPE DEFINITIONS =====
export interface CompanyLogoProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  /** Customer logo URL */
  logoUrl?: string;
  /** Fallback logo URL */
  fallbackUrl?: string;
  /** Logo variant */
  variant?: 'sidebar' | 'header' | 'compact' | 'full';
  /** Logo size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Alt text for the logo */
  alt?: string;
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Auto-extract colors from logo and apply as theme */
  autoExtractColors?: boolean;
  /** Callback when colors are extracted */
  onColorsExtracted?: (colors: ExtractedColors) => void;
}

// ===== MAIN COMPONENT =====
export const CompanyLogo = React.forwardRef<HTMLImageElement, CompanyLogoProps>(({
  logoUrl,
  fallbackUrl = '/images/logo.png', // Default Blimpify logo
  variant = 'sidebar',
  size = 'md',
  alt = 'Logo',
  className,
  isLoading = false,
  autoExtractColors = false,
  onColorsExtracted,
  ...props
}, ref) => {
  // Determine which logo to use
  const logoSrc = logoUrl || fallbackUrl;
  const logoAlt = logoUrl ? alt : 'Blimpify Logo';

  // Extract colors when logo loads (only if autoExtractColors is true and we have a customer logo)
  React.useEffect(() => {
    if (autoExtractColors && logoUrl && !isLoading) {
        extractColorsFromImage(logoUrl)
          .then(colors => {
            // Apply colors to document via ThemeManager
            applyColorsWithThemeManager(colors);
            
            // Call callback if provided
            onColorsExtracted?.(colors);
          })
        .catch(error => {
          console.warn('Failed to extract colors from logo:', error);
        });
    }
  }, [autoExtractColors, logoUrl, isLoading, onColorsExtracted]);

  // Size classes based on variant and size
  const getSizeClasses = () => {
    const sizeMap = {
      sidebar: {
        sm: 'w-20 h-6',
        md: 'w-24 h-8', 
        lg: 'w-32 h-10',
        xl: 'w-40 h-12'
      },
      header: {
        sm: 'w-16 h-8',
        md: 'w-20 h-10',
        lg: 'w-24 h-12',
        xl: 'w-32 h-16'
      },
      compact: {
        sm: 'w-12 h-6',
        md: 'w-16 h-8',
        lg: 'w-20 h-10',
        xl: 'w-24 h-12'
      },
      full: {
        sm: 'w-24 h-12',
        md: 'w-32 h-16',
        lg: 'w-40 h-20',
        xl: 'w-48 h-24'
      }
    };
    
    return sizeMap[variant][size];
  };

  // Base classes
  const baseClasses = cn(
    'company-logo',
    `company-logo--${variant}`,
    `company-logo--${size}`,
    getSizeClasses(),
    'object-contain',
    'transition-opacity',
    'duration-200',
    isLoading && 'opacity-50',
    className
  );

  if (isLoading) {
    return (
      <div 
        className={cn(baseClasses, 'bg-gray-200 animate-pulse rounded')}
        ref={ref as React.RefObject<HTMLDivElement>}
      />
    );
  }

  return (
    <img
      ref={ref}
      src={logoSrc}
      alt={logoAlt}
      className={baseClasses}
      {...props}
    />
  );
});

CompanyLogo.displayName = 'CompanyLogo';

// ===== SUB-COMPONENTS =====

export interface CompanyLogoWithTextProps extends CompanyLogoProps {
  /** Show text alongside logo */
  showText?: boolean;
  /** Custom text */
  text?: string;
  /** Text size */
  textSize?: 'sm' | 'md' | 'lg';
}

export const CompanyLogoWithText = React.forwardRef<HTMLDivElement, CompanyLogoWithTextProps>(({
  showText = true,
  text,
  textSize = 'md',
  ...logoProps
}, ref) => {
  const textClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div ref={ref} className="flex items-center gap-3">
      <CompanyLogo {...logoProps} />
      {showText && (
        <span className={cn('font-semibold text-gray-900', textClasses[textSize])}>
          {text || 'Blimpify'}
        </span>
      )}
    </div>
  );
});

CompanyLogoWithText.displayName = 'CompanyLogoWithText';
