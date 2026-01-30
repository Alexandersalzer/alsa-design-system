'use client';

import React, { ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import './CardWithCornerIcon.css';

export interface CardWithCornerIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** The icon element to render in the corner cutout */
  icon?: ReactNode;
  /** Size of the corner cutout (and icon container) */
  cutoutSize?: 'sm' | 'md' | 'lg';
  /** Corner position for the cutout */
  cutoutPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Card variant styling */
  variant?: 'default' | 'elevated' | 'outlined' | 'accent-subtle';
  /** Padding inside the card */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** Border radius */
  radius?: 'sm' | 'md' | 'lg';
}

/**
 * CardWithCornerIcon - A card component with a square cutout in a corner
 * where an icon can be positioned outside the card bounds.
 * 
 * The cutout creates a visual effect where the corner appears "cut off"
 * with a rounded edge, and the icon floats in that space.
 */
export const CardWithCornerIcon: React.FC<CardWithCornerIconProps> = ({
  children,
  icon,
  cutoutSize = 'md',
  cutoutPosition = 'top-left',
  variant = 'default',
  padding = 'lg',
  radius = 'lg',
  className,
  ...props
}) => {
  return (
    <div 
      className={cn(
        'card-with-corner-icon',
        `card-with-corner-icon--cutout-${cutoutSize}`,
        `card-with-corner-icon--cutout-${cutoutPosition}`,
        `card-with-corner-icon--variant-${variant}`,
        `card-with-corner-icon--padding-${padding}`,
        `card-with-corner-icon--radius-${radius}`,
        className
      )}
      {...props}
    >
      {/* Icon container positioned in the cutout area */}
      {icon && (
        <div className="card-with-corner-icon__icon-container">
          {icon}
        </div>
      )}
      
      {/* Main card content */}
      <div className="card-with-corner-icon__content">
        {children}
      </div>
    </div>
  );
};

CardWithCornerIcon.displayName = 'CardWithCornerIcon';

export default CardWithCornerIcon;
