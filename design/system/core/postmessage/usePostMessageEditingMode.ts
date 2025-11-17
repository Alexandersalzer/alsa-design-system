/**
 * PostMessage Editing Mode Hook
 * 
 * Hook för att lyssna på postMessage från parent och uppdatera HTML editing mode
 * Används i client-next layout för att ta emot editing mode från IM-dashboard
 * @author William
 * @since 2025-11-17
 */

'use client';

import { useEffect } from 'react';
import type { PostMessageData } from './types';

/**
 * Hook för att lyssna på postMessage från parent och uppdatera HTML editing mode
 */
export function usePostMessageEditingMode() {
  useEffect(() => {
    // Endast körs om vi är i en iframe (child window)
    if (typeof window === 'undefined' || window === window.parent) {
      return;
    }

    const handleMessage = (event: MessageEvent<PostMessageData>) => {
      // Säkerhetskontroll - endast acceptera meddelanden från våra domäner
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001', 
        'https://dashboard.blimpify.com',
        'https://im-dashboard.blimpify.com'
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        return;
      }

      // Kontrollera att det är rätt typ av meddelande
      if (event.data?.type === 'TOGGLE_EDITING_MODE') {
        const { isEditing } = event.data.payload;
        const html = document.documentElement;
        
        if (isEditing) {
          html.classList.remove('production-mode');
          html.classList.add('editing-mode');
        } else {
          html.classList.remove('editing-mode');
          html.classList.add('production-mode');
        }
        
        console.log(`[PostMessage] Updated HTML class to ${isEditing ? 'editing-mode' : 'production-mode'}`);
        
        // Skicka bekräftelse tillbaka till parent
        if (event.source && 'postMessage' in event.source) {
          (event.source as Window).postMessage({
            type: 'EDITING_MODE_UPDATED',
            payload: { 
              isEditing,
              success: true 
            }
          }, event.origin);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
}