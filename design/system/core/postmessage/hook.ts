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
import type { PostMessage, EditingModePayload, DesignTokensPayload } from './types';
import { EDITING_MODE_MESSAGE, DESIGN_TOKENS_MESSAGE } from './types';
import { applyEditingMode } from './applyEditingMode';
import { buildCssVars } from '../../../cms/wrappers/design/DesignSnippet';

/**
 * Lyssna på editing mode meddelanden och uppdatera HTML class
 * Hanterar också höjdkommunikation mellan iframe och parent
 * Hanterar design CSS visibility baserat på editing mode
 */
export function useEditingModeHandler() {
  const isEditing = applyEditingMode();

  // Hantera design CSS baserat på editing mode
  useEffect(() => {
    const designStyle = document.querySelector('head style#design-css') as HTMLStyleElement;
    
    if (designStyle) {
      if (isEditing) {
        // Spara original CSS för senare återställning
        if (!designStyle.dataset.originalCss) {
          designStyle.dataset.originalCss = designStyle.innerHTML;
        }
        
        // Rensa CSS innehållet - förbered för API-laddad CSS
        designStyle.innerHTML = '';
        console.log('🎨 Design CSS cleared - editing mode active');
        
        // TODO: I framtiden - ladda CSS från API här
        // loadEditingModeCSS().then(apiCss => {
        //   designStyle.innerHTML = apiCss;
        // });
        
      } else {
        // Återställ original CSS från server-side generering
        if (designStyle.dataset.originalCss) {
          designStyle.innerHTML = designStyle.dataset.originalCss;
          console.log('🎨 Design CSS restored - production mode active');
        }
      }
    } else {
      console.warn('⚠️ No design style element found with ID #design-css');
    }
  }, [isEditing]);

  useEffect(() => {
    // Endast körs i iframe context
    if (typeof window === 'undefined' || window === window.parent) {
      return;
    }

    // Funktion för att beräkna höjd baserat på width
    const calculateHeightForWidth = (targetWidth: number) => {
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

    const sendHeight = (iframeId?: string, targetWidth?: number) => {
      let height;
      
      if (targetWidth) {
        // Beräkna höjd för specifik bredd
        height = calculateHeightForWidth(targetWidth);
      } else {
        // Default: använd nuvarande bredd
        height = document.documentElement.scrollHeight;
      }
      
      window.parent.postMessage({
        type: 'IFRAME_HEIGHT',
        payload: { 
          height, 
          iframeId // Inkludera iframe ID i svaret
        }
      }, '*');
      
      console.log(`[EditingMode] Height sent: ${height}px for iframe: ${iframeId || 'default'} (width: ${targetWidth || 'current'})`);
    };

    const handleMessage = (event: MessageEvent) => {
      // CORS säkerhetskontroll för alla meddelanden
      if (!isOriginAllowed(event.origin)) {
        return;
      }

      // Hantera editing mode meddelanden
      if (event.data?.type === EDITING_MODE_MESSAGE) {
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
        
        // Skicka höjd för alla aktiva iframe:ar när editing mode ändras
        setTimeout(() => sendHeight(), 100);
        
        console.log(`[EditingMode] Updated to ${isEditing ? 'editing-mode' : 'production-mode'}`);
      }

      // ✨ Hantera design tokens meddelanden
      if (event.data?.type === DESIGN_TOKENS_MESSAGE) {
        const { designTokens } = event.data.payload;
        
        // Generera ny CSS från API design tokens
        const newCSS = buildCssVars({ globalStyles: designTokens });
        
        // Uppdatera design CSS i DOM
        const designStyle = document.querySelector('head style#design-css') as HTMLStyleElement;
        if (designStyle) {
          designStyle.innerHTML = newCSS;
          console.log('🎨 Design tokens applied from API');
        }
        
        // Uppdatera HTML attribut
        const html = document.documentElement;
        if (designTokens.themeTone) {
          html.setAttribute('data-theme-tone', designTokens.themeTone);
        }
        if (typeof designTokens.isDark === 'boolean') {
          html.setAttribute('data-theme', designTokens.isDark ? 'dark' : 'light');
        }

        // Skicka höjd efter CSS ändringar
        setTimeout(() => sendHeight(), 100);
      }
      
      // Hantera width-specifika höjdförfrågningar
      if (event.data?.type === 'REQUEST_HEIGHT') {
        const { iframeId, width } = event.data.payload || {};
        sendHeight(iframeId, width);
        console.log(`[EditingMode] Height requested for width: ${width}px, ID: ${iframeId}`);
      }
    };

    // Skicka höjd när komponenten mountas
    setTimeout(() => {
      sendHeight();
      console.log('[EditingMode] Initial height sent on mount');
    }, 500);

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
}