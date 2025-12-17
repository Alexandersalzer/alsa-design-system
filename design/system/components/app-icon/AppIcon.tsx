// ===============================================
// AppIcon Component
// iOS/macOS-stil app-ikon med abstrakta SVG-motiv
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '@/design/system/utils/cn';
import { Tag } from '../feedback/Tag/Tag';
import { Body } from '../Typography/Typography';
import { getAppIcon } from './appIcons';
import './AppIcon.css';

export type AppIconStatus = 'active' | 'coming-soon' | 'locked';

export interface AppIconProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /**
   * App key för att hämta rätt ikon
   */
  appKey: string;
  /**
   * App-namn som visas under ikonen
   */
  name: string;
  /**
   * Status för appen
   */
  status?: AppIconStatus;
  /**
   * Version (valfritt)
   */
  version?: string;
  /**
   * Storlek på ikonen
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

export const AppIcon = forwardRef<HTMLButtonElement, AppIconProps>(({
  appKey,
  name,
  status = 'active',
  version,
  size = 'md',
  onClick,
  disabled = false,
  className,
  ...props
}, ref) => {
  const IconComponent = getAppIcon(appKey);
  const isClickable = status === 'active' && onClick && !disabled;
  const isDisabled = disabled || status === 'locked' || status === 'coming-soon';

  const classes = cn(
    'app-icon',
    `app-icon--${size}`,
    status === 'active' && 'app-icon--active',
    status === 'coming-soon' && 'app-icon--coming-soon',
    status === 'locked' && 'app-icon--locked',
    isClickable && 'app-icon--clickable',
    isDisabled && 'app-icon--disabled',
    className
  );

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const getStatusBadge = () => {
    if (status === 'active') return null;
    
    if (status === 'coming-soon') {
      return (
        <div className="app-icon__badge">
          <Tag variant="accent" size="small" surface="subtle">
            Kommande
          </Tag>
        </div>
      );
    }
    
    if (status === 'locked') {
      return (
        <div className="app-icon__badge">
          <Tag variant="default" size="small" surface="subtle">
            Låst
          </Tag>
        </div>
      );
    }
    
    return null;
  };

  return (
    <button
      ref={ref}
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-label={`${name}${status === 'active' ? '' : ` (${status === 'coming-soon' ? 'Kommande' : 'Låst'})`}`}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : -1}
      {...props}
    >
      <div className="app-icon__container">
        <div className="app-icon__icon-wrapper">
          <IconComponent className="app-icon__svg" size={size === 'sm' ? 48 : size === 'md' ? 64 : 80} />
          {status === 'locked' && (
            <div className="app-icon__lock-overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          )}
        </div>
        {getStatusBadge()}
      </div>
      
      <div className="app-icon__label">
        <Body size="sm" weight="medium" align="center" className="app-icon__name">
          {name}
        </Body>
        {version && (
          <Body size="xs" color="secondary" align="center" className="app-icon__version">
            v{version}
          </Body>
        )}
      </div>
    </button>
  );
});

AppIcon.displayName = 'AppIcon';

