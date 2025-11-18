// ===============================================
// design/system/components/media/Video/Video.tsx
// VIDEO COMPONENT - Cache detection + delayed skeleton + instant poster display
// ===============================================

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import './Video.css';

// ===== TYPE DEFINITIONS =====

export interface VideoProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  /** Video source URL */
  src: string;
  /** Video width */
  width?: number | string;
  /** Video height */
  height?: number | string;
  /** Aspect ratio (e.g., '16/9', '4/3', '1/1') */
  aspectRatio?: string;
  /** Border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
  /** Priority loading (disables lazy loading) */
  priority?: boolean;
  /** Show loading skeleton */
  showSkeleton?: boolean;
  /** Callback when video loads */
  onLoad?: () => void;
  /** Callback when video errors */
  onError?: () => void;
  /** Lazy load threshold (in pixels) */
  rootMargin?: string;
  /** Custom className */
  className?: string;
}

// ===== MAIN VIDEO COMPONENT =====

export const Video: React.FC<VideoProps> = ({
  src,
  width,
  height,
  aspectRatio = '16/9',
  radius = 'md',
  loading = 'lazy',
  priority = false,
  showSkeleton = true,
  onLoad,
  onError,
  rootMargin = '200px',
  className,
  style,
  controls = true,
  playsInline = true,
  preload = 'metadata',
  crossOrigin = 'anonymous',
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCached, setIsCached] = useState(false);

  // ✅ OPTIMIZATION 1: Check if video is already cached (CloudFront/CDN)
  useEffect(() => {
    if (!src || priority || loading === 'eager') {
      return;
    }

    // Create a test video to check cache
    const testVideo = document.createElement('video');
    testVideo.src = src;
    testVideo.preload = 'metadata';

    // If video loads super fast (< 50ms), it's cached
    const startTime = Date.now();
    
    const checkCache = () => {
      const loadTime = Date.now() - startTime;
      if (loadTime < 50) {
        // Video is in browser cache or CDN cache - show immediately!
        setIsCached(true);
        setIsLoaded(true);
        setIsIntersecting(true);
      }
    };

    testVideo.onloadedmetadata = checkCache;
    
    // Also check if already complete (sync load from cache)
    if (testVideo.readyState >= 1) {
      checkCache();
    }

    return () => {
      testVideo.remove();
    };
  }, [src, priority, loading]);

  // Intersection Observer for lazy loading (skip if cached)
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

  // Handle video load
  const handleLoadedMetadata = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  // Handle video error
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.warn('Video error:', src);
    setHasError(true);
    onError?.();
  };

  const shouldLoad = isIntersecting || priority || isCached;

  // Build container classes
  const containerClasses = cn(
    'video-container',
    `video-container--radius-${radius}`,
    className
  );

  // Build video classes
  const videoClasses = cn(
    'video',
    `video--radius-${radius}`,
    isLoaded && 'video--loaded',
    hasError && 'video--error'
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

  // ✅ OPTIMIZATION 2: Video appears instantly (no fade animation)
  const videoStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
    opacity: isLoaded ? 1 : 0,  // Instant switch when loaded
    transition: 'none'           // No fade animation
  };

  return (
    <div ref={containerRef} className={containerClasses} style={containerStyles}>
      {/* ✅ OPTIMIZATION 3: Delayed skeleton - DON'T show for cached videos */}
      {showSkeleton && !isLoaded && !hasError && !priority && !isCached && loading !== 'eager' && (
        <div className="video-skeleton video-skeleton--delayed" />
      )}

      {/* Actual video */}
      {shouldLoad && !hasError && (
        <video
          ref={videoRef}
          className={videoClasses}
          style={videoStyles}
          src={src}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleVideoError}
          controls={controls}
          playsInline={playsInline}
          preload={priority || isCached ? 'auto' : preload}
          {...(typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
            ? { crossOrigin: crossOrigin as 'anonymous' | 'use-credentials' | undefined }
            : {})}
          {...props}
        >
          Your browser does not support the video tag.
        </video>
      )}

      {/* Error state */}
      {hasError && (
        <div className="video-error">
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
            <path d="M23 7l-7 5 7 5V7z" />
          </svg>
          <span className="video-error-text">Video not available</span>
        </div>
      )}
    </div>
  );
};

Video.displayName = 'Video';