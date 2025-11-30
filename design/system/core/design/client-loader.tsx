'use client';

import { useEffect, useState } from 'react';
import { buildCssVars } from './snippet';
import type { DesignTokens } from '../types/design';

interface DesignConfig {
  globalStyles: DesignTokens;
}

export default function ClientDesignLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDesignTokens = async () => {
      try {
        // Add cache-busting timestamp
        const timestamp = Date.now();
        const response = await fetch(`/design/design.json?v=${timestamp}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to load design tokens: ${response.status}`);
        }
        
        const designConfig: DesignConfig = await response.json();
        const tokens = designConfig.globalStyles || {};
        
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
        
        // Remove production-mode class and add loaded class for potential styling hooks
        html.classList.remove('production-mode');
        html.classList.add('design-loaded');
        
        setIsLoaded(true);
        
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
        
        setIsLoaded(true);
      }
    };

    loadDesignTokens();
  }, []);

  // Optional: Add a loading indicator
  if (!isLoaded) {
    return (
      <div 
        id="design-loading" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '2px', 
          background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
          animation: 'pulse 2s infinite',
          zIndex: 9999 
        }}
      />
    );
  }

  return null; // This component doesn't render anything once loaded
}