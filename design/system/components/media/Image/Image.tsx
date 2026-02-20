// ===============================================
// design/system/components/media/Image/Image.tsx
// IMAGE COMPONENT - Cache detection + delayed skeleton + instant image display
// ===============================================

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Component } from '../../frames/component/Component';
import { Spinner } from '../../feedback/Spinner/Spinner';
import { Skeleton } from '../../feedback/LoadingSkeleton/LoadingSkeleton';
import { resolveCdnImageUrl } from '../../../core/utils/env';
import { AccentTintSvg } from '../../backgrounds/AccentTintSvg';
import './Image.css';

// ===== TYPE DEFINITIONS =====

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Image width */
  width?: number | string;
  /** Image height */
  height?: number | string;
  /** Object fit behavior */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Object position - controls image alignment (e.g., 'center', 'top', 'bottom', 'left right', 'center 25%') */
  objectPosition?: string;
  /** Border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
  /** Priority loading (disables lazy loading) */
  priority?: boolean;
  /** Show loading skeleton */
  showSkeleton?: boolean;
  /** Loading indicator type - 'skeleton' (default) fills the space with pulsing effect, 'spinner' shows centered spinner */
  loadingType?: 'skeleton' | 'spinner';
  /** Fallback image on error */
  fallbackSrc?: string;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback when image errors */
  onError?: () => void;
  /** Aspect ratio (e.g., '16/9', '4/3', '1/1') */
  aspectRatio?: string;
  /** Enable hover zoom effect */
  hoverZoom?: boolean;
  /** Lazy load threshold (in pixels) */
  rootMargin?: string;
  /** Custom className */
  className?: string;
  /** Component key for live editing */
  componentKey?: string;
  /**
   * Low Quality Image Placeholder - base64 encoded tiny image (e.g., 20x20px)
   * This will be blurred and shown instantly while the full image loads
   * Example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
   */
  lqip?: string;
  /**
   * BlurHash string - compact representation of the image blur
   * More efficient than LQIP, generates blur from 6-7 character string
   * Example: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.'
   */
  blurHash?: string;
  /**
   * Placeholder background color - dominant color of the image
   * Simplest option, just shows a solid color while loading
   * Example: '#3B82F6' or 'rgb(59, 130, 246)'
   */
  placeholderColor?: string;
  /**
   * Temaadaptiv bild: använd normaliserade light/dark-varianter så att bakgrund och accent matchar temat.
   * Kräver normalizedLightSrc och normalizedDarkSrc (sätts av Image Simplifier).
   */
  themeAdaptive?: boolean;
  /** URL till normaliserad bild för light theme (bakgrund vit, accent systemaccent) */
  normalizedLightSrc?: string;
  /** URL till normaliserad bild för dark theme (bakgrund mörk, accent systemaccent) */
  normalizedDarkSrc?: string;
  /** Vilket tema som gäller; 'system' = läs från data-theme eller prefers-color-scheme */
  themeMode?: 'light' | 'dark' | 'system';
  /** Motiv fylls med accentfärg (samma som ImageBackground). Vit bakgrund + svart motiv. Dark mode: vita delar → surface-page. */
  tint?: 'accent' | 'none';
  /** Oanvänd (behålls för API). */
  themeAware?: boolean;
}

