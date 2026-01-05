// ===============================================
// OverflowContainer Component
// Allows content to overflow container bounds
// ===============================================

import React, { CSSProperties } from 'react';
import { cn } from '../../../utils/cn';

export interface OverflowContainerProps {
  children: React.ReactNode;
  /** Direction to allow overflow (default: 'right') */
  direction?: 'right' | 'left' | 'top' | 'bottom' | 'all';
  /** How much content extends beyond container in pixels (default: 220) */
  spillAmount?: number;
  /** Additional className */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * OverflowContainer - Allows child content to overflow beyond container bounds
 * Perfect for creating the "spill" effect where images extend beyond the layout
 */
export const OverflowContainer: React.FC<OverflowContainerProps> = ({
  children,
  direction = 'right',
  spillAmount = 220,
  className,
  style,
}) => {
  const getOverflowStyles = (): CSSProperties => {
    const baseStyles: CSSProperties = {
      position: 'relative',
      overflow: 'visible',
    };

    // Apply spill effect based on direction
    switch (direction) {
      case 'right':
        return {
          ...baseStyles,
          width: `calc(100% + ${spillAmount}px)`,
          marginRight: `-${spillAmount}px`,
        };
      case 'left':
        return {
          ...baseStyles,
          width: `calc(100% + ${spillAmount}px)`,
          marginLeft: `-${spillAmount}px`,
        };
      case 'top':
        return {
          ...baseStyles,
          height: `calc(100% + ${spillAmount}px)`,
          marginTop: `-${spillAmount}px`,
        };
      case 'bottom':
        return {
          ...baseStyles,
          height: `calc(100% + ${spillAmount}px)`,
          marginBottom: `-${spillAmount}px`,
        };
      case 'all':
        return {
          ...baseStyles,
          width: `calc(100% + ${spillAmount * 2}px)`,
          height: `calc(100% + ${spillAmount * 2}px)`,
          margin: `-${spillAmount}px`,
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div
      className={cn('overflow-container', className)}
      style={{
        ...getOverflowStyles(),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
