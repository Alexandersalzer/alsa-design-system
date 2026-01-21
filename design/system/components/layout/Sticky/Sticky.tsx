// ===============================================
// Sticky.tsx Component
// Makes content stick to viewport during scroll
// ===============================================

import React, { CSSProperties } from 'react';
import { cn } from '../../../utils/cn';

export interface StickyProps {
  children: React.ReactNode;
  /** Top offset from viewport (default: '100px') */
  top?: string | number;
  /** z-index for stacking (default: 10) */
  zIndex?: number;
  /** Additional className */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * Sticky component - makes content stick to viewport during scroll
 * Usage: Wrap content that should remain visible while scrolling
 */
export const Sticky: React.FC<StickyProps> = ({
  children,
  top = '100px',
  zIndex = 10,
  className,
  style,
}) => {
  const topValue = typeof top === 'number' ? `${top}px` : top;

  return (
    <div
      className={cn('sticky-container', className)}
      style={{
        position: 'sticky',
        top: topValue,
        zIndex,
        alignSelf: 'flex-start',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
