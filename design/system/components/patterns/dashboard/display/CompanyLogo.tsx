// ===============================================
// src/design-system/components/patterns/dashboard/display/CompanyLogo.tsx
// COMPANY LOGO COMPONENT - Shows customer logo or fallback
// ===============================================

import React, { useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';
import { extractColorsFromImage, applyColorsWithThemeManager, ExtractedColors } from '../../../../utils/colorExtraction';
import { LogoIcon } from '../../../primitives/LogoIcon';

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
  // State for logo brightness detection and theme
  const [logoBrightness, setLogoBrightness] = useState<number | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Detect current theme
  useEffect(() => {
    const detectTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(isDark ? 'dark' : 'light');
    };

    detectTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', detectTheme);
    };
  }, []);

  // Analyze logo brightness when it loads
  useEffect(() => {
    if (!logoUrl) return;

    const analyzeLogoBrightness = async () => {
      try {
        const img = new Image();
        // Try to set CORS, but don't fail if it doesn't work
        try {
          img.crossOrigin = 'anonymous';
        } catch (e) {
          // CORS not available, continue anyway
        }
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) return;
          
          // Use small canvas for quick analysis
          canvas.width = 50;
          canvas.height = 50;
          
          ctx.drawImage(img, 0, 0, 50, 50);
          const imageData = ctx.getImageData(0, 0, 50, 50);
          const data = imageData.data;
          
          let totalBrightness = 0;
          let pixelCount = 0;
          
          // Sample every 4th pixel for performance
          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            // Skip transparent pixels
            if (a < 128) continue;
            
            // Calculate brightness (0-255)
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
            totalBrightness += brightness;
            pixelCount++;
          }
          
          if (pixelCount > 0) {
            const averageBrightness = totalBrightness / pixelCount;
            setLogoBrightness(averageBrightness);
            
            const willInvert = (currentTheme === 'light' && averageBrightness > 200) || 
                              (currentTheme === 'dark' && averageBrightness < 50);
            
            console.log('🎨 Logo brightness analysis:', {
              brightness: averageBrightness,
              theme: currentTheme,
              willInvert,
              reason: willInvert ? 
                (currentTheme === 'light' ? 'Too light for light mode' : 'Too dark for dark mode') : 
                'Good contrast - no inversion needed'
            });
          }
        };
        
        img.onerror = () => {
          console.warn('🎨 Could not analyze logo brightness (CORS or loading error), using default behavior');
          // Don't set brightness, so no inversion will be applied
        };
        
        img.src = logoUrl;
      } catch (error) {
        console.warn('Failed to analyze logo brightness:', error);
      }
    };

    analyzeLogoBrightness();
  }, [logoUrl, currentTheme]);

  // Extract colors when logo loads (only if autoExtractColors is true and we have a customer logo)
  React.useEffect(() => {
    if (autoExtractColors && logoUrl && !isLoading) {
        extractColorsFromImage(logoUrl)
          .then(colors => {
            applyColorsWithThemeManager(colors);
            onColorsExtracted?.(colors);
          })
          .catch(error => {
            console.warn('Failed to extract colors from logo:', error);
          });
    }
  }, [autoExtractColors, logoUrl, isLoading, onColorsExtracted]);

  // If no customer logo, show Blimpify text logo
  if (!logoUrl) {
    return (
      <LogoIcon 
        variant="text" 
        size={size}
        className={cn(className)}
        color="current"
      />
    );
  }

  // Determine which logo to use for customer logos
  const logoSrc = logoUrl;
  const logoAlt = alt;

  // Determine if we need to invert the logo
  const needsInversion = logoBrightness !== null && (
    (currentTheme === 'light' && logoBrightness > 200) || // Very light logo in light mode
    (currentTheme === 'dark' && logoBrightness < 50)      // Very dark logo in dark mode
  );


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

  // Base classes with conditional inversion
  const baseClasses = cn(
    'company-logo',
    `company-logo--${variant}`,
    `company-logo--${size}`,
    getSizeClasses(),
    'object-contain',
    'transition-all',
    'duration-200',
    isLoading && 'opacity-50',
    needsInversion && 'invert', // CSS filter to invert colors
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
