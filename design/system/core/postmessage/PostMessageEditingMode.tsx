/**
 * PostMessage Editing Mode Component
 * 
 * Komponent som lyssnar på postMessage från parent för editing mode
 * Placeras i layout.tsx för att aktiveras globalt
 * @author William
 * @since 2025-11-17
 */

'use client';

import { usePostMessageEditingMode } from './usePostMessageEditingMode';

/**
 * Komponent som lyssnar på postMessage från parent för editing mode
 * Placeras i layout.tsx för att aktiveras globalt
 */
export function PostMessageEditingMode() {
  usePostMessageEditingMode();
  return null; // Ingen UI, bara logik
}