/**
 * PostMessage Handler Functions
 * 
 * Separerade handler-funktioner för olika message types
 * @author William
 * @since 2025-11-29
 */

import { buildCssVars } from '../../design/snippet';
import { ClientToParentMessage } from '../types';

// 🎨 Editing Mode Handler
export const handleEditingMode = (isEditingMode: boolean) => {
  if (typeof isEditingMode !== 'boolean') return;
  
  // Uppdatera HTML class
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (isEditingMode) {
      html.classList.add('editing-mode');
      html.classList.remove('production-mode');
    } else {
      html.classList.add('production-mode');
      html.classList.remove('editing-mode');
    }
  }
};

// 🎨 Design Tokens Handler  
export const handleDesignTokens = (
  tokens: any,
  setDesignTokens: (tokens: any) => void
) => {
  if (!tokens) return;
  
  setDesignTokens(tokens);
  
  // Generera och applicera CSS
  const newCSS = buildCssVars(tokens);
  const designStyle = document.querySelector('#design-css') as HTMLStyleElement;
  if (designStyle) {
    designStyle.innerHTML = newCSS;
  }
  
  // Uppdatera theme attribut
  const html = document.documentElement;
  if (tokens.themeTone) {
    html.setAttribute('data-theme-tone', tokens.themeTone);
  }
  if (typeof tokens.isDark === 'boolean') {
    html.setAttribute('data-theme', tokens.isDark ? 'dark' : 'light');
  }
};

// 🎨 Design Token Updates Handler
export const handleDesignTokenUpdates = (
  updates: any,
  designTokens: any,
  setDesignTokens: (tokens: any) => void
) => {
  if (!updates) return;
  
  // Merge updates med befintliga tokens
  const updatedTokens = { ...designTokens, ...updates };
  setDesignTokens(updatedTokens);
  
  // Generera och applicera CSS
  const newCSS = buildCssVars(updatedTokens);
  const designStyle = document.querySelector('#design-css') as HTMLStyleElement;
  if (designStyle) {
    designStyle.innerHTML = newCSS;
  }
};

// 📏 Height Request Handler
export const handleHeightRequest = (iframeId: string, width: number) => {
  if (!iframeId) return;
  
  // Vänta lite för att DOM ska hinna uppdateras
  setTimeout(() => {
    const contentHeight = Math.max(
      document.body.scrollHeight || 0,
      document.documentElement.scrollHeight || 0,
      document.body.offsetHeight || 0,
      document.documentElement.offsetHeight || 0
    );
    
    // Skicka tillbaka höjd till parent
    window.parent.postMessage({
      type: ClientToParentMessage.RequestedIframeHeight,
      payload: { 
        height: contentHeight, 
        iframeId,
        width 
      }
    }, '*');
  }, 100);
};

// 📝 Component Content Update Handler
export const handleComponentContentUpdate = (payload: any) => {
  const { componentKey, content } = payload;
  
  if (!componentKey || content === undefined) {
    console.warn('[EditingHandler] Invalid component update payload:', payload);
    return;
  }
  
  // Hitta component i DOM med data-component-key
  const componentElement = document.querySelector(`[data-component-key="${componentKey}"]`);
  
  if (componentElement) {
    // Uppdatera text content
    componentElement.textContent = content;
    console.log(`[EditingHandler] Updated component ${componentKey} with new content:`, content);
  } else {
    console.warn(`[EditingHandler] Component not found: ${componentKey}`);
  }
};