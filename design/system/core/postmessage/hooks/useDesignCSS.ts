/**
 * Design CSS Management Hook
 * 
 * Hook för att hantera design.css visibility baserat på editing mode
 * @author William
 * @since 2025-11-25
 */

'use client';

import { useEffect } from 'react';

/**
 * Hook som hanterar design.css visibility baserat på editing mode
 * Rensar CSS i editing mode och återställer i production mode
 */
export function useDesignCSS(isEditing: boolean): void {
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
}