import React from 'react';

export interface LogoProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'contain' | 'cover' | 'fill';
  maxWidth?: string;
  maxHeight?: string;
  className?: string;
  fallbackText?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8', 
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
  '2xl': 'w-24 h-24'
};

const variantClasses = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill'
};

export const Logo: React.FC<LogoProps> = ({
  src,
  alt,
  size = 'md',
  variant = 'contain',
  maxWidth,
  maxHeight,
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

  const containerClasses = `
    ${sizeClasses[size]}
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${className}
  `.trim();

  const imageClasses = `
    w-full h-full
    ${variantClasses[variant]}
    transition-opacity duration-200
    ${imageLoaded ? 'opacity-100' : 'opacity-0'}
  `.trim();

  const fallbackClasses = `
    w-full h-full
    bg-gray-100
    flex items-center justify-center
    text-gray-400 text-xs font-medium
    rounded
  `;

  const imageStyle: React.CSSProperties = {
    maxWidth: maxWidth || '100%',
    maxHeight: maxHeight || '100%'
  };

  if (imageError && fallbackText) {
    return (
      <div className={containerClasses} onClick={onClick}>
        <div className={fallbackClasses}>
          {fallbackText}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses} onClick={onClick}>
      {!imageError ? (
        <img
          src={src}
          alt={alt}
          className={imageClasses}
          style={imageStyle}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      ) : (
        <div className={fallbackClasses}>
          <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};
