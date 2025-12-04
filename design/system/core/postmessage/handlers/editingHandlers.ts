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
  const { componentKey, fieldKey, content } = payload;
  
  if (!componentKey || !fieldKey || content === undefined) {
    console.warn('[EditingHandler] Invalid component update payload:', payload);
    return;
  }
  
  // Hitta component i DOM med data-component-key
  const componentElement = document.querySelector(`[data-component-key="${componentKey}"]`);
  
  if (componentElement) {
    // 🎯 Field-specific selectors baserat på fieldKey
    let targetElement: Element | null = null;
    
    switch (fieldKey) {
      case 'content':
        // Standard content - leta efter text-element
        targetElement = componentElement.querySelector('.btn-text, .text-label-md, [class*="text-"], span, p, h1, h2, h3, h4, h5, h6');
        break;
        
      case 'heading':
        // Leta efter heading-element (h1, h2, etc. eller .heading)
        targetElement = componentElement.querySelector('h1, h2, h3, .heading, [class*="heading"]');
        break;
        
      case 'subheading':
        // Leta efter subheading-element
        targetElement = componentElement.querySelector('.subheading, [class*="subheading"], .subtitle');
        break;
        
      case 'description':
        // Leta efter description/body text
        targetElement = componentElement.querySelector('.description, [class*="description"], .body-text, p');
        break;
        
      case 'author':
        // Leta efter author-element
        targetElement = componentElement.querySelector('.author, [class*="author"]');
        break;
        
      case 'text':
        // För testimonials - leta efter main text
        targetElement = componentElement.querySelector('.testimonial-text, .text, blockquote, p');
        break;
        
      case 'href':
        // För länkar - uppdatera href attribut
        if (componentElement.tagName === 'A' || componentElement.querySelector('a')) {
          const linkElement = componentElement.tagName === 'A' ? componentElement : componentElement.querySelector('a');
          if (linkElement) {
            (linkElement as HTMLAnchorElement).href = content;
            console.log(`[EditingHandler] Updated href in ${componentKey} to:`, content);
            return;
          }
        }
        break;
        
      case 'label':
        // För form labels
        targetElement = componentElement.querySelector('label, .label, [class*="label"]');
        break;
        
      case 'placeholder':
        // För form placeholders - uppdatera placeholder attribut
        const inputElement = componentElement.querySelector('input, textarea');
        if (inputElement) {
          (inputElement as HTMLInputElement | HTMLTextAreaElement).placeholder = content;
          console.log(`[EditingHandler] Updated placeholder in ${componentKey} to:`, content);
          return;
        }
        break;
        
      default:
        // Fallback - leta efter första text-element
        targetElement = componentElement.querySelector('.btn-text, .text-label-md, [class*="text-"], span, p, h1, h2, h3, h4, h5, h6');
        break;
    }
    
    if (targetElement) {
      targetElement.textContent = content;
      console.log(`[EditingHandler] Updated ${fieldKey} in component ${componentKey} with:`, content);
    } else {
      // Fallback: uppdatera hela komponenten
      componentElement.textContent = content;
      console.log(`[EditingHandler] Updated entire component ${componentKey} with:`, content);
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