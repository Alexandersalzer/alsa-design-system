// ===============================================
// Spacer Component
// Responsive vertical spacing with multipliers
// ===============================================

import React from 'react';
import './Spacer.css';

type SpacerMultiplier = 0.5 | 1 | 1.25 | 1.5 | 1.75 | 2 | 2.5 | 3;

export interface SpacerProps {
  /** Desktop multiplier (default: 1.5) */
  desktop?: SpacerMultiplier;
  /** Mobile multiplier (default: 2.5) */
  mobile?: SpacerMultiplier;
  /** Optional className */
  className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({
  desktop = 1.5,
  mobile = 2.5,
  className = ''
}) => {
  return (
    <div
      className={`spacer ${className}`}
      style={{
        '--spacer-desktop-multiplier': desktop,
        '--spacer-mobile-multiplier': mobile,
      } as React.CSSProperties}
      aria-hidden="true"
    />
  );
};
