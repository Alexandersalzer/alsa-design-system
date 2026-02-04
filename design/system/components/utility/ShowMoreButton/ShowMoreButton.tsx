'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../actions/Button/Button';

export interface ShowMoreButtonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'brand' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  showMoreText?: string;
  showLessText?: string;
}

export const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({
  size = 'sm',
  variant = 'secondary',
  showMoreText = 'Visa mer',
  showLessText = 'Visa färre'
}) => {
  const [expanded, setExpanded] = useState(false);
  const hiddenItemsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    // Store initially hidden items on mount
    const items = Array.from(document.querySelectorAll('.hide-on-base, .hide-on-md')) as HTMLElement[];
    hiddenItemsRef.current = items;
  }, []);

  const handleClick = () => {
    if (expanded) {
      // Collapse - re-apply hide classes to items that were originally hidden
      hiddenItemsRef.current.forEach((element) => {
        // Determine which hide class to apply based on screen size
        if (window.innerWidth < 768) {
          if (!element.classList.contains('hide-on-base')) {
            element.classList.add('hide-on-base');
          }
        } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
          if (!element.classList.contains('hide-on-md')) {
            element.classList.add('hide-on-md');
          }
        }
      });
    } else {
      // Expand - remove hide classes from stored items
      hiddenItemsRef.current.forEach((element) => {
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
