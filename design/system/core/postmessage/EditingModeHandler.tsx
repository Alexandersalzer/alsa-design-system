/**
 * PostMessage Editing Mode Component
 * 
 * Komponent som lyssnar på postMessage från parent för editing mode
 * Placeras i layout.tsx för att aktiveras globalt
 * @author William
 * @since 2025-11-17
 */

'use client';

import { 
  useEditMode, 
  useDesignCSS, 
  useIFrameHeight, 
  useDesignTokenUpdates 
} from './hooks';

/**
 * Komponent som lyssnar på postMessage från parent för editing mode
 * Placeras i layout.tsx för att aktiveras globalt
 * 
 * Använder nu separerade hooks för bättre separation of concerns
 */
export function EditingModeHandler() {
  const isEditing = useEditMode();
  
  useDesignCSS(isEditing);
  useIFrameHeight();
  useDesignTokenUpdates();
  
  return null; // Ingen UI, bara logik
}