'use client';

import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  offset?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  zIndex?: number;
}

export const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  ({
    children,
    position = 'top-right',
    offset,
    zIndex = 10,
    className,
    style,
    ...props
  }, ref) => {

    const positionStyles: React.CSSProperties = {
      position: 'absolute',
      zIndex,
      ...(position === 'top-left' && {
        top: offset?.top || 'var(--space-sm)',
        left: offset?.left || 'var(--space-sm)',
      }),
      ...(position === 'top-right' && {
        top: offset?.top || 'var(--space-sm)',
        right: offset?.right || 'var(--space-sm)',
      }),
      ...(position === 'bottom-left' && {
        bottom: offset?.bottom || 'var(--space-sm)',
        left: offset?.left || 'var(--space-sm)',
      }),
      ...(position === 'bottom-right' && {
        bottom: offset?.bottom || 'var(--space-sm)',
        right: offset?.right || 'var(--space-sm)',
      }),
      ...(position === 'center' && {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn('overlay', className)}
        style={positionStyles}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Overlay.displayName = 'Overlay';
