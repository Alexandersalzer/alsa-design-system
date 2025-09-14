// ===============================================
// src/design-system/components/patterns/dashboard/display/CompanyLogo.tsx
// COMPANY LOGO COMPONENT - Shows customer logo or fallback
// ===============================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '../../../../lib/utils';
import { extractColorsFromImage, applyColorsWithThemeManager, ExtractedColors } from '../../../../utils/colorExtraction';
import { analyzeLogo, LogoAnalysis, getLogoClasses, getLogoStyles, getLogoContainerClasses } from '../../../../utils/logoAnalysis';
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
  
  // State for logo analysis
  const [logoAnalysis, setLogoAnalysis] = useState<LogoAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Analyze logo when URL changes (with caching) - ALWAYS runs to maintain hook order
  useEffect(() => {
    if (logoUrl && variant === 'sidebar') {
      // Check cache first
      const cacheKey = `logo-analysis-${logoUrl}`;
      const cachedAnalysis = localStorage.getItem(cacheKey);
      
      if (cachedAnalysis) {
        try {
          const parsed = JSON.parse(cachedAnalysis);
          // Check if cache is not too old (1 hour)
          if (Date.now() - parsed.timestamp < 3600000) {
            setLogoAnalysis(parsed.data);
            console.log('🔍 Using cached logo analysis:', parsed.data);
            return;
          }
        } catch (e) {
          // Invalid cache, continue with fresh analysis
        }
      }
      
      setAnalyzing(true);
      analyzeLogo(logoUrl)
        .then(analysis => {
          setLogoAnalysis(analysis);
          // Cache the result
          localStorage.setItem(cacheKey, JSON.stringify({
            data: analysis,
            timestamp: Date.now()
          }));
          console.log('🔍 Logo analysis completed and cached:', analysis);
        })
        .catch(error => {
          console.warn('Logo analysis failed:', error);
          setLogoAnalysis(null);
        })
        .finally(() => {
          setAnalyzing(false);
        });
    } else {
      // Always reset state when no logo URL or wrong variant
      setLogoAnalysis(null);
      setAnalyzing(false);
    }
  }, [logoUrl, variant]);

  // Detect current theme
  useEffect(() => {
    const detectTheme = () => {
      // Check both data-theme attribute (ThemeModeControl) and dark class (other systems)
      const dataTheme = document.documentElement.getAttribute('data-theme');
      const hasDarkClass = document.documentElement.classList.contains('dark');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const isDark = dataTheme === 'dark' || hasDarkClass || prefersDark;
      const newTheme = isDark ? 'dark' : 'light';
      
      // Only log when theme actually changes
      if (newTheme !== currentTheme) {
        console.log('🎨 Theme changed:', { 
          from: currentTheme, 
          to: newTheme, 
          isDark,
          dataTheme,
          hasDarkClass,
          prefersDark,
          classList: document.documentElement.classList.toString()
        });
      }
      
      setCurrentTheme(newTheme);
    };

    detectTheme();
    
    // Listen for theme changes - multiple methods for better coverage
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'] // Watch both class and data-theme changes
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);

    // Also listen for storage changes (in case theme is stored in localStorage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' || e.key === 'darkMode') {
        detectTheme();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', detectTheme);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentTheme]);

  // Analyze logo brightness - separate function that can be called multiple times (with caching)
  const analyzeLogoBrightness = useCallback(async () => {
    if (!logoUrl) {
      setLogoBrightness(null);
      return;
    }
    
    // Check cache first
    const cacheKey = `logo-brightness-${logoUrl}`;
    const cachedBrightness = localStorage.getItem(cacheKey);
    
    if (cachedBrightness) {
      try {
        const parsed = JSON.parse(cachedBrightness);
        // Check if cache is not too old (1 hour)
        if (Date.now() - parsed.timestamp < 3600000) {
          setLogoBrightness(parsed.data);
          console.log('🎨 Using cached logo brightness:', parsed.data);
          return;
        }
      } catch (e) {
        // Invalid cache, continue with fresh analysis
      }
    }
    
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
          
          // Cache the result
          localStorage.setItem(cacheKey, JSON.stringify({
            data: averageBrightness,
            timestamp: Date.now()
          }));
          
          // More aggressive thresholds for better contrast
          const willInvert = (currentTheme === 'light' && averageBrightness < 100) || 
                            (currentTheme === 'dark' && averageBrightness > 150);
          
          console.log('🎨 Logo brightness analysis completed and cached:', {
            brightness: averageBrightness,
            theme: currentTheme,
            willInvert,
            reason: willInvert ? 
              (currentTheme === 'light' ? 'Too dark for light mode - needs inversion' : 'Too light for dark mode - needs inversion') : 
              'Good contrast - no inversion needed',
            appliedFilter: willInvert ? 'invert(1)' : 'none'
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
  }, [logoUrl, currentTheme]);

  // Analyze logo brightness when it loads
  useEffect(() => {
    analyzeLogoBrightness();
  }, [analyzeLogoBrightness]);

  // Extract colors when logo loads (only if autoExtractColors is true and we have a customer logo) - with caching
  // ALWAYS runs to maintain hook order
  React.useEffect(() => {
    if (autoExtractColors && logoUrl && !isLoading) {
      // Check cache first
      const cacheKey = `logo-colors-${logoUrl}`;
      const cachedColors = localStorage.getItem(cacheKey);
      
      if (cachedColors) {
        try {
          const parsed = JSON.parse(cachedColors);
          // Check if cache is not too old (1 hour)
          if (Date.now() - parsed.timestamp < 3600000) {
            applyColorsWithThemeManager(parsed.data);
            onColorsExtracted?.(parsed.data);
            console.log('🎨 Using cached logo colors:', parsed.data);
            return;
          }
        } catch (e) {
          // Invalid cache, continue with fresh extraction
        }
      }
      
      extractColorsFromImage(logoUrl)
        .then(colors => {
          applyColorsWithThemeManager(colors);
          onColorsExtracted?.(colors);
          
          // Cache the result
          localStorage.setItem(cacheKey, JSON.stringify({
            data: colors,
            timestamp: Date.now()
          }));
          console.log('🎨 Logo colors extracted and cached:', colors);
        })
        .catch(error => {
          console.warn('Failed to extract colors from logo:', error);
        });
    }
    // Always run this effect to maintain hook order, even when conditions aren't met
  }, [autoExtractColors, logoUrl, isLoading, onColorsExtracted]);

  // Early return for no logo - but AFTER all hooks to maintain hook order
  // All hooks must run before any conditional returns

  // Determine which logo to use for customer logos
  const logoSrc = logoUrl;
  const logoAlt = alt;

  // Determine if we need to invert the logo
  // Only invert if logo is essentially black/white (monochrome), not colored
  const isMonochrome = logoBrightness !== null && (
    logoBrightness < 50 ||     // Very dark (black)
    logoBrightness > 200       // Very light (white)
  );
  
  const needsInversion = isMonochrome && (
    (currentTheme === 'light' && logoBrightness > 150) || // Light logo in light mode -> invert to dark
    (currentTheme === 'dark' && logoBrightness < 100)     // Dark logo in dark mode -> invert to light
  );


  // Size classes based on variant, size, and logo analysis (memoized for performance)
  const sizeClasses = useMemo(() => {
    // If we have logo analysis, use intelligent sizing
    if (logoAnalysis && variant === 'sidebar') {
      const { recommendedSize } = logoAnalysis;
      
      // Convert pixel sizes to Tailwind classes
      const getTailwindSize = (pixels: number) => {
        if (pixels <= 16) return 'w-4 h-4';
        if (pixels <= 20) return 'w-5 h-5';
        if (pixels <= 24) return 'w-6 h-6';
        if (pixels <= 28) return 'w-7 h-7';
        if (pixels <= 32) return 'w-8 h-8';
        if (pixels <= 40) return 'w-10 h-10';
        if (pixels <= 48) return 'w-12 h-12';
        return 'w-16 h-16';
      };
      
      // Use recommended size for sidebar
      return getTailwindSize(Math.max(recommendedSize.width, recommendedSize.height));
    }
    
    // Fallback to original sizing for other variants or when no analysis
    const sizeMap = {
      sidebar: {
        sm: 'w-4 h-4',
        md: 'w-4 h-4', 
        lg: 'w-4 h-4',
        xl: 'w-4 h-4'
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
  }, [logoAnalysis, variant, size]);

  // Base classes (memoized for performance)
  const baseClasses = useMemo(() => cn(
    'company-logo',
    `company-logo--${variant}`,
    `company-logo--${size}`,
    sizeClasses,
    'object-contain',
    'transition-all',
    'duration-200',
    isLoading && 'opacity-50',
    // Add logo analysis classes
    logoAnalysis && getLogoClasses(logoAnalysis),
    className
  ), [variant, size, sizeClasses, isLoading, logoAnalysis, className]);

  // Inline styles for inversion and logo analysis (memoized for performance)
  const logoStyle = useMemo(() => ({
    ...(needsInversion ? { 
      filter: 'invert(1)',
      transition: 'filter 0.2s ease-in-out'
    } : {
      transition: 'filter 0.2s ease-in-out'
    }),
    // Add logo analysis styles
    ...(logoAnalysis && variant === 'sidebar' ? getLogoStyles(logoAnalysis) : {})
  }), [needsInversion, logoAnalysis, variant]);

  // Debug logging for inversion
  if (logoBrightness !== null) {
    console.log('🎨 Logo inversion applied:', {
      brightness: logoBrightness,
      theme: currentTheme,
      isMonochrome,
      needsInversion,
      appliedFilter: needsInversion ? 'invert(1)' : 'none',
      result: needsInversion ? 
        (logoBrightness > 150 ? 'Light logo → Dark (better contrast)' : 'Dark logo → Light (better contrast)') :
        isMonochrome ? 
          (logoBrightness > 150 ? 'Light logo stays Light (good contrast)' : 'Dark logo stays Dark (good contrast)') :
          'Colored logo - no inversion (preserve colors)',
      logic: isMonochrome ? 
        (currentTheme === 'light' ? 
          (logoBrightness > 150 ? 'Light logo in light mode -> invert for contrast' : 'Dark logo in light mode -> keep dark') :
          (logoBrightness < 100 ? 'Dark logo in dark mode -> invert for contrast' : 'Light logo in dark mode -> keep light')) :
        'Colored logo detected - skipping inversion to preserve colors'
    });
  }

  // All conditional returns AFTER all hooks to maintain hook order
  if (isLoading) {
    return (
      <div 
        className={cn(baseClasses, 'bg-gray-200 animate-pulse rounded')}
        ref={ref as React.RefObject<HTMLDivElement>}
      />
    );
  }

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

  return (
    <img
      ref={ref}
      src={logoSrc}
      alt={logoAlt}
      className={baseClasses}
      style={logoStyle}
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
