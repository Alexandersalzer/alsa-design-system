/**
 * PostMessage Editing Handler
 * 
 * Centraliserad postMessage hantering med smart routing för olika message types
 * Placeras i layout.tsx för att aktiveras globalt
 * @author William
 * @since 2025-11-17
 */

'use client';

import { useEffect, useState } from 'react';
import { ParentToClientMessage, ClientToParentMessage } from './types';
import { isOriginAllowed } from './cors';
import { buildCssVars } from '../design/snippet';

/**
 * Centraliserad EditingHandler med smart message routing
 */
export function EditingHandler() {
  const [isEditing, setIsEditing] = useState(false);
  const [designTokens, setDesignTokens] = useState<any>(null);

  
  // 🎯 Centraliserad message routing
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {

      const { type, payload } = event.data || {};
      
      if (!type) return;

      // 🚀 Smart message routing
      switch (type) {
        case ParentToClientMessage.SetEditingMode:
          handleEditingMode(payload?.isEditing);
          break;

        case ParentToClientMessage.SetInitialDesignTokens:
          handleDesignTokens(payload?.designTokens);
          break;

        case ParentToClientMessage.UpdateDesignToken:
          handleDesignTokenUpdates(payload?.updates);
          break;

        case ParentToClientMessage.RequestIframeHeight:
          handleHeightRequest(payload?.iframeId, payload?.width);
          break;

        default:
          console.warn('[EditingHandler] Unknown message type:', type);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 🎨 Editing Mode Handler
  const handleEditingMode = (isEditingMode: boolean) => {
    if (typeof isEditingMode !== 'boolean') return;
    
    setIsEditing(isEditingMode);
    
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
  const handleDesignTokens = (tokens: any) => {
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
  const handleDesignTokenUpdates = (updates: any) => {
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
  const handleHeightRequest = (iframeId: string, width: number) => {
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

  return null; // Ingen UI, bara logik
}