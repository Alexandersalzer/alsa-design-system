'use client';

import { useEffect } from 'react';
import { buildCssVars } from './snippet';
import { getDesignConfig } from './loaders';

export default function ClientDesignLoader() {

  useEffect(() => {
    const loadDesignTokens = async () => {
      try {
        const designConfig = await getDesignConfig();
        const tokens = designConfig?.globalStyles || {};
        
        // Generate CSS using existing buildCssVars function
        const css = buildCssVars(tokens);
        
        // Apply to style element
        const styleEl = document.getElementById('design-css');
        if (styleEl) {
          styleEl.textContent = css;
        }
        
        // Update HTML attributes
        const html = document.documentElement;
        html.setAttribute('data-theme-tone', tokens.themeTone || 'neutral');
        html.setAttribute('data-theme', tokens.isDark ? 'dark' : 'light');
        
        
      } catch (error) {
        console.warn('Failed to load design tokens, using defaults:', error);
        
        // Apply fallback design
        const html = document.documentElement;
        html.setAttribute('data-theme-tone', 'neutral');
        html.setAttribute('data-theme', 'light');
        html.classList.remove('production-mode');
        html.classList.add('design-fallback');
        
        // Apply minimal fallback CSS
        const styleEl = document.getElementById('design-css');
        if (styleEl) {
          styleEl.textContent = buildCssVars({}); // Use defaults
        }
      }
    };

    loadDesignTokens();
  }, []);

  return null;
}