/**
 * Editing State Management
 * 
 * Skalbar lösning för att hantera editing mode state
 * Använder headers på server-side och DOM class på client-side
 * @author William
 * @since 2025-11-20
 */

import { headers } from 'next/headers';

/**
 * Kontrollerar om editing mode är aktivt
 * Server-side: Kollar headers för x-editing-mode eller x-blimpify-editing
 * Client-side: Kollar DOM class på html elementet
 */
export async function getEditingMode(): Promise<boolean> {
  // Client-side check
  if (typeof window !== 'undefined') {
    return document.documentElement.classList.contains('editing-mode');
  }
  
  // Server-side check - kolla headers
  try {
    const headersList = await headers();
    return headersList.get('x-editing-mode') === 'true' ||
           headersList.get('x-blimpify-editing') === 'true';
  } catch (error) {
    // Fallback om headers inte är tillgängliga
    console.warn('⚠️ Could not read headers for editing mode, defaulting to false:', error);
    return false;
  }
}

/**
 * Synkron version för client-side användning
 * Använd denna i React komponenter och hooks
 */
export function getEditingModeSync(): boolean {
  if (typeof window === 'undefined') {
    console.warn('⚠️ getEditingModeSync called on server-side, use getEditingMode() instead');
    return false;
  }
  
  return document.documentElement.classList.contains('editing-mode');
}