/**
 * Design Token Updates Hook
 * 
 * Hook för att hantera design token uppdateringar via postMessage
 * @author William
 * @since 2025-11-25
 */

'use client';

import { useEffect } from 'react';
import { isOriginAllowed } from '../cors';
import { ParentToClientMessage } from '../types';
import { buildCssVars } from '../../design/snippet';
import { useHeightSync } from './useHeightSync';

/**
 * Hook som lyssnar på design token meddelanden och uppdaterar CSS
 * Hanterar både fullständiga token-uppdateringar och partiella live-updates
 */
export function useDesignTokenUpdates(): void {
  const syncHeight = useHeightSync();
  useEffect(() => {
    // Endast körs i iframe context
    if (typeof window === 'undefined' || window === window.parent) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      // CORS säkerhetskontroll
      if (!isOriginAllowed(event.origin)) {
        return;
      }

      // ✨ Hantera fullständiga design tokens meddelanden
      if (event.data?.type ===  ParentToClientMessage.SetInitialDesignTokens) {
        const { designTokens } = event.data.payload;
        
        // Generera ny CSS från API design tokens
        const newCSS = buildCssVars(designTokens);
        
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

        // Sync height after CSS changes
        syncHeight();
      }
      
      // ✨ Hantera partiella design token-uppdateringar (live updates)
      if (event.data?.type === ParentToClientMessage.UpdateDesignToken) {
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

          // Sync height after CSS changes
          syncHeight();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
}