// ===== MAIN IMAGE COMPONENT =====

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  objectPosition = 'center',
  radius = 'none',
  loading = 'lazy',
  priority = false,
  showSkeleton = true,
  loadingType = 'skeleton',
  fallbackSrc,
  onLoad,
  onError,
  aspectRatio,
  hoverZoom = false,
  rootMargin = '200px',
  className,
  style,
  componentKey,
  lqip,
  blurHash,
  placeholderColor,
  themeAdaptive = false,
  normalizedLightSrc,
  normalizedDarkSrc,
  themeMode = 'system',
  tint = 'none',
  themeAware = false,
  ...props
}) => {
  const useNormalized = themeAdaptive && normalizedLightSrc && normalizedDarkSrc;

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light';
    const dataTheme = document.documentElement.getAttribute('data-theme');
    if (dataTheme === 'dark') return 'dark';
    if (dataTheme === 'light') return 'light';
    if (themeMode === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  useEffect(() => {
    if (!useNormalized || themeMode !== 'system') return;
    const update = () => {
      const dataTheme = document.documentElement.getAttribute('data-theme');
      if (dataTheme === 'dark') setEffectiveTheme('dark');
      else if (dataTheme === 'light') setEffectiveTheme('light');
      else setEffectiveTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    };
    update();
    window.addEventListener('theme-changed', update);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', update);
    return () => {
      window.removeEventListener('theme-changed', update);
      media.removeEventListener('change', update);
    };
  }, [useNormalized, themeMode]);

  const normalizedSrc = useNormalized
    ? (effectiveTheme === 'dark' ? normalizedDarkSrc : normalizedLightSrc)
    : undefined;
  const resolvedSrc = resolveCdnImageUrl(
    (normalizedSrc != null ? normalizedSrc : src) || ''
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(priority || loading === 'eager');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ OPTIMIZATION 1: Check if image is already cached (CloudFront/CDN)
  useEffect(() => {
    if (!resolvedSrc || priority || loading === 'eager') {
      return;
    }

    // Create a test image to check cache
    const testImg = new window.Image();
    testImg.src = resolvedSrc;

    // If image loads super fast (< 10ms), it's cached
    const startTime = Date.now();
    
    const checkCache = () => {
      const loadTime = Date.now() - startTime;
      if (loadTime < 10) {
        // Image is in browser cache or CDN cache - show immediately!
        setIsCached(true);
        setIsLoaded(true);
        setIsIntersecting(true);
      }
    };

    testImg.onload = checkCache;
    
    // Also check if already complete (sync load from cache)
    if (testImg.complete) {
      checkCache();
    }
  }, [resolvedSrc, priority, loading]);

  // Intersection Observer for lazy loading (skip if cached or priority)
  useEffect(() => {
    if (priority || loading === 'eager' || isCached) {
      setIsIntersecting(true);
      return;
    }

    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            setIsLoading(true); // Start loading when image enters viewport
          }
        });
      },
      {
        rootMargin,
        threshold: 0.01
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority, loading, rootMargin, isCached]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  // Determine which src to use
  const currentSrc = hasError && fallbackSrc ? resolveCdnImageUrl(fallbackSrc) : resolvedSrc;
  const shouldLoad = isIntersecting || priority || isCached;

  // Trigger loading state when image should load but isn't cached
  // IMPORTANT: Don't show loading state for priority/eager images - they should appear immediately
  useEffect(() => {
    if (shouldLoad && !isCached && !isLoaded && !hasError && !priority && loading !== 'eager') {
      setIsLoading(true);
    }
  }, [shouldLoad, isCached, isLoaded, hasError, priority, loading]);

  // Determine if this is a fixed-size image (explicit dimensions) or responsive (percentage/auto)
  const isFixedSize = typeof width === 'number' || (typeof width === 'string' && !width.includes('%'));

  const useAccentMask = tint === 'accent' && !!resolvedSrc;

  // Build container classes
  const containerClasses = cn(
    'image-container',
    isFixedSize && 'image-container--fixed',
    `image-container--radius-${radius}`,
    hoverZoom && 'image-container--hover-zoom',
    (isLoading && !isCached && !isLoaded) && 'image-container--loading',
    useAccentMask && 'image-container--accent-tint',
    className
  );

  // Build image classes
  const imageClasses = cn(
    'image',
    `image--object-fit-${objectFit}`,
    `image--radius-${radius}`,
    isLoaded && 'image--loaded',
    hasError && 'image--error'
  );

  // Container styles
  // ✅ FIX: Prioritize aspect-ratio for space reservation, avoid conflicting height values
  const containerStyles: React.CSSProperties = {
    width: width || '100%',
    // Only set height if explicitly provided AND no aspectRatio (avoid conflicts)
    ...(height && !aspectRatio ? { height } : {}),
    // Aspect ratio takes priority for proper space reservation
    ...(aspectRatio ? { aspectRatio } : {}),
    position: 'relative',
    overflow: 'hidden'
  };

  // ✅ FIX: Priority/eager images should ALWAYS be visible, even before onLoad fires
  const shouldBeVisible = isLoaded || priority || loading === 'eager' || isCached;

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'block',
    objectPosition: objectPosition,
    opacity: shouldBeVisible ? 1 : 0,  // Show immediately for priority/eager
    transition: 'none'
  };

  // Determine if we should show a progressive placeholder
  const hasProgressivePlaceholder = lqip || blurHash || placeholderColor;
  const showProgressivePlaceholder = hasProgressivePlaceholder && !shouldBeVisible && !hasError;

  return (
    <Component componentKey={componentKey}>
      <div ref={containerRef} className={containerClasses} style={containerStyles}>
        {/* Progressive placeholder - LQIP, BlurHash, or Color */}
        {showProgressivePlaceholder && (
          <div
            className="image-placeholder"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              borderRadius: 'inherit'
            }}
          >
            {/* LQIP - Low Quality Image Placeholder */}
            {lqip && (
              <img
                src={lqip}
                alt=""
                aria-hidden="true"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: objectFit,
                  filter: 'blur(20px)',
                  transform: 'scale(1.1)', // Prevents blur edge artifacts
                  borderRadius: 'inherit'
                }}
              />
            )}

            {/* BlurHash - would need blurhash library */}
            {!lqip && blurHash && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: placeholderColor || '#e5e7eb',
                  borderRadius: 'inherit'
                }}
                data-blurhash={blurHash}
              >
                {/* Note: BlurHash requires blurhash npm package to decode */}
                {/* For now, falls back to solid color */}
              </div>
            )}

            {/* Simple color placeholder */}
            {!lqip && !blurHash && placeholderColor && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: placeholderColor,
                  borderRadius: 'inherit'
                }}
              />
            )}
          </div>
        )}

        {/* Loading overlay - skeleton (default) or spinner (only if no progressive placeholder) */}
        {!hasProgressivePlaceholder && isLoading && !isCached && !shouldBeVisible && !hasError && (
          <div className="image-loading-overlay">
            {loadingType === 'skeleton' ? (
              <Skeleton
                width="100%"
                height="100%"
                variant="pulse"
                shape="rect"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderRadius: 'inherit'
                }}
              />
            ) : (
              <Spinner size="xs" />
            )}
          </div>
        )}

        {/* Actual image: accent-mask (kort, kortbilder) eller vanlig img */}
        {shouldLoad && useAccentMask && (
          <>
            <img
              ref={imgRef}
              src={currentSrc}
              alt=""
              aria-hidden="true"
              style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
              onLoad={handleLoad}
              onError={handleError}
              loading={priority || isCached ? 'eager' : 'lazy'}
            />
            {isLoaded && !hasError && (
              <div
                className="image-accent-mask-wrapper"
                role="img"
                aria-label={alt}
              >
                <AccentTintSvg
                  src={currentSrc}
                  size={objectFit}
                  position={objectPosition}
                  darkRectClassName="image-accent-mask-dark"
                />
              </div>
            )}
          </>
        )}
        {shouldLoad && !useAccentMask && (
          <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            className={imageClasses}
            style={{ ...imageStyles, ...style }}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority || isCached ? 'eager' : 'lazy'}
            {...props}
          />
        )}

        {/* Error state */}
        {hasError && !fallbackSrc && (
          <div className="image-error">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="image-error-text"></span>
          </div>
        )}
      </div>
    </Component>
  );
};

