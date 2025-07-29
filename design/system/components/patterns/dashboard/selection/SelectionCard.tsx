// ===============================================
// src/design-system/components/patterns/selection/SelectionCard.tsx
// FIXED VERSION - Använder dina CSS tokens och dynamic radius
// ===============================================

import React from 'react';
import { Card, CardContent } from '../../../primitives/Card';
import { cn } from '../../../../lib/utils';

export interface SelectionCardProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  children,
  selected = false,
  onClick,
  disabled = false,
  size = 'md',
  badge,
  icon,
  className
}) => {
  const isClickable = !!onClick && !disabled;

  // Hämta CSS custom properties för dynamic styling
  const getComputedStyles = () => {
    if (typeof window === 'undefined') return {};
    
    const styles = getComputedStyle(document.documentElement);
    return {
      accentColor: styles.getPropertyValue('--accent-500').trim() || '#8B5CF6',
      accentHover: styles.getPropertyValue('--accent-300').trim() || '#C4B5FD',
      borderColor: styles.getPropertyValue('--border-input').trim() || '#E5E7EB',
      radius: styles.getPropertyValue('--foundation-radius-lg').trim() || '8px'
    };
  };

  const computedStyles = getComputedStyles();

  // Inline styles som använder ditt design system
  const cardStyles: React.CSSProperties = {
    position: 'relative',
    transition: 'all 0.2s ease',
    cursor: isClickable ? 'pointer' : 'default',
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    // Använd din dynamiska radius
    borderRadius: `var(--foundation-radius-lg, ${computedStyles.radius})`,
    // Selected states
    borderColor: selected 
      ? `var(--accent-500, ${computedStyles.accentColor})` 
      : `var(--border-input, ${computedStyles.borderColor})`,
    backgroundColor:'var(--surface-card, white)',
    borderWidth: '2px',
    borderStyle: 'solid'
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isClickable && !selected) {
      e.currentTarget.style.borderColor = `var(${computedStyles.accentHover})`;
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isClickable && !selected) {
      e.currentTarget.style.borderColor = `var(--border-input, ${computedStyles.borderColor})`;
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  const contentStyles: React.CSSProperties = {
    position: 'relative',
    minHeight: '60px',
    padding: {
      sm: '12px',
      md: '16px',
      lg: '20px'
    }[size]
  };

  return (
    <div
      className={cn('selection-card', className)}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      aria-pressed={isClickable ? selected : undefined}
      style={cardStyles}
    >
      <div style={contentStyles}>
        {/* Header med icon och badge */}
        {(icon || badge) && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px'
          }}>
            {icon && (
              <div style={{
                color: selected 
                  ? `var(--accent-600, ${computedStyles.accentColor})` 
                  : 'var(--text-secondary)',
                flexShrink: 0
              }}>
                {icon}
              </div>
            )}
            {badge && (
              <div style={{
                fontSize: '12px',
                padding: '2px 6px',
                background: 'var(--secondary-100)',
                borderRadius: '4px',
                color: 'var(--text-secondary)'
              }}>
                {badge}
              </div>
            )}
          </div>
        )}

        {/* Selected indicator - checkmark */}
        {selected && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            backgroundColor: `var(--accent-500, ${computedStyles.accentColor})`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            zIndex: 10,
            border: '2px solid white'
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

