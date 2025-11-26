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
import { MESSAGE_TYPES } from './types';
import { applyEditingMode } from './applyEditingMode';
import { buildCssVars } from '../design/snippet';

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
        type: MESSAGE_TYPES.IFRAME_HEIGHT,
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
      if (event.data?.type === MESSAGE_TYPES.TOGGLE_EDITING_MODE) {
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
      if (event.data?.type === MESSAGE_TYPES.UPDATE_DESIGN_TOKENS) {
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
      
      // ✨ Hantera partiella design token-uppdateringar (live updates)
      if (event.data?.type === MESSAGE_TYPES.DESIGN_TOKENS_UPDATE) {
        const { updates } = event.data.payload;
        
        if (updates) {
          const root = document.documentElement;
          
          // ===== THEME & VISUAL =====
          
          // Theme mode
          if (typeof updates.isDark === 'boolean') {
            root.style.setProperty('--is-dark', updates.isDark ? '1' : '0');
            root.setAttribute('data-theme', updates.isDark ? 'dark' : 'light');
            console.log(`🎨 Theme mode updated: ${updates.isDark ? 'dark' : 'light'}`);
          }

          // Theme tone
          if (updates.themeTone) {
            root.setAttribute('data-theme-tone', updates.themeTone);
            console.log(`🎨 Theme tone updated: ${updates.themeTone}`);
          }

          // Accent color
          if (updates.accentColor) {
            const isInverse = updates.accentColor === 'inverse';
            const levels = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000, 1100, 1200];
            
            if (isInverse) {
              levels.forEach(level => {
                root.style.setProperty(`--accent-${level}`, `var(--secondary-${level})`);
              });
            } else {
              levels.forEach(level => {
                root.style.setProperty(`--accent-${level}`, `var(--foundation-${updates.accentColor}-${level})`);
              });
            }
            console.log(`🎨 Accent color updated: ${updates.accentColor}`);
          }

          // Radius
          if (updates.radius) {
            const radiusScales = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'];
            radiusScales.forEach(scale => {
              root.style.setProperty(
                `--selected-radius-scale-${scale}`,
                `var(--foundation-radius-${updates.radius}-${scale})`
              );
            });
            console.log(`🎨 Radius updated: ${updates.radius}`);
          }

          // ===== TYPOGRAPHY =====
          
          if (updates.fontPrimary) {
            root.style.setProperty('--font-primary-name', `'${updates.fontPrimary}'`);
            console.log(`🎨 Primary font updated: ${updates.fontPrimary}`);
          }

          if (updates.fontSecondary) {
            root.style.setProperty('--font-secondary-name', `'${updates.fontSecondary}'`);
            console.log(`🎨 Secondary font updated: ${updates.fontSecondary}`);
          }

          if (updates.fontWeightScale) {
            root.style.setProperty('--selected-font-weight-heading', `var(--foundation-weightscale-${updates.fontWeightScale}-heading)`);
            root.style.setProperty('--selected-font-weight-body', `var(--foundation-weightscale-${updates.fontWeightScale}-body)`);
            root.style.setProperty('--selected-font-weight-label', `var(--foundation-weightscale-${updates.fontWeightScale}-label)`);
            console.log(`🎨 Font weight scale updated: ${updates.fontWeightScale}`);
          }

          if (updates.typographyScale) {
            const typographyProperties = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'];
            const lineHeightProperties = ['tight', 'snug', 'normal', 'relaxed', 'loose'];
            
            // Update font sizes
            typographyProperties.forEach(size => {
              root.style.setProperty(`--selected-font-size-${size}`, `var(--foundation-typography-${updates.typographyScale}-${size})`);
            });
            
            // Update line heights
            lineHeightProperties.forEach(leading => {
              root.style.setProperty(`--selected-leading-${leading}`, `var(--foundation-typography-${updates.typographyScale}-leading-${leading})`);
            });
            
            console.log(`🎨 Typography scale updated: ${updates.typographyScale}`);
          }

          // ===== LAYOUT & SPACING =====
          
          if (updates.layoutContent) {
            root.style.setProperty('--selected-layout-scale-content', `var(--foundation-layout-${updates.layoutContent}-content)`);
            console.log(`🎨 Layout content updated: ${updates.layoutContent}`);
          }

          if (updates.layoutMedia) {
            root.style.setProperty('--selected-layout-scale-media', `var(--foundation-layout-${updates.layoutMedia}-media)`);
            console.log(`🎨 Layout media updated: ${updates.layoutMedia}`);
          }

          if (updates.formWidth) {
            root.style.setProperty('--selected-form-width', `var(--foundation-form-${updates.formWidth}-width)`);
            console.log(`🎨 Form width updated: ${updates.formWidth}`);
          }

          if (updates.sectionSpacing) {
            root.style.setProperty('--selected-section-spacing', `var(--foundation-section-spacing-${updates.sectionSpacing})`);
            console.log(`🎨 Section spacing updated: ${updates.sectionSpacing}`);
          }

          if (updates.containerSpacing) {
            root.style.setProperty('--selected-container-spacing', `var(--foundation-container-spacing-${updates.containerSpacing})`);
            console.log(`🎨 Container spacing updated: ${updates.containerSpacing}`);
          }

          if (updates.navbarSpacing) {
            root.style.setProperty('--selected-navbar-spacing', `var(--foundation-navbar-spacing-${updates.navbarSpacing})`);
            console.log(`🎨 Navbar spacing updated: ${updates.navbarSpacing}`);
          }

          // Skicka höjd efter CSS ändringar
          setTimeout(() => sendHeight(), 100);
        }
      }

      // Hantera width-specifika höjdförfrågningar
      if (event.data?.type === MESSAGE_TYPES.REQUEST_HEIGHT) {
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