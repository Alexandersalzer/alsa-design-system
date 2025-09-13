// ===============================================
// design/system/components/primitives/SmartLogo/SmartLogo.tsx
// SMART LOGO COMPONENT - Shows company logo or Blimpify fallback
// ===============================================

import React from 'react';
import { LogoIcon } from '../LogoIcon';
import { useTheme } from '../../../hooks/useTheme';
import './SmartLogo.css';

export interface SmartLogoProps {
  /** Logo variant */
  variant?: 'icon' | 'text';
  /** Logo size */
  size?: 'sm' | 'md' | 'lg';
  /** Logo color */
  color?: 'primary' | 'secondary' | 'accent';
  /** Additional CSS classes */
  className?: string;
  /** Company logo URL */
  companyLogoUrl?: string;
  /** Company logo filename */
  companyLogoFilename?: string;
  /** Show company logo if available */
  showCompanyLogo?: boolean;
  /** Force logo background color (for logos that need it) */
  backgroundColor?: string;
  /** Force logo padding */
  padding?: string;
  /** Logo style variant */
  logoStyle?: 'default' | 'minimal' | 'framed' | 'transparent';
  /** Color inversion mode */
  colorInversion?: 'auto' | 'light' | 'dark' | 'none';
}

export const SmartLogo: React.FC<SmartLogoProps> = ({
  variant = 'text',
  size = 'md',
  color = 'primary',
  className = '',
  companyLogoUrl,
  companyLogoFilename,
  showCompanyLogo = true,
  backgroundColor,
  padding,
  logoStyle = 'default',
  colorInversion = 'auto'
}) => {
  const { currentTheme } = useTheme();

  // Size mappings for consistent sizing
  const sizeMap = {
    sm: {
      height: '24px',
      maxHeight: '24px',
      maxWidth: '120px',
      padding: padding || '4px'
    },
    md: {
      height: '32px',
      maxHeight: '32px',
      maxWidth: '180px',
      padding: padding || '6px'
    },
    lg: {
      height: '40px',
      maxHeight: '40px',
      maxWidth: '240px',
      padding: padding || '8px'
    }
  };

  // Background color logic based on theme and style
  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    
    // Style-based backgrounds
    switch (logoStyle) {
      case 'transparent':
        return 'transparent';
      case 'minimal':
        return currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)';
      case 'framed':
        return currentTheme === 'dark' ? '#ffffff' : '#f8f9fa';
      case 'default':
      default:
        return currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.03)';
    }
  };

  // Border logic based on style
  const getBorderStyle = () => {
    switch (logoStyle) {
      case 'transparent':
        return 'none';
      case 'minimal':
        return `1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`;
      case 'framed':
        return `2px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`;
      case 'default':
      default:
        return `1px solid ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`;
    }
  };

  // Om företagslogotyp finns och ska visas
  if (showCompanyLogo && companyLogoUrl) {
    const currentSize = sizeMap[size];
    
    return (
      <div className={`smart-logo smart-logo--${size} smart-logo--${logoStyle} smart-logo--${colorInversion}-invert ${className}`}>
        <div
          className="smart-logo__container"
          data-theme={currentTheme}
          data-style={logoStyle}
          data-inversion={colorInversion}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: currentSize.height,
            maxHeight: currentSize.maxHeight,
            maxWidth: currentSize.maxWidth,
            padding: currentSize.padding,
            backgroundColor: getBackgroundColor(),
            borderRadius: logoStyle === 'framed' ? 'var(--foundation-radius-lg)' : 'var(--foundation-radius-md)',
            border: getBorderStyle(),
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
        >
          <img
            src={companyLogoUrl}
            alt={companyLogoFilename || 'Företagslogotyp'}
            className="smart-logo__image"
            style={{
              maxHeight: `calc(${currentSize.height} - ${currentSize.padding})`,
              maxWidth: `calc(${currentSize.maxWidth} - ${currentSize.padding})`,
              height: 'auto',
              width: 'auto',
              minWidth: 'auto',
              minHeight: 'auto',
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block'
            }}
            onError={(e) => {
              console.warn('Failed to load company logo:', companyLogoUrl);
              // Fallback till Blimpify-logotypen om bilden inte laddar
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  }

  // Fallback till Blimpify-logotypen
  return (
    <LogoIcon 
      variant={variant}
      size={size}
      color={color}
      className={className}
    />
  );
};

SmartLogo.displayName = 'SmartLogo';
