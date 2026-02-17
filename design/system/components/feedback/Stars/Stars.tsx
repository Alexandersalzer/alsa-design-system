import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import './Stars.css';

export interface StarsProps {
  /**
   * Rating value (1-5, supports decimals like 4.5)
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
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div
      className={`stars stars--${color} stars--${size} ${className}`.trim()}
      data-component-key={componentKey}
      aria-label={`${rating} out of ${maxStars} stars`}
    >
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star
          key={`full-${index}`}
          className="stars__icon stars__icon--filled"
          fill="currentColor"
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <StarHalf
          key="half"
          className="stars__icon stars__icon--half"
          fill="currentColor"
        />
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star
          key={`empty-${index}`}
          className="stars__icon stars__icon--empty"
          fill="none"
        />
      ))}
    </div>
  );
};

Stars.displayName = 'Stars';
