// ===============================================
// design/system/components/media/SquareImageContainer/SquareImageContainer.tsx
// SQUARE IMAGE CONTAINER - Consistent square display for any aspect ratio image
// - Square images: fit perfectly with padding
// - Portrait images: width 100%, overflow bottom (shows top portion)
// - Landscape images: height 100%, overflow right (shows left portion)
// ===============================================

import React, { useRef, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import './SquareImageContainer.css';

export interface SquareImageContainerProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Padding inside the container around the image */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Border radius of the container */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Border radius of the image wrapper */
  imageRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether overflow is visible or hidden */
  overflow?: 'hidden' | 'visible';
  /** Background color of the container (visible when padding > none) */
  backgroundColor?: string;
  /** Custom className */
  className?: string;
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback when image errors */
  onError?: () => void;
}

export const SquareImageContainer: React.FC<SquareImageContainerProps> = ({
  src,
  alt,
  padding = 'none',
  radius = 'md',
  imageRadius = 'md',
  overflow = 'hidden',
  backgroundColor,
  className,
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageOrientation, setImageOrientation] = React.useState<'square' | 'portrait' | 'landscape' | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const processImage = (img: HTMLImageElement) => {
    const { naturalWidth, naturalHeight } = img;

    if (naturalWidth === 0 || naturalHeight === 0) return;

    // Determine orientation based on aspect ratio
    const ratio = naturalWidth / naturalHeight;
    if (ratio > 1.1) {
      setImageOrientation('landscape');
    } else if (ratio < 0.9) {
      setImageOrientation('portrait');
    } else {
      setImageOrientation('square');
    }

    setIsLoaded(true);
    onLoad?.();
  };

  // Check if image is already loaded (cached)
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      processImage(img);
    }
  }, [src]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    processImage(e.currentTarget);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true); // Hide skeleton on error too
    onError?.();
  };

  const containerClasses = cn(
    'square-image-container',
    `square-image-container--padding-${padding}`,
    `square-image-container--radius-${radius}`,
    `square-image-container--overflow-${overflow}`,
    imageOrientation && `square-image-container--${imageOrientation}`,
    className
  );

  const wrapperClasses = cn(
    'square-image-container__wrapper',
    `square-image-container__wrapper--radius-${imageRadius}`
  );

  const containerStyle: React.CSSProperties = {
    ...(backgroundColor && { backgroundColor }),
  };

  return (
    <div className={containerClasses} style={containerStyle}>
      <div className={wrapperClasses}>
        {/* Image is always rendered and visible */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="square-image-container__image"
          loading={loading}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Loading skeleton - only shown while loading */}
        {!isLoaded && !hasError && (
          <div className="square-image-container__skeleton" />
        )}

        {/* Error state */}
        {hasError && (
          <div className="square-image-container__error">
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
          </div>
        )}
      </div>
    </div>
  );
};

SquareImageContainer.displayName = 'SquareImageContainer';
