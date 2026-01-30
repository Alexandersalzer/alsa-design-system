import React from 'react';
import { StarIcon } from 'lucide-react';
import './Stars.css';

export interface StarsProps {
  /**
   * Rating value (1-5)
   */
  rating?: number;
  /**
   * Maximum number of stars
   */
  maxStars?: number;
  /**
   * Star color variant
   */
  color?: 'accent' | 'primary' | 'success' | 'warning' | 'error';
  /**
   * Size of the stars
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional className
   */
  className?: string;
  /**
   * Component key for live editing
   */
  componentKey?: string;
}

export const Stars: React.FC<StarsProps> = ({
  rating = 5,
  maxStars = 5,
  color = 'warning',
  size = 'sm',
  className = '',
  componentKey,
}) => {
  const filledStars = Math.min(Math.max(0, Math.floor(rating)), maxStars);

  return (
    <div
      className={`stars stars--${color} stars--${size} ${className}`.trim()}
      data-component-key={componentKey}
      aria-label={`${rating} out of ${maxStars} stars`}
    >
      {Array.from({ length: maxStars }).map((_, index) => (
        <StarIcon
          key={index}
          className={`stars__icon ${
            index < filledStars ? 'stars__icon--filled' : 'stars__icon--empty'
          }`}
          fill={index < filledStars ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
};

Stars.displayName = 'Stars';
