// ===============================================
// design/system/components/media/Video/Video.tsx
// VIDEO COMPONENT - Lazy loaded, paused by default, with first-frame thumbnails
// ===============================================

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import './Video.css';

// ===== TYPE DEFINITIONS =====

export interface VideoProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  /** Video source URL */
  src: string;
  /** Context-aware preset for common video use cases */
  context?: 'portfolio-card' | 'hero' | 'grid' | 'modal' | 'background';
  /** Poster image URL (replaces client-side extraction) */
  poster?: string;
  /** Video width */
  width?: number | string;
  /** Video height */
  height?: number | string;
  /** Aspect ratio (e.g., '16/9', '4/3', '2/3', '1/1') */
  aspectRatio?: string;
  /** Border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
  /** Priority loading (disables lazy loading) */
  priority?: boolean;
  /** Callback when video errors */
  onVideoError?: () => void;
  /** Lazy load threshold (in pixels) */
  rootMargin?: string;
  /** Custom className */
  className?: string;
}

// ===== CONTEXT-AWARE PRESETS =====

const CONTEXT_PRESETS = {
  'portfolio-card': {
    preload: 'none' as const,
    loading: 'lazy' as const,
    rootMargin: '800px',
    controls: true,
    autoPlay: false,
    muted: false,
    loop: false,
    playsInline: true,
  },
  'hero': {
    preload: 'metadata' as const,
    loading: 'eager' as const,
    controls: false,
    autoPlay: false,
    muted: true,
    loop: true,
    playsInline: true,
  },
  'grid': {
    preload: 'none' as const,
    loading: 'lazy' as const,
    rootMargin: '400px',
    controls: true,
    autoPlay: false,
    muted: true,
    loop: false,
    playsInline: true,
  },
  'modal': {
    preload: 'auto' as const,
    loading: 'eager' as const,
    controls: true,
    autoPlay: true,
    muted: false,
    loop: true,
    playsInline: true,
  },
  'background': {
    preload: 'metadata' as const,
    loading: 'lazy' as const,
    rootMargin: '200px',
    controls: false,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
  },
} as const;

// ===== MAIN VIDEO COMPONENT =====

export const Video: React.FC<VideoProps> = ({
  src,
  context,
  poster,
  width,
  height,
  aspectRatio = '16/9',
  radius = 'md',
  loading,
  priority = false,
  onVideoError,
  rootMargin,
  className,
  style,
  controls,
  playsInline,
  preload,
  autoPlay,
  muted,
  loop,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);

  // Merge context preset with manual overrides
  const preset = context ? CONTEXT_PRESETS[context] : {};

  const finalLoading = loading ?? preset.loading ?? 'lazy';
  const finalRootMargin = rootMargin ?? preset.rootMargin ?? '800px';
  const finalPreload = preload ?? preset.preload ?? 'metadata';
  const finalControls = controls ?? preset.controls ?? true;
  const finalPlaysInline = playsInline ?? preset.playsInline ?? true;
  const finalAutoPlay = autoPlay ?? preset.autoPlay ?? false;
  const finalMuted = muted ?? preset.muted ?? false;
  const finalLoop = loop ?? preset.loop ?? false;

  const [isIntersecting, setIsIntersecting] = useState(priority);

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    if (priority || finalLoading === 'eager') {
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
        rootMargin: finalRootMargin,
        threshold: 0.01
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority, finalLoading, finalRootMargin]);

  // Track when metadata is loaded to show video
  useEffect(() => {
    if (!isIntersecting || !videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setIsMetadataLoaded(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [isIntersecting]);

  // Handle video error
  const handleVideoError = () => {
    console.warn('Video error:', src);
    setHasError(true);
    onVideoError?.();
  };

  const shouldLoad = isIntersecting || priority;

  // Build classes
  const containerClasses = cn(
    'video-container',
    `video-container--radius-${radius}`,
    className
  );

  const videoClasses = cn(
    'video-element',
    `video-element--radius-${radius}`
  );

  // Container styles
  const containerStyles: React.CSSProperties = {
    width: width || '100%',
    height: height || 'auto',
    aspectRatio: aspectRatio || undefined,
    position: 'relative',
    overflow: 'hidden',
    background: '#000',
    ...style
  };

  return (
    <div ref={containerRef} className={containerClasses} style={containerStyles}>
      {/* Show placeholder until metadata loads */}
      {shouldLoad && !isMetadataLoaded && !hasError && (
        <div className="video-placeholder">
          <div className="video-placeholder-spinner" />
        </div>
      )}

      {/* Video element - context-aware presets with manual overrides */}
      {shouldLoad && !hasError && (
        <video
          ref={videoRef}
          className={videoClasses}
          src={src}
          poster={poster || undefined}
          onError={handleVideoError}
          controls={finalControls}
          playsInline={finalPlaysInline}
          preload={finalPreload}
          autoPlay={finalAutoPlay}
          muted={finalMuted}
          loop={finalLoop}
          style={{ opacity: isMetadataLoaded ? 1 : 0 }}
          {...(typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
            ? { crossOrigin: 'anonymous' as const }
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