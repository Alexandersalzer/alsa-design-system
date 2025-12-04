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
import { ParentToClientMessage } from './types';
import { handleEditingMode, handleDesignTokens, handleDesignTokenUpdates, handleHeightRequest, handleComponentContentUpdate, handleHtmlAttributes, handleComponentVisibility
} from './handlers/editingHandlers';

/**
 * Centraliserad EditingHandler med smart message routing
 */
export function EditingHandler() {
  const [designTokens, setDesignTokens] = useState<any>(null);
  const [hiddenComponents, setHiddenComponents] = useState<Set<string>>(new Set());
  
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
          handleDesignTokens(payload?.designTokens, setDesignTokens);
          break;

        case ParentToClientMessage.UpdateDesignToken:
          handleDesignTokenUpdates(payload?.updates, designTokens, setDesignTokens);
          break;

        case ParentToClientMessage.RequestIframeHeight:
          handleHeightRequest(payload?.iframeId, payload?.width);
          break;

        case ParentToClientMessage.UpdateComponentContent:
          handleComponentContentUpdate(payload);
          break;

        case ParentToClientMessage.UpdateHtmlAttributes:
          handleHtmlAttributes(payload);
          break;

        case ParentToClientMessage.UpdateComponentVisibility:
          handleComponentVisibility(payload, setHiddenComponents);
          break;

        default:
          console.warn('[EditingHandler] Unknown message type:', type);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [designTokens]); // Add designTokens dependency for handleDesignTokenUpdates

  return null; // Ingen UI, bara logik
}