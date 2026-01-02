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

// ===== MAIN VIDEO COMPONENT =====

export const Video: React.FC<VideoProps> = ({
  src,
  width,
  height,
  aspectRatio = '16/9',
  radius = 'md',
  loading = 'lazy',
  priority = false,
  onVideoError,
  rootMargin = '800px',
  className,
  style,
  controls = true,
  playsInline = true,
  preload = 'metadata',
  poster, // Server-provided thumbnail URL (prioritized)
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [clientPosterUrl, setClientPosterUrl] = useState<string>(''); // Client-side fallback
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [posterLoadFailed, setPosterLoadFailed] = useState(false); // Track if server poster 404'd

  // Determine which poster to use (server thumbnail takes priority, unless it failed to load)
  const effectivePosterUrl = (poster && !posterLoadFailed) ? poster : clientPosterUrl;

  // Check if server-provided poster actually exists
  useEffect(() => {
    if (!poster || !isIntersecting) return;

    const img = new Image();
    img.onload = () => {
      // Poster loaded successfully
      setIsMetadataLoaded(true);
      setPosterLoadFailed(false);
    };
    img.onerror = () => {
      // Poster failed to load (404) - trigger client-side extraction
      setPosterLoadFailed(true);
    };
    img.src = poster;
  }, [poster, isIntersecting]);

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

  // Extract first frame as thumbnail when metadata loads (fallback when no server thumbnail or it failed)
  useEffect(() => {
    // Skip client-side extraction if we have a working server thumbnail
    if (poster && !posterLoadFailed) {
      return;
    }

    // Only extract if intersecting, have video ref, and haven't already extracted
    if (!isIntersecting || !videoRef.current || clientPosterUrl) {
      return;
    }

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setIsMetadataLoaded(true);
      // Seek to first frame to ensure it's visible
      video.currentTime = 0.1;
    };

    const handleSeeked = () => {
      // Create canvas to extract first frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setClientPosterUrl(dataUrl);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [isIntersecting, clientPosterUrl, poster, posterLoadFailed]);

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

      {/* Video element - paused by default, loads first frame */}
      {shouldLoad && !hasError && (
        <video
          ref={videoRef}
          className={videoClasses}
          src={src}
          poster={effectivePosterUrl || undefined}
          onError={handleVideoError}
          controls={controls}
          playsInline={playsInline}
          preload={preload}
          autoPlay={false}
          muted={false}
          loop={false}
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
