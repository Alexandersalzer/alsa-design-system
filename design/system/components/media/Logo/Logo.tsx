// blimpify-ui/design/system/components/Logo/Logo.tsx
'use client';

import React from 'react';

export interface LogoProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'contain' | 'cover' | 'fill';
  grayscale?: boolean;
  opacity?: number;
  className?: string;
  fallbackText?: string;
  onClick?: () => void;
}

const sizeMap = {
  xs: { width: '60px', height: '40px' },
  sm: { width: '80px', height: '50px' },
  md: { width: '120px', height: '70px' },
  lg: { width: '160px', height: '90px' },
  xl: { width: '200px', height: '110px' },
  '2xl': { width: '240px', height: '130px' }
};

export const Logo: React.FC<LogoProps> = ({
  src,
  alt,
  size = 'md',
  variant = 'contain',
  grayscale = false,
  opacity = 1,
  className = '',
  fallbackText,
  onClick
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const { width, height } = sizeMap[size];

  const containerStyle: React.CSSProperties = {
    width,
    height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: onClick ? 'pointer' : 'default',
  };

  const imageStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: variant,
    opacity: imageLoaded ? opacity : 0,
    transition: 'opacity 0.2s ease-in-out',
    filter: grayscale ? 'grayscale(100%)' : 'none',
  };

  const fallbackStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--surface-muted)',
    color: 'var(--text-tertiary)',
    fontSize: '0.75rem',
    fontWeight: 500,
    borderRadius: '4px',
  };

  if (imageError && fallbackText) {
    return (
      <div style={containerStyle} className={className} onClick={onClick}>
        <div style={fallbackStyle}>
          {fallbackText}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className} onClick={onClick}>
      {!imageError ? (
        <img
          src={src}
          alt={alt}
          style={imageStyle}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      ) : (
        <div style={fallbackStyle}>
          <svg style={{ width: '50%', height: '50%' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};