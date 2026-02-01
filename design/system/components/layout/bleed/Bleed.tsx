// ===============================================
// design/system/components/layout/bleed/Bleed.tsx
// BLEED - Allows content to overflow its container
// ===============================================

import React, { ReactNode } from 'react';
import './Bleed.css';

export interface BleedProps {
  children: ReactNode;
  /** Amount to bleed on all sides (CSS value) */
  amount?: string;
  /** Amount to bleed on top */
  top?: string;
  /** Amount to bleed on right */
  right?: string;
  /** Amount to bleed on bottom */
  bottom?: string;
  /** Amount to bleed on left */
  left?: string;
  /** Horizontal bleed (left + right) */
  horizontal?: string;
  /** Vertical bleed (top + bottom) */
  vertical?: string;
  /** Disable bleed on mobile (reset margins to 0) */
  disableOnMobile?: boolean;
  /** Custom className */
  className?: string;
}

export const Bleed: React.FC<BleedProps> = ({
  children,
  amount,
  top,
  right,
  bottom,
  left,
  horizontal,
  vertical,
  disableOnMobile = false,
  className = '',
}) => {
  // Calculate margins (negative values to create bleed effect)
  const marginTop = top || vertical || amount || '0';
  const marginRight = right || horizontal || amount || '0';
  const marginBottom = bottom || vertical || amount || '0';
  const marginLeft = left || horizontal || amount || '0';

  const style: React.CSSProperties = {
    marginTop: marginTop !== '0' ? `-${marginTop}` : undefined,
    marginRight: marginRight !== '0' ? `-${marginRight}` : undefined,
    marginBottom: marginBottom !== '0' ? `-${marginBottom}` : undefined,
    marginLeft: marginLeft !== '0' ? `-${marginLeft}` : undefined,
  };

  const classes = [
    'Bleed',
    disableOnMobile && 'Bleed--disable-mobile',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};
