// ===============================================
// design/system/components/media/Image/Image.tsx
// IMAGE COMPONENT - Cache detection + delayed skeleton + instant image display
// ===============================================

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Component } from '../../frames/component/Component';
import { Spinner } from '../../feedback/Spinner/Spinner';
import { Skeleton } from '../../feedback/LoadingSkeleton/LoadingSkeleton';
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
}

// ===== MAIN IMAGE COMPONENT =====

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
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
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(priority || loading === 'eager');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ OPTIMIZATION 1: Check if image is already cached (CloudFront/CDN)
  useEffect(() => {
    if (!src || priority || loading === 'eager') {
      return;
    }

    // Create a test image to check cache
    const testImg = new window.Image();
    testImg.src = src;

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
  }, [src, priority, loading]);

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
  const currentSrc = hasError && fallbackSrc ? fallbackSrc : src;
  const shouldLoad = isIntersecting || priority || isCached;

  // Trigger loading state when image should load but isn't cached
  useEffect(() => {
    if (shouldLoad && !isCached && !isLoaded && !hasError) {
      setIsLoading(true);
    }
  }, [shouldLoad, isCached, isLoaded, hasError]);

  // Build container classes
  const containerClasses = cn(
    'image-container',
    `image-container--radius-${radius}`,
    hoverZoom && 'image-container--hover-zoom',
    (isLoading && !isCached && !isLoaded) && 'image-container--loading',
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
  const containerStyles: React.CSSProperties = {
    width: width || '100%',
    height: height || 'auto',
    aspectRatio: aspectRatio || undefined,
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  // ✅ FIX: Priority/eager images should ALWAYS be visible, even before onLoad fires
  const shouldBeVisible = isLoaded || priority || loading === 'eager' || isCached;
  
  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'block',
    opacity: shouldBeVisible ? 1 : 0,  // Show immediately for priority/eager
    transition: 'none'
  };

  return (
    <Component componentKey={componentKey}>
      <div ref={containerRef} className={containerClasses} style={containerStyles}>
        {/* Loading overlay - skeleton (default) or spinner */}
        {isLoading && !isCached && !shouldBeVisible && !hasError && (
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

        {/* Actual image */}
        {shouldLoad && (
          <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            className={imageClasses}
            style={imageStyles}
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