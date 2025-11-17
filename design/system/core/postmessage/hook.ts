/**
 * Editing Mode Listener Hook
 * 
 * Enkel hook för att lyssna på editing mode meddelanden och uppdatera HTML
 * @author William
 * @since 2025-11-17
 */

'use client';

import { useEffect } from 'react';
import { isOriginAllowed } from './cors';
import type { PostMessage, EditingModePayload } from './types';
import { EDITING_MODE_MESSAGE } from './types';

/**
 * Lyssna på editing mode meddelanden och uppdatera HTML class
 */
export function useEditingModeHandler() {
  useEffect(() => {
    // Endast körs i iframe context
    if (typeof window === 'undefined' || window === window.parent) {
      return;
    }

    const handleMessage = (event: MessageEvent<PostMessage<EditingModePayload>>) => {
      // CORS säkerhetskontroll
      if (!isOriginAllowed(event.origin)) {
        return;
      }

      // Kontrollera message type
      if (event.data?.type !== EDITING_MODE_MESSAGE) {
        return;
      }

      const { isEditing } = event.data.payload;
      const html = document.documentElement;
      
      // Uppdatera HTML class
      if (isEditing) {
        html.classList.remove('production-mode');
        html.classList.add('editing-mode');
      } else {
        html.classList.remove('editing-mode');
        html.classList.add('production-mode');
      }
      
      console.log(`[EditingMode] Updated to ${isEditing ? 'editing-mode' : 'production-mode'}`);
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
}