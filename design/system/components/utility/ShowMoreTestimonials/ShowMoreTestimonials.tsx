'use client';

import React, { useState } from 'react';
import { Button } from '../../actions/Button/Button';

export interface ShowMoreTestimonialsProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'brand' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  showMoreText?: string;
  showLessText?: string;
}

export const ShowMoreTestimonials: React.FC<ShowMoreTestimonialsProps> = ({
  size = 'sm',
  variant = 'secondary',
  showMoreText = 'Visa mer',
  showLessText = 'Visa färre'
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    // Find all hidden testimonial items
    const hiddenItems = document.querySelectorAll('.hide-on-base, .hide-on-md');

    if (expanded) {
      // Collapse - add hide classes back
      hiddenItems.forEach((item) => {
        const element = item as HTMLElement;
        const classes = element.className.split(' ');

        // Re-add the appropriate hide classes based on screen size
        if (window.innerWidth < 768 && !classes.includes('hide-on-base')) {
          element.classList.add('hide-on-base');
        } else if (window.innerWidth >= 768 && window.innerWidth < 1024 && !classes.includes('hide-on-md')) {
          element.classList.add('hide-on-md');
        }
      });
    } else {
      // Expand - remove hide classes
      hiddenItems.forEach((item) => {
        const element = item as HTMLElement;
        element.classList.remove('hide-on-base', 'hide-on-md');
      });
    }

    setExpanded(!expanded);
  };

  return (
    <Button
      variant={variant}
      size={size}
      content={expanded ? showLessText : showMoreText}
      onClick={handleClick}
    />
  );
};
