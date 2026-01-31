// ===============================================
// design/system/components/media/Video/Video.tsx
// VIDEO COMPONENT - Lazy loaded, paused by default
// UPDATED: Removed crossOrigin to avoid CORS requirements
// ===============================================

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Spinner } from '../../feedback/Spinner/Spinner';
import { Skeleton } from '../../feedback/LoadingSkeleton/LoadingSkeleton';
import './Video.css';

// ===== TYPE DEFINITIONS =====

export interface VideoProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  /** Video source URL */
  src: string;
  /** Video width */
  width?: number | string;
  /** Video height */
  height?: number | string;
  /** Max height for the video container */
  maxHeight?: number | string;
  /** Aspect ratio (e.g., '16/9', '4/3', '2/3', '1/1') */
  aspectRatio?: string;
  /** Border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Object fit behavior */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
  /** Priority loading (disables lazy loading) */
  priority?: boolean;
  /** Loading indicator type - 'skeleton' (default) fills the space with pulsing effect, 'spinner' shows centered spinner */
  loadingType?: 'skeleton' | 'spinner';
  /** Callback when video errors */
  onVideoError?: () => void;
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
  maxHeight,
  aspectRatio = '16/9',
  radius = 'md',
  objectFit = 'contain',
  loading = 'lazy',
  priority = false,
  loadingType = 'skeleton',
  onVideoError,
  rootMargin = '800px',
  className,
  style,
  controls = true,
  playsInline = true,
  preload = 'metadata',
  poster,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const [hasError, setHasError] = useState(false);
  // Don't show loading if we have a poster - poster displays immediately
  const [isLoading, setIsLoading] = useState(!poster);

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    if (priority || loading === 'eager') {
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
  }, [priority, loading, rootMargin]);

  // Handle video error
  const handleVideoError = () => {
    console.warn('Video error:', src);
    setHasError(true);
    setIsLoading(false);
    onVideoError?.();
  };

  // Handle video loading events
  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const shouldLoad = isIntersecting || priority;

  // Build classes
  const containerClasses = cn(
    'video-container',
    `video-container--radius-${radius}`,
    (isLoading && !poster) && 'video-container--loading',
    className
  );

  const videoClasses = cn(
    'video-element',
    `video-element--radius-${radius}`,
    `video-element--object-fit-${objectFit}`
  );

  // Container styles - explicit dimensions take priority over aspect ratio
  const containerStyles: React.CSSProperties = {
    ...(width ? { width } : { width: '100%' }),
    ...(height ? { height } : {}),
    ...(maxHeight ? { maxHeight } : {}),
    ...(aspectRatio && !height ? { aspectRatio } : {}),
    position: 'relative',
    overflow: 'hidden',
    background: (isLoading && !poster) ? 'var(--surface-raised)' : 'transparent',
    ...style
  };

  return (
    <div ref={containerRef} className={containerClasses} style={containerStyles}>
      {/* Loading overlay - only show if NO poster/thumbnail and loading */}
      {isLoading && shouldLoad && !hasError && !poster && (
        <div className="video-loading-overlay">
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
            <Spinner size="sm" />
          )}
        </div>
      )}

      {/* Video element */}
      {shouldLoad && (
        <video
          ref={videoRef}
          className={videoClasses}
          src={src}
          poster={poster}
          onError={handleVideoError}
          onLoadedData={handleLoadedData}
          onLoadStart={handleLoadStart}
          controls={controls}
          playsInline={playsInline}
          preload={preload}
          autoPlay={false}
          muted={false}
          loop={false}
          {...props}
        >
          Your browser does not support the video tag.
        </video>
      )}

      {/* Error state */}
      {hasError && (
        <div className="video-error">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
            <line x1="7" y1="2" x2="7" y2="22" />
            <line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="7" y2="7" />
            <line x1="2" y1="17" x2="7" y2="17" />
            <line x1="17" y1="17" x2="22" y2="17" />
            <line x1="17" y1="7" x2="22" y2="7" />
          </svg>
          <span className="video-error-text">Video not available</span>
        </div>
      )}
    </div>
  );
};

Video.displayName = 'Video';