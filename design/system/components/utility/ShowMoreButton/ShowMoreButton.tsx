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
        // Check the element's dataset to see which classes it originally had
        const originalClasses = element.getAttribute('data-original-hide-classes');
        if (originalClasses) {
          // Re-add the original hide classes
          originalClasses.split(' ').forEach(cls => {
            if (cls) element.classList.add(cls);
          });
        }
      });
    } else {
      // Expand - store original hide classes and remove them
      hiddenItemsRef.current.forEach((element) => {
        // Store the original hide classes in dataset before removing
        const hideClasses: string[] = [];
        if (element.classList.contains('hide-on-base')) hideClasses.push('hide-on-base');
        if (element.classList.contains('hide-on-md')) hideClasses.push('hide-on-md');

        if (hideClasses.length > 0) {
          element.setAttribute('data-original-hide-classes', hideClasses.join(' '));
        }

        // Remove the hide classes
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