Image.displayName = 'Image';

// ===== SPECIALIZED IMAGE COMPONENTS =====

export interface AvatarImageProps extends Omit<ImageProps, 'radius' | 'objectFit'> {
  /** Avatar size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  size = 'md',
  className,
  ...props
}) => {
  const sizeMap = {
    xs: { width: 32, height: 32 },
    sm: { width: 40, height: 40 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 }
  };

  return (
    <Image
      {...props}
      width={sizeMap[size].width}
      height={sizeMap[size].height}
      radius="full"
      objectFit="cover"
      className={cn('avatar-image', `avatar-image--${size}`, className)}
    />
  );
};

AvatarImage.displayName = 'AvatarImage';

export interface LogoImageProps extends Omit<ImageProps, 'objectFit'> {
  /** 
   * Logo variant for dark mode handling:
   * - 'auto': Inverts in dark mode (default, for black logos)
   * - 'light': Logo designed for light backgrounds, inverts in dark mode
   * - 'dark': Logo designed for dark backgrounds, inverts in light mode
   * - 'color': Full-color logo, never inverts
   */
  variant?: 'auto' | 'light' | 'dark' | 'color';
  /** Object fit behavior (defaults to contain for logos) */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const LogoImage: React.FC<LogoImageProps> = ({
  variant = 'auto',
  objectFit = 'contain',
  className,
  componentKey,
  ...props
}) => {
  return (
    <Image
      {...props}
      objectFit={objectFit}
      className={cn('logo-image', `logo-image--${variant}`, className)}
      componentKey={componentKey}
    />
  );
};

LogoImage.displayName = 'LogoImage';