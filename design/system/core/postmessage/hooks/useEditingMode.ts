/**
 * Editing Mode Detection Hook
 * 
 * Hook för att lyssna på editing mode meddelanden och uppdatera HTML class
 * @author William
 * @since 2025-11-25
 */

'use client';

import { useEffect, useState } from 'react';
import { isOriginAllowed } from '../cors';
import { ParentToClientMessage } from '../types';
import { useHeightSync } from './useHeightSync';

/**
 * Hook som lyssnar på SetEditingMode postMessages och uppdaterar HTML class
 * Returnerar aktuell editing mode state
 */
export function useEditMode(): boolean {
  const [isEditing, setIsEditing] = useState(false);
  const syncHeight = useHeightSync();

  useEffect(() => {
    // Endast körs i iframe context
    if (typeof window === 'undefined' || window === window.parent) {
      return;
    }

    // Initial check av HTML class
    const checkInitialState = () => {
      const hasEditingClass = document.documentElement.classList.contains('editing-mode');
      setIsEditing(hasEditingClass);
    };

    checkInitialState();

    const handleMessage = (event: MessageEvent) => {
      // CORS säkerhetskontroll
      if (!isOriginAllowed(event.origin)) {
        return;
      }

      // Hantera editing mode meddelanden
      if (event.data?.type === ParentToClientMessage.SetEditingMode) {
        const { isEditing: newEditingState } = event.data.payload;
        const html = document.documentElement;
        
        // Uppdatera HTML class
        if (newEditingState) {
          html.classList.remove('production-mode');
          html.classList.add('editing-mode');
        } else {
          html.classList.remove('editing-mode');
          html.classList.add('production-mode');
        }
        
        setIsEditing(newEditingState);
        console.log(`[EditingMode] Updated to ${newEditingState ? 'editing-mode' : 'production-mode'}`);
        
        // Sync height after editing mode change
        syncHeight();
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return isEditing;
}