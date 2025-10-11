// ===============================================
// design/system/components/primitives/IconContainer/IconContainer.tsx
// ICON CONTAINER - Universal icon wrapper with different style variants
// ===============================================

import React from 'react';
import { Icon, IconSize, IconColor } from '../Icon';
import './IconContainer.css';

export type IconContainerVariant = 
  | 'circle'       // Cirkulär bakgrund
  | 'square'       // Fyrkantig bakgrund med skarpa hörn
  | 'rounded'      // Fyrkantig bakgrund med rundade hörn
  | 'soft-rounded' // Fyrkantig bakgrund med mjukt rundade hörn (lg)
  | 'none';        // Ingen bakgrund, bara ikonen

export type IconContainerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IconContainerProps {
  children: React.ReactElement;
  variant?: IconContainerVariant;
  size?: IconContainerSize;
  iconSize?: IconSize;
  iconColor?: IconColor | string; // Can be IconColor or custom CSS color
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
  className?: string;
}

const sizeMap = {
  sm: {
    container: '48px',
    icon: 'md' as IconSize
  },
  md: {
    container: '64px',
    icon: 'lg' as IconSize
  },
  lg: {
    container: '80px',
    icon: 'xl' as IconSize
  },
  xl: {
    container: '96px',
    icon: '2xl' as IconSize
  }
};

const radiusMap = {
  circle: 'var(--foundation-radius-full)',
  square: '0',
  rounded: 'var(--foundation-radius-md)',
  'soft-rounded': 'var(--foundation-radius-lg)',
  none: '0'
};

export const IconContainer: React.FC<IconContainerProps> = ({
  children,
  variant = 'circle',
  size = 'md',
  iconSize,
  iconColor = 'accent',
  backgroundColor = 'var(--accent-50)',
  borderColor = 'var(--accent-200)',
  borderWidth = '2px',
  className = ''
}) => {
  const containerSize = sizeMap[size].container;
  const defaultIconSize = sizeMap[size].icon;
  const finalIconSize = iconSize || defaultIconSize;
  const borderRadius = radiusMap[variant];

  // Check if iconColor is a valid IconColor or a custom CSS color string
  const isValidIconColor = (color: string): color is IconColor => {
    const validColors: IconColor[] = [
      'primary', 'secondary', 'tertiary', 'disabled', 'inverse',
      'heading', 'body', 'accent', 'success', 'warning', 'error',
      'muted', 'subtle', 'nav-item', 'nav-item-hover', 'nav-item-selected',
      'user-menu', 'search', 'empty-state', 'card-primary',
      'button-primary', 'button-secondary', 'button-accent', 'button-ghost', 'button-destructive', 'button-disabled'
    ];
    return validColors.includes(color as IconColor);
  };

  const useCustomColor = typeof iconColor === 'string' && !isValidIconColor(iconColor);

  // If variant is 'none', render icon without container
  if (variant === 'none') {
    if (useCustomColor) {
      return (
        <div style={{ color: iconColor as string }}>
          {React.cloneElement(children, { 
            style: { width: '100%', height: '100%', ...children.props.style }
          })}
        </div>
      );
    }
    return (
      <Icon size={finalIconSize} color={iconColor as IconColor}>
        {children}
      </Icon>
    );
  }

  return (
    <div
      className={`icon-container icon-container--${variant} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: containerSize,
        height: containerSize,
        borderRadius: borderRadius,
        background: backgroundColor,
        border: `${borderWidth} solid ${borderColor}`,
        flexShrink: 0,
        ...(useCustomColor && { color: iconColor as string })
      }}
    >
      {useCustomColor ? (
        React.cloneElement(children, { 
          style: { width: '100%', height: '100%', ...children.props.style }
        })
      ) : (
        <Icon size={finalIconSize} color={iconColor as IconColor}>
          {children}
        </Icon>
      )}
    </div>
  );
};

IconContainer.displayName = 'IconContainer';

