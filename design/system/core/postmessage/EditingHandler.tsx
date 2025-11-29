/**
 * PostMessage Editing Mode Component
 * 
 * Komponent som lyssnar på postMessage från parent för editing mode
 * Placeras i layout.tsx för att aktiveras globalt
 * @author William
 * @since 2025-11-17
 */

'use client';

import { useEditMode, useDesignCSS, useIFrameHeight, useDesignTokenUpdates } from './hooks';

/**
 * Komponent som lyssnar på postMessage från parent för editing mode
 */
export function EditingHandler() {
  const isEditing = useEditMode();
  
  useDesignCSS(isEditing);
  useIFrameHeight();
  useDesignTokenUpdates();
  
  return null; // Ingen UI, bara logik
}