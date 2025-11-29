/**
 * IFrame Height Communication Hook
 * 
 * Hook för höjdkommunikation mellan iframe och parent
 * @author William
 * @since 2025-11-25
 */

'use client';

import { useEffect } from 'react';
import { isOriginAllowed } from '../cors';
import { CLIENT_TO_PARENT_MESSAGES, PARENT_TO_CLIENT_MESSAGES } from '../types';

/**
 * Hook som hanterar höjdkommunikation mellan iframe och parent
 * Skickar höjduppdateringar och svarar på höjdförfrågningar
 */
export function useIFrameHeight(): void {
  useEffect(() => {
    // Endast körs i iframe context
    if (typeof window === 'undefined' || window === window.parent) {
      return;
    }

    // Funktion för att beräkna höjd baserat på width
    const calculateHeightForWidth = (targetWidth: number): number => {
      // Skapa en temporär container för att mäta innehåll vid specifik bredd
      const testContainer = document.createElement('div');
      testContainer.style.width = `${targetWidth}px`;
      testContainer.style.position = 'absolute';
      testContainer.style.left = '-9999px';
      testContainer.style.top = '0';
      testContainer.style.visibility = 'hidden';
      testContainer.style.height = 'auto';
      testContainer.innerHTML = document.body.innerHTML;
      
      document.body.appendChild(testContainer);
      const height = testContainer.scrollHeight;
      document.body.removeChild(testContainer);
      
      return height;
    };

    const sendHeight = (iframeId?: string, targetWidth?: number): void => {
      let height: number;
      
      if (targetWidth) {
        // Beräkna höjd för specifik bredd
        height = calculateHeightForWidth(targetWidth);
      } else {
        // Default: använd nuvarande bredd
        height = document.documentElement.scrollHeight;
      }
      
      window.parent.postMessage({
        type: CLIENT_TO_PARENT_MESSAGES.IFRAME_HEIGHT,
        payload: { 
          height, 
          iframeId // Inkludera iframe ID i svaret
        }
      }, '*');
      
      console.log(`[IFrameHeight] Height sent: ${height}px for iframe: ${iframeId || 'default'} (width: ${targetWidth || 'current'})`);
    };

    const handleMessage = (event: MessageEvent) => {
      // CORS säkerhetskontroll
      if (!isOriginAllowed(event.origin)) {
        return;
      }

      // Hantera width-specifika höjdförfrågningar
      if (event.data?.type === PARENT_TO_CLIENT_MESSAGES.REQUEST_HEIGHT) {
        const { iframeId, width } = event.data.payload || {};
        sendHeight(iframeId, width);
        console.log(`[IFrameHeight] Height requested for width: ${width}px, ID: ${iframeId}`);
      }
    };

    // Skicka initial höjd när komponenten mountas
    setTimeout(() => {
      sendHeight();
      console.log('[IFrameHeight] Initial height sent on mount');
    }, 500);

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
}