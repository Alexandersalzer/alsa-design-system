/**
 * Hook for detecting editing mode state
 * 
 * Enkel hook för att komma åt editing mode state i React komponenter
 * @author William
 * @since 2025-11-18
 */

'use client';

import { useEffect, useState } from 'react';

/**
 * Hook som returnerar om editing mode är aktivt
 * Lyssnar på ändringar i HTML klassen för att uppdatera state
 */
export function useEditingMode(): boolean {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Kontrollera initial state
    const checkEditingMode = () => {
      if (typeof document !== 'undefined') {
        setIsEditing(document.documentElement.classList.contains('editing-mode'));
      }
    };

    // Kontrollera vid mount
    checkEditingMode();

    // Observera ändringar i HTML class attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkEditingMode();
        }
      });
    });

    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return isEditing;
}