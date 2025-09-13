// ===============================================
// design/system/components/primitives/SmartLogo/SmartLogo.tsx
// SMART LOGO COMPONENT - Shows company logo or Blimpify fallback
// ===============================================

import React from 'react';
import { LogoIcon } from '../LogoIcon';

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
}

export const SmartLogo: React.FC<SmartLogoProps> = ({
  variant = 'text',
  size = 'md',
  color = 'primary',
  className = '',
  companyLogoUrl,
  companyLogoFilename,
  showCompanyLogo = true
}) => {
  // Om företagslogotyp finns och ska visas
  if (showCompanyLogo && companyLogoUrl) {
    return (
      <div className={`smart-logo ${className}`}>
        <img
          src={companyLogoUrl}
          alt={companyLogoFilename || 'Företagslogotyp'}
          className="smart-logo__image"
          style={{
            maxHeight: size === 'sm' ? '24px' : size === 'md' ? '32px' : '40px',
            maxWidth: '200px',
            height: 'auto',
            objectFit: 'contain'
          }}
          onError={(e) => {
            console.warn('Failed to load company logo:', companyLogoUrl);
            // Fallback till Blimpify-logotypen om bilden inte laddar
            e.currentTarget.style.display = 'none';
          }}
        />
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
