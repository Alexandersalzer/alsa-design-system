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
  // Set accent mode for inverse colors
  if (tokens.accentColor === 'inverse') {
    html.setAttribute('data-accent-mode', 'inverse');
  } else {
    html.removeAttribute('data-accent-mode');
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
    // Leta efter första text-element inuti komponenten
    const textElement = componentElement.querySelector('.btn-text, .text-label-md, [class*="text-"], span, p, h1, h2, h3, h4, h5, h6');
    
    if (textElement) {
      // Uppdatera text i text-elementet
      textElement.textContent = content;
      console.log(`[EditingHandler] Updated text in component ${componentKey} with new content:`, content);
    } else {
      // Fallback: uppdatera hela komponenten om ingen text-element hittas
      componentElement.textContent = content;
      console.log(`[EditingHandler] Updated entire component ${componentKey} with new content:`, content);
    }
  } else {
    console.warn(`[EditingHandler] Component not found: ${componentKey}`);
  }
};

// 🏷️ HTML Attributes Handler
export const handleHtmlAttributes = (payload: any) => {
  const { attributes } = payload;
  
  if (!attributes || typeof attributes !== 'object') {
    console.warn('[EditingHandler] Invalid HTML attributes payload:', payload);
    return;
  }
  
  const html = document.documentElement;
  
  Object.entries(attributes).forEach(([attr, value]) => {
    if (value === null) {
      html.removeAttribute(attr);
      console.log(`[EditingHandler] Removed HTML attribute: ${attr}`);
    } else {
      html.setAttribute(attr, value as string);
      console.log(`[EditingHandler] Set HTML attribute: ${attr}="${value}"`);
    }
  });
};

// 👁️ Component Visibility Handler
export const handleComponentVisibility = (payload: any, setHiddenComponents: (updater: (prev: Set<string>) => Set<string>) => void) => {
  const { componentKey, hidden } = payload;
  
  if (!componentKey || typeof hidden !== 'boolean') {
    console.warn('[EditingHandler] Invalid component visibility payload:', payload);
    return;
  }
  
  // Uppdatera hidden components state
  setHiddenComponents(prev => {
    const newSet = new Set(prev);
    if (hidden) {
      newSet.add(componentKey);
    } else {
      newSet.delete(componentKey);
    }
    return newSet;
  });
  
  console.log(`[EditingHandler] Component ${componentKey} visibility set to: ${hidden ? 'hidden' : 'visible'}`);
